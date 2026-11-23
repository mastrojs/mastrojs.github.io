---
title: "Mastro v0.9: goodbye Deno, hello fetch-based middleware"
description: "Deno is dead, but Request/Response handlers are here to stay, and so is Mastro: v0.9 introduces middleware."
date: 2026-11-25
author: Mauro Bieg
authorLink: https://github.com/mb21
---

It’s hard to believe, but the [first commit](https://github.com/mastrojs/mastro/commit/a2f46a2ec822ba3118301fa42f3d07c89a1e0819) to Mastro was almost three years ago. The core vision outlined in that README still stands:

> I just wanted to see what the simplest web framework I could think of would look like that still offered a nice developer experience.
>
> No dependencies (except Deno's Standard Library).


## Mourning Deno

Well, about that. In case you haven’t heard, [Deno is pretty much dead](https://deno.com/blog/cloudflare) 😢

JSR (an alternative to the NPM registry) is still around, but for how long? Momentum is not on its side – despite Microsoft’s poor management of NPM. Moving Mastro to NPM at least gets us a [npmx.dev page](https://npmx.dev/package/@mastrojs/mastro). (If you have a Bluesky/at-proto account, please like us there!)

Fortunately, many of the features that once set Deno apart, are now built into Node.js as well. I’m still glad we started Mastro on Deno – it allowed us to build on top of web-native APIs when they were not yet in Node.js, letting us [live in the future](/blog/2025-10-27-what-learned-porting-from-deno-to-node-js/).

But for those of us with Deno-based projects, it means yet another migration. Ironic, considering part of Deno’s promise was fewer migrations and dependency updates because of sane, modern defaults, and a lot of built-in tooling. Moving the Mastro source repo to Node.js mostly meant adding a few `tsconfig.json` files, a formatter config file, replacing `deno.json` files with `package.json` ones, and a [small prepack script](https://github.com/mastrojs/mastro/blob/main/prepack.ts) to package things for NPM. But repeating all that across our nine [extension libs](/#extensions-%2F-plugins), and keeping those updated over the years, didn’t sound like fun.

That’s why we took the opportunity and merged those separate repositories into one monorepo. Setting everything up was still a bit of a pain, but now that we’ve figured out all the right settings and configs, we can edit `.ts` files in the core mastro package, and test the effects of those edits immediately across the other libs and example projects – all without a build step or copying a file.


## What's new in Mastro v0.9

Parallel to that, we had been working on a major new feature for Mastro.

### Middleware

Similar to other frameworks, middleware allows you to intercept requests before they hit your routes, and modify responses returned by upstream handlers. However, Mastro puts a somewhat unique twist on things:

1. Mastro's middleware API is explicitly modelled after a network proxy (e.g. like a Cloudflare Worker) – upstream is just the next middleware in the chain.
2. In Mastro, [everything already was a Request/Response handler](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/): you use the same standards-based fetch API not only for writing your server, but also for static site and asset generation. And guess what, a middleware is just a Request/Response handler as well!

Both `Middleware` and route handlers use the same underlying function type, just with a different second argument – the context parameter:

```ts
type Handler<C = Context> =
  (req: Request, ctx: C) => Response | Promise<Response>
```

The simplest middleware, which doesn't do anything except forwarding requests to upstream, is:

```ts
const identityMiddleware: Middleware = (req, ctx) =>
  ctx.fetchNext(req);
```

While middleware also runs when you statically generate a site, it's arguably more useful when running a server. A slightly more complex example using the standard [`Response.redirect`](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static) function:

```ts
const redirectMiddleware: Middleware = (req, ctx) => {
  const url = new URL(req.url);
  if (url.pathname === "/stories/") {
    return Response.redirect(new URL("/blog/", url));
  }
  return ctx.fetchNext(req);
}
```

We cannot wait to see what cool cusom middleware you build!
Check out the [Middleware docs](https://npmx.dev/package-docs/@mastrojs/mastro#typeAlias-Middleware) for more info.

We hesitated quite a bit before adding the middleware implementation – about 100 lines of code to Mastro, a >10% increase! But it's essentially a plugin system that we could move a bunch of built-in Mastro functionality into as well: static file serving, converting `*.client.ts` files to `*.client.js`, logging, and asset fingerprinting are all just middlewares now. They're included by default when you use the new `createApp` and `createFileRouterApp` factories, but you can remove them and add your own if you want. You can find those in the [`@mastrojs/mastro/server` export](https://npmx.dev/package-docs/@mastrojs/mastro#group-server).

But when you're in a serverless environment (Cloudflare Worker, Netlify functions, [Service Workers](blog/2026-03-09-whatever-happened-to-js-service-workers/), etc), you call [`new Mastro()`](https://npmx.dev/package-docs/@mastrojs/mastro#class-Mastro) directly, and you don't get any of the default middlewares, because these things are handled by the platform already (e.g. static file serving over the CDN). From a Mastro implementation perspective, this restructuring allowed us to remove a few hacky dynamic imports, and instead move to a “correct by construction” server initialization. Using Mastro with a bundler like esbuild (which e.g. Cloudflare Wrangler uses under the hood), now naturally tree-shakes away all the stuff we don’t need there.

### Routers

Another thing turned inside out is the router implementations. Mastro started out with only a file-based router (similar to Astro or Next.js’s routers). Later, we also added a programmatic router (think Express or Hono). After multiple rounds of iterations, what became clear in the latest refactor, is that the simplest way to implement these two functionalities is to have the programmatic router be the base case (the [`Mastro` class](https://npmx.dev/package-docs/@mastrojs/mastro#class-Mastro)), and have the file-based router use that under the hood.

### Node.js and the fetch server API

Finally, with a native `Deno.serve`-like function in Node.js still missing (yes, after all [these years](https://github.com/nodejs/help/issues/4174), although it’s being [worked on now](https://github.com/nodejs/node/pull/67447)), we took another close look at our Node.js adapter. Our old Node.js template was using `@remix-run/node-fetch-server`, but [`srvx`’s benchmarks](https://github.com/h3js/srvx/tree/main/test/bench-node) finally won us over to [srvx](https://srvx.h3.dev) (after we reproduced a speedup in the [framework-tracker](https://github.com/e18e/framework-tracker/)’s HTTP benchmark ourselves).

## Getting Mastro v0.9

You can create a new Mastro project with the following command:

```sh
pnpm create @mastrojs/mastro@latest
```

If you’re interested, check out the [changes to the source code](https://github.com/mastrojs/mastro/commit/c6c575d99e48396f4ac51684c48667f8818f7675). A good place to start is also [this README](https://github.com/mastrojs/mastro/tree/main/libs/mastro/src#readme).

If you have thoughts or ideas, or would just like to say hi, we have a [Discord](https://discord.gg/gmw2VEW5Rw) and are [on GitHub](https://github.com/mastrojs/mastro). We'd love to see you there!


## Migrating from older Mastro versions

What does all that mean for you, if you have a Mastro project? Well, it depends.

### Migrate from Deno

If you were previously on Deno, you need to:

- Rename your `deno.json` to `package.json` and adjust all the relevant fields, or just start with the [`package.json` file from the new Node.js template](https://github.com/mastrojs/mastro/blob/main/examples/basic-node/package.json).
- Get used to typing `pnpm run start` instead of `deno task start` etc. (and update the respective commands in your CI pipeline).
- If you’re using TypeScript, add a [`tsconfig.json` file](https://github.com/mastrojs/mastro/blob/main/examples/basic-node/tsconfig.json).

Then on to the following:

### Breaking changes

Even if you’re already on Node.js or Bun, update your `package.json` to what we have in the [Node template](https://github.com/mastrojs/mastro/tree/main/examples/basic-node) and [Bun template](https://github.com/mastrojs/mastro/tree/main/examples/basic-bun) now (the package is now on NPM instead of JSR, and the `generate` command has changed).

Finally, there are two more changes to Mastro that you need to be aware of.

1. The `@mastrojs/mastro/server` export has no default fetch export anymore. If you haven’t made many customizations, it’s easiest to copy over the [`server.ts` file from the new Node.js template](https://github.com/mastrojs/mastro/blob/main/examples/basic-node/server.ts) (or [bun template](https://github.com/mastrojs/mastro/blob/main/examples/basic-bun/server.ts)) and replace your existing one.

2. If you have a route with [parameters](https://mastrojs.github.io/docs/routing/#route-parameters):

   ```ts title=routes/blog/[slug].server.ts del={1-3} ins={4-6}
   import { getParams } from "@mastrojs/mastro";
   export const GET = (req: Request) => {
     const { slug } = getParams(req);
   import { type Handler } from "@mastrojs/mastro";
   export const GET: Handler = (req, ctx) => {
     const { slug } = ctx.params;
   ```

That’s it. The rest should all pretty much still work exactly the same.

Sorry for the trouble! But for those of us on Deno, we had a migration coming anyway, so now seemed a good time to roll out those changes.


## Mastro 1.0 when?

Considering that our goal with Mastro is to provide a stable foundation for your projects, hopefully this will be the last breaking change for a long time. And whatever you may say about Node.js feature set, it's been a solid runtime for more than a decade, with few breaking changes.

Let us know what you think, and whether we should call it Mastro v1.0 anytime soon.
