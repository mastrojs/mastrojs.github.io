---
title: "Installation and setup"
---

There are [various way to run Mastro](/guide/cli-install/#different-ways-to-run-mastro).

<a href="/#powerful-for-experienced-developers" class="button">Install Mastro (CLI)</a>
<a href="/guide/setup/" class="button -minimal">VS Code for Web (online)</a>


## SSG and SSR

Mastro supports both _static site generation_ (SSG), and running a server with on-demand _server-side rendering_ (SSR). See the guide for [advantages and disadvantages of each mode](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#static-site-generation-vs-running-a-server).

The good news is that both static site generation and running a server work the same with Mastro. You can even run a server and still [pregenerate some pages](/guide/bundling-assets/#build-step).

### Start a server

To start a local development server:

- Deno: `deno task start`
- Node.js: `pnpm run start`
- Bun: `bun run start`

This actually runs the same server as you would probably run in production for on-demand rendering (with the exception of the `--watch` flag). Check out the `deno.json`/`package.json`, which is just running the `server.ts` file that was in the template repo. This `server.ts` is the entrypoint to your application, and where you call the `mastro.fetch` handler – yes, Mastro is actually just a library.

### Generate a static site

- Deno: `deno task generate`
- Node.js: `pnpm run generate`
- Bun: `bun run generate`

This will create a `generated` folder by passing synthetic `Request` objects to your route handlers.

To see the generate CLI options, append `--help`. For example: `deno task generate --help`


## Configuring a base path

If you're hosting your website on a sub-directory (e.g. `https://mydomain.org/sub-directory`), you need to prefix all absolute links that start with a slash with your base-path (`/sub-directory` in this case). This includes links to assets like CSS files, as well as internals links to other pages on your website.

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

While you can also just use JavaScript, Mastro supports [TypeScript](https://www.typescriptlang.org/) out of the box. Since Deno, Node.js and Bun all natively support type-stripping, server TypeScript files are directly read by the respective runtime (no transpilation).

However, browsers are not there yet. Therefore, files in the `routes/` folder that end with `*.client.ts` are transpiled to `*.client.js` on the fly using [ts-blank-space](https://www.npmjs.com/package/ts-blank-space) – both when they are served via the server, and when a static site is generated. This also rewrites imports from `.ts` to `.js`, e.g. `import foo from "./foo.ts"` is transformed to `import foo from "./foo.js"`. (To see the gory details, look for the `tsToJs` function in [Mastro's `staticFiles.ts`](https://github.com/mastrojs/mastro/blob/main/src/staticFiles.ts).)

Using `ts-blank-space`, which simply puts spaces and newlines where the types would have been, has the nice property of preserving the correct line numbers in error messages and stack traces. That's why we added it to Mastro, even though we're otherwise [no-bundler](/guide/bundling-assets/), and wouldn't add more disruptive transforms like JSX.

By itself, neither starting the server nor loading a `.client.ts` file will perform any type-checking. To check your project for type errors, run:

- Deno: `deno check`
- Node.js: `pnpm run check`
- Bun: `bun run check`

You porbably want to make sure this is executed as part of your deployment pipeline, for example by prepending `deno check &&` to your `generate` task in `deno.json` (or `pnpm run check &&` to `package.json` respectively).


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
