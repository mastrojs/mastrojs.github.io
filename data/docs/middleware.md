---
title: Middleware
---

Middleware allows you to intercept requests before they hit your routes, and modify responses
returned by upstream handlers.

Often, calling a shared helper function (like [jsonRoute](https://github.com/mastrojs/mastro/tree/main/libs/api))
in your routes is simpler. However, middleware can be useful if you have lots of routes,
or want to ensure you don't forget calling the helper function accidentally (e.g. for auth).

## Execution order

Multiple middlewares are executed in registration order. When a `Request` comes in, it first
hits the first middleware, which calls the next middleware in the chain, and so forth
– each middleware forming a layer in an onion, with your route handlers at the center.
On the way out, the `Response` is handed back, layer for layer, up the whole chain, with the
middlewares continuing their execution, in reverse order than on the way in.

This is conceptually similar to middleware in other JS frameworks like Express or Hono.
However, Mastro's middleware API is explicitly modelled after a network proxy. Thinking
of your middleware as a network proxy may be easier than the onion call chain described above.

If you use the `createApp` or `createFileRouterApp` factory from `@mastrojs/mastro/server`, be aware that the middleware they set will run before the ones you add later (e.g. static files will be served by the static file middleware without ever hitting your later middleware).
If that's a problem, use `new Mastro()` directly, import the default middlewares you need from `@mastrojs/mastro/server`, and add them in the desired order.

The simplest middleware, which doesn't do anything, is:

```ts title=middleware/identity.ts
import type { Middleware } from "@mastrojs/mastro";

export const identityMiddleware: Middleware = (req, ctx) =>
  ctx.fetchNext(req);
```

Or it can return early:

```ts title=middleware/redirect.ts
import type { Middleware } from "@mastrojs/mastro";

export const redirectMiddleware: Middleware = (req, ctx) => {
  const url = new URL(req.url);
  if (url.pathname === "/stories/") {
    return Response.redirect(new URL("/blog/", url));
  }
  return ctx.fetchNext(req);
}
```

Add it to your app with the `use` method:

```ts title=server.ts
import { createFileRouterApp } from "@mastrojs/mastro/server";
import { identityMiddleware } from "./middleware/identity.ts";
import { redirectMiddleware } from "./middleware/redirect.ts";

export const app = createFileRouterApp()
  .use(identityMiddleware)
  .use(redirectMiddleware)
```

Both middleware and [route handlers](/docs/routing/#route-handlers) use the same underlying function type, just with a different second argument – the context parameter:

```ts
import type { Context } from "@mastrojs/mastro";

type Handler<C = Context> =
  (req: Request, ctx: C) => Response | Promise<Response>
```

## Error handling

You don't need to wrap `ctx.fetchNext()` in `try...catch` – Mastro already does that for you and returns a 500 Response with an `error` field that contains whatever value was thrown. Be sure to check for `res.ok`, if your middleware should behave differently for 4xx or 5xx.

## Server and static site generation

Middlewares are run on every route.
When doing static site generation, they are run when you generate the site. In that case, returning 404 skips a page. Use the `Content-Disposition` HTTP header to override the output filename (don't include the directory).

When running a server, a middleware can be just a handler function (as seen above). For static site generation, if you also need to provide `getStaticPaths` or `afterGenerate`, use the object form (see [tsToJs](https://github.com/mastrojs/mastro/blob/main/libs/mastro/src/middlewares/tsToJs.ts) for an example).

## Locals

Middleware can set or update locals. When using TypeScript, you need to declare their type with a generic:

```ts
const authMiddleware: Middleware<{ user: User }> = async (req, ctx) => {
  const user = await loadUser(req.headers);
  return ctx.fetchNext(req, { user });
}

const app = new Mastro()
  .use(authMiddleware)
  .get("/", (_req, ctx) => new Response(ctx.locals.user.name));
```
