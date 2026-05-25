---
title: "Installation and setup"
---

There are [various way to run Mastro](/guide/cli-install/#different-ways-to-run-mastro).

<div class="col-2 gap-2">
<div>

[In a terminal](/guide/cli-install/#setup-local-development-server) with Deno, Node.js or Bun

<a href="/#powerful-for-experienced-developers" class="button">Install Mastro (CLI)</a>

</div>
<div>

Or in a browser with [VS Code for Web](https://code.visualstudio.com/docs/setup/vscode-web)

<a href="/guide/setup/" class="button -secondary">Launch Mastro in browser</a>

</div>
</div>

## SSG and SSR

Mastro supports both _static site generation_ (SSG), and running a server with on-demand _server-side rendering_ (SSR). See the guide for [advantages and disadvantages of each mode](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#static-site-generation-vs-running-a-server).

The good news is that both static site generation and running a server work the same with Mastro. You can even run a server and still [pregenerate some pages](/guide/bundling-assets/#build-step).

### Start a server

To start a local development server, run in your [terminal](/guide/cli-install/#setup-local-development-server):

- Deno: `deno task start`
- Node.js: `pnpm run start`
- Bun: `bun run start`

In [VSCode](https://code.visualstudio.com/), you can alternatively click "Run and Debug" in the left sidebar (`Ctrl-Shift-D`, or on macOS `Cmd-Shift-D`), and then the green ▶️ button "Start server".

Either way, this actually runs the same server as you would run in production for on-demand rendering (with the exception of the `--watch` flag). Check out the `start` task in `deno.json` (or `start` script in `package.json` respectively): it's just executing the `server.ts` file, which is the entrypoint to your application. Note that it's your code calling the `mastro.fetch` handler, so technically Mastro is just a library.

### Generate a static site

- Deno: `deno task generate`
- Node.js: `pnpm run generate`
- Bun: `bun run generate`

This will create a `generated` folder by passing synthetic `Request` objects to your route handlers.

To see the generate options, append `--help` (e.g. `deno task generate --help`).


## Configuring a base path

If you're hosting your website on a sub-directory (e.g. `https://mydomain.org/sub-directory`), you need to prefix all absolute links that start with a slash with your base-path (`/sub-directory` in this case). This includes links to assets like CSS files, as well as internal links to other pages on your website.

### GitHub Pages

This is very common when using GitHub Pages without a custom domain. It's needed when you're hosting on `https://my-name.github.io/my-repo` (instead of `https://my-name.github.io`). For GitHub Pages, Mastro has the [`ghPagesBasePath` helper function](https://jsr.io/@mastrojs/mastro/doc/~/ghPagesBasePath) built in (which will return e.g. `/my-repo` when run on GitHub Actions). You can use it like:

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
change the `generate` command in `deno.json` to:

```sh
BASEPATH='/my-path' deno task generate
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

Since Deno, Bun and [Node.js](https://nodejs.org/api/typescript.html#type-stripping) now all natively support type-stripping, Mastro doesn't need to do transform TypeScript files for the server – they are directly read by the JavaScript runtime.

However, browsers are not there yet. Therefore, Mastro transpiles files in the `routes/` folder that end with `*.client.ts` on the fly, and serves them under the same URL but ending in `*.client.js`. It also [rewrites imports](https://github.com/mastrojs/mastro/blob/main/src/tsToJs.ts) in those files from `.ts` to `.js`. For example `import { x } from "./foo.ts"` is transformed to `import { x } from "./foo.js"`.

Mastro is using [ts-blank-space](https://www.npmjs.com/package/ts-blank-space), which simply puts spaces and newlines where the types would have been. This means the line numbers in error messages and stack traces remain correct. That's why we added it to Mastro, even though we're otherwise [no-bundler](/guide/bundling-assets/), and wouldn't add more disruptive transforms like JSX.

By itself, neither starting the server nor loading a `.client.ts` file will perform any type-checking. To check your project for type errors, run:

- Deno: `deno check`
- Node.js: `pnpm run check`
- Bun: `bun run check`

You probably want to make sure this is executed as part of your deployment pipeline, for example by prepending `deno check &&` to your `generate` task in `deno.json` (or `pnpm run check &&` to `package.json` respectively).


## Testing

To add tests, refer to the documentation of your platform's built-in test runner:

- [Deno](https://docs.deno.com/runtime/fundamentals/testing/) `deno test`
- [Node.js](https://nodejs.org/api/test.html#test-runner): `node --test`
- [Bun](https://bun.com/docs/test): `bun test`


## Middleware

While Mastro itself doesn't have the concept of a middleware, you can either:

- factor out the common code to a helper function and call that in every route,
- use a `[...slug]` route to consolidate paths, or
- if you're running a server, you can easily modify the `server.ts` file. For example in Deno:

```ts title=server.ts
import mastro from "@mastrojs/mastro/server";

Deno.serve(async (req) => {
  // modify request here before it hits your Mastro routes
  const res = await mastro.fetch(req);
  // modify response returned by your Mastro routes
  return res;
});
```

If there is demand, we could introduce a `@mastrojs/middleware` package that formalizes this concept somewhat.

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
              if (!unloading) setTimeout(() => location.reload(), 100);
            });
          </script>
        `}
```

Then check your `deno.json`/`package.json` file to make sure you [start your dev server](#start-a-server) with the `--watch` flag, which causes your server to restart on file changes. When that happens, the network request to `/watch-change` will be aborted, which in turn causes our client-side JavaScript to reload the page after 100ms.
