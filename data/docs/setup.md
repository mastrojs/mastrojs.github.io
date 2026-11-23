---
title: "Setup"
---

- [Static site generation vs server](#static-site-generation-vs-server)
- [Base path for static sites](#configuring-a-base-path)
- [TypeScript](#typescript)
- [Testing](#testing)
- [404 page for static sites](#custom-404-error-page-for-static-sites) and [404 and 500 pages for server](#custom-404-and-500-error-pages-when-running-a-server)
- [Auto-reloading page in development](#auto-reloading-page-in-development)

## Static site generation vs server

Mastro supports both _static site generation_ (SSG), and running a server with on-demand _server-side rendering_ (SSR). See the guide for [advantages and disadvantages of each mode](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#static-site-generation-vs-running-a-server).

The good news is that both static site generation and running a server work the same with Mastro. You can even run a server and still [pregenerate some pages](/guide/bundling-assets/#build-step).

### Start a server

To start a local development server, run in your [terminal](/guide/cli-install/#setup-local-development-server):

```sh
pnpm run start
```

In [VSCode](https://code.visualstudio.com/), you can alternatively click "Run and Debug" in the left sidebar (`Ctrl-Shift-D`, or on macOS `Cmd-Shift-D`), and then the green ▶️ button "Start server".

Either way, this actually runs the same server as you would run in production for on-demand rendering (with the exception of the `--watch` flag). Check out the `start` script in `package.json`: it's just executing the `server.ts` file, which is the entrypoint to your application. Note that it's your code calling the Mastro handler, so technically Mastro is just a library.

### Generate a static site

```sh
pnpm run generate
```

This will create a `generated` folder by passing synthetic `Request` objects to your route handlers.

To see the generate options, append `--help` (e.g. `pnpm run generate --help`).


## Configuring a base path

If you're hosting your static website on a sub-directory (e.g. `https://mydomain.org/sub-directory`), you need to prefix all absolute links that start with a slash with your base-path (`/sub-directory` in this case). This includes links to assets like CSS files, as well as internal links to other pages on your website.

### GitHub Pages

This is very common when using GitHub Pages without a custom domain. It's needed when you're hosting on `https://my-name.github.io/my-repo` (instead of `https://my-name.github.io`). For GitHub Pages, Mastro has the [`ghPagesBasePath` helper function](https://npmx.dev/package-docs/@mastrojs/mastro#variable-ghPagesBasePath) built in (which will return e.g. `/my-repo` when run on GitHub Actions). You can use it like:

```ts title=components/Layout.ts
import { ghPagesBasePath, html } from "@mastrojs/mastro";
// we export `basePath` for use in other modules
export const basePath = ghPagesBasePath();
export const GET = () =>
  html`
    <html>
      <head>
        <link href=${basePath + "/styles.css"}>
  `;
```

### Other hosts

If you're not on GitHub Pages, but still hosting in a sub-directory, you can
change the `generate` command in `package.json` to:

```sh
BASEPATH='/my-path' mastro generate
```

This sets an environment variable (if you're building on Windows without WSL, the syntax will be slightly different). You can read it out like:

```ts title=components/Layout.ts
// we export `basePath` for use in other modules
export const basePath = process.env.BASEPATH || "";
export const GET = () =>
  html`
    <html>
      <head>
        <link href=${basePath + "/styles.css"}>
  `;
```


## TypeScript

In addition to JavaScript, Mastro also supports [TypeScript](https://www.typescriptlang.org/) out of the box.

Since Node.js now [supports type-stripping](https://nodejs.org/api/typescript.html#type-stripping), Mastro doesn't need to transform TypeScript files for the server – they are directly read by the JavaScript runtime.

However, browsers are not there yet. Therefore, the Mastro dev server transpiles files in the `routes/` folder that end with `*.client.ts` on the fly, and serves them under the same URL but ending in `*.client.js`. It also [rewrites imports](https://github.com/mastrojs/mastro/blob/main/libs/mastro/src/middlewares/tsToJs.ts) in those files from `.ts` to `.js`. For example `import { x } from "./foo.ts"` is transformed to `import { x } from "./foo.js"`.

The same transformation also happens during static site generation. For servers, you should run [`mastro generate --only-pregenerate`](/guide/bundling-assets/#build-step) to transform `*.client.ts` files before server startup.

Mastro is using the built-in [`stripTypeScriptTypes` from `node:module`](https://nodejs.org/api/module.html#modulestriptypescripttypescode-options), which simply puts spaces and newlines where the types would have been. This means the line numbers in error messages and stack traces remain correct. That's why we added it to Mastro, even though we're otherwise [no-bundler](/guide/bundling-assets/), and wouldn't add more disruptive transforms like JSX.

By itself, neither starting the server nor loading a `.client.ts` file will perform any type-checking. To check your project for type errors, run:

```sh
pnpm run check
```

You probably want to make sure this is executed as part of your deployment pipeline, for example by prepending `pnpm run check &&` to your `generate` task in `package.json`.


## Testing

To add tests, refer to the documentation of your platform's built-in test runner:

- [Node.js](https://nodejs.org/api/test.html#test-runner): `node --test`
- [Bun](https://bun.com/docs/test): `bun test`


## Custom 404 error page for static sites

For static sites, this may need to be configured with your host, but a lot of them support a `404.html` file in the root: just place it in `routes/404.html` and it should work.
You can also generate one with a `routes/404.html.server.ts` file instead.


## Custom 404 and 500 error pages when running a server

If you're running a server, you can add a custom [middleware](https://npmx.dev/package-docs/@mastrojs/mastro#typeAlias-Middleware) like:

```ts title=middleware/notFound.ts
import { html, htmlToResponse, type Middleware } from "@mastrojs/mastro";

export const notFoundMiddleware: Middleware = async (req, ctx) => {
  const res = await ctx.fetchNext(req);
  if (res.status === 404) {
    return htmlToResponse(page, 404, res.headers);
  }
  return res;
}

const page = html`
  <!doctype html>
  <h1>404</h1>
`;
```

```ts title=server.ts
import { createFileRouterApp } from "@mastrojs/mastro/server";
import { notFoundMiddleware } from "./middleware/notFound.ts";

export const app = createFileRouterApp()
  .use(notFoundMiddleware)
```

A 5xx error handler would look similar, matching on `res.status >= 500` instead. In that case, it's best to use a static string with self-contained HTML, because if you do anything fancy in your 5xx error handler, you risk your error handler breaking itself.


## Auto-reloading page in development

Mastro has no magic auto-reloading or HMR (hot module replacement) functionality built in. But you can add it by first creating a new route on the server:

```ts title=routes/watch-change.server.ts
// To enable auto-reloading via long polling, this route never resolves.
export const GET = (req: Request) =>
  new URL(req.url).hostname === "localhost"
    ? new Promise(() => undefined)
    : new Response("Not found", { status: 404 })
```

And then calling the route from the client as follows:

```ts title=components/Layout.ts ins={4,12-21}
interface Props {
  title: string;
  children: Html;
  req: Request;
}

export const Layout = (props: Props) =>
  html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${new URL(props.req.url).hostname === "localhost" && html`
          <script type="module">
            let unloading = false;
            addEventListener("beforeunload", () => { unloading = true });
            fetch("/watch-change").catch(() => {
              // give the dev server 100ms to restart:
              if (!unloading) setTimeout(() => location.reload(), 150);
            });
          </script>
        `}
```

Then check your `package.json` file to make sure you [start your dev server](#start-a-server) with the `--watch` flag, which causes your server to restart on file changes of any imported files (or alternatively the `--watch-path .` option which watches also new files in `routes` and `data`). When your server restarts, the network request to `/watch-change` will be aborted, which in turn causes our client-side JavaScript to reload the page after 100ms.

If you call srvx's `serve` function, be sure to speed this up (at least in dev):

```ts title=server.ts del={1} ins={2}
serve({ fetch: app.createHandler() });
serve({ fetch: app.createHandler(), gracefulShutdown: false });
```
