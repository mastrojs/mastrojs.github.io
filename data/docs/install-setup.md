---
title: "Installation and setup"
---

There are [various way to run Mastro](/guide/cli-install/). If you prefer the command-line over running Mastro in the browser as a VS Code extension, make sure one of the following JavaScript runtimes is installed. If you're unsure which runtime to pick, we recommend [Deno](https://deno.com).

Running one of the following commands downloads the corresponding template repository into a newly created folder.

### Deno

```sh
deno run -A npm:@mastrojs/create-mastro@0.0.8
```

Or use the [template repo](https://github.com/mastrojs/template-basic-deno).

### Node.js

Mastro supports [Node.js >= 24](https://nodejs.org/en/about/previous-releases). `pnpm` is [recommended](https://jsr.io/docs/npm-compatibility), although `npm` and `yarn` also work.

```sh
pnpm create @mastrojs/mastro@0.0.8
```

Or use the [template repo](https://github.com/mastrojs/template-basic-node).

### Bun

```sh
bun create @mastrojs/mastro@0.0.8
```

Or use the [template repo](https://github.com/mastrojs/template-basic-bun).


## SSG, SSR and deploying

Mastro supports both _static site generation_ (SSG) and running a server with on-demand _server-side rendering_ (SSR).

To start your local development server, run:

- Deno: `deno task start`
- Node.js: `pnpm run start`
- Bun: `bun run start`

This actually runs the same server as you would probably run in production for on-demand rendering (with the exception of the `--watch` flag). Check out the `deno.json`/`package.json`, which is just running the `server.ts` file that was in the template repo. This `server.ts` is the entrypoint to your application, and where you call the `mastro.fetch` handler – yes, Mastro is basically just a library.

To generate a static site, run:

- Deno: `deno task generate`
- Node.js: `pnpm run generatet`
- Bun: `bun run generatet`

This will create a `generated` folder by passing synthetic `Request` objects to your route handlers.

To publish your website, see [deploy to production in the guide](/guide/deploy/).


## TypeScript

While you can also just use JavaScript, Mastro supports [TypeScript](https://www.typescriptlang.org/) out of the box. Since Deno, Node.js and Bun support type-stripping TypeScript on the fly, server files are directly executed by the respective runtime.

However, browsers are not there yet. Therefore, files in the `routes/` folder that end with `*.client.ts` are transpiled to `*.client.js` on the fly using [ts-blank-space](https://www.npmjs.com/package/ts-blank-space) – both when they are served via the server, and when a static site is generated. This also rewrites imports from `.ts` to `.js`, e.g. `import foo from "./foo.ts"` is transformed to `import foo from "./foo.js"`. (To see the gory details, look for the `tsToJs` function in [Mastro's `server.ts` implementation](https://github.com/mastrojs/mastro/blob/main/src/server.ts).).

By itself, neither starting the server nor loading a `.client.ts` file will perform any type-checking. To check your project for type errors, run:

- Deno: `deno check`
- Node.js: `pnpm run check`
- Bun: `bun run check`

You may want to make sure this is executed as part of your deployment pipeline, for example by prepending `deno check &&` to your `generate` task in `deno.json` (or `pnpm run check &&` to `package.json` respectively).


## Testing

To add tests, refer to the documentation of your platform's built-in test runner:

- [Deno](https://docs.deno.com/runtime/fundamentals/testing/) `deno test`
- [Node.js](https://nodejs.org/api/test.html#test-runner): `node --test`
- [Bun](https://bun.com/docs/test): `bun test`


## Middleware

While Mastro itself doesn't have the concept of a middleware, you can easily run some code on each request that hits your on-demand rendering server by modifying the `server.ts` file. For example in Deno:

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


## Bundling, build/pregenerate step and asset pipeline

To bundle client-side JavaScript, CSS or transform images, see [Bundling, pregenerating assets and caching in the guide](/guide/bundling-assets-caching/)
