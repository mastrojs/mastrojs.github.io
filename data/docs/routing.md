---
title: "Routing"
---

In Mastro, [everything is a route](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/).
There are no configuration files, and only one special folder: the `routes` folder. It supports three different kinds of files:

1. [Unprocessed static files](#unprocessed-static-files): any file in the `routes` folder that doesn’t match the patterns below is served to the browser unchanged. Naming is up to you, e.g. `routes/favicon.ico`, `routes/styles.css`, or `routes/scripts.js`)
2. [Route handlers](#route-handlers): each `*.server.js` (or `*.server.ts`) file represents a route, which runs code on the server to generate one or more pages. (Mastro has both a [file-based](#the-file-based-router-(default)) and a [programmatic router](#programmatic-router).)
3. [TypeScript](/docs/setup/#typescript) files for the browser: because browsers don't support TypeScript, Mastro type-strips `*.client.ts` files and serves them as `*.client.js`.


## Unprocessed static files

The simplest Mastro website is thus a single `routes/index.html` file, which will be sent out unprocessed.

Other static assets can also be placed there.
For example, if you'd like to have a folder called `assets`, create it. Then place files in it, like `routes/assets/styles.css` and `routes/assets/scripts.js`. You can then reference them like:

```html title=routes/index.html
<!doctype html>
<html lang="en">
  <head>
    <title>My page</title>
    <link rel="stylesheet" href="/assets/styles.css">
    <script type="module" src="/assets/scripts.js"></script>
  </head>
  <body>
    <h1>My page</h1>
  </body>
</html>
```

See the Mastro guide for [more about CSS](/guide/css/#want-to-learn-more-css%3F), vanilla [client-side JavaScript](/guide/interactivity-with-javascript-in-the-browser/), and [Reactive Mastro](/reactive/).


## Links to other pages

To link to other pages, use the standard [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) element. To place images on your page, use the standard [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) element. Mastro does not use special `<Link>` or `<Image>` constructs.

For links (and other references to files and routes), it's easiest to always use _absolute paths_ that start with a `/` (for example `href="/assets/styles.css"` above). That way the links work on all of your pages, regardless of what the current page's URL is.


## The file-based router (default)

While Mastro also comes with an Express-like [programmatic router](#programmatic-router), the default router is file-based. This means the folder structure determines under what URL a route is served.

Just like [unprocessed static files](#unprocessed-static-files), route handlers in Mastro are also placed in the `routes` folder. But if a file is named `*.server.js` (or `*.server.ts`), it's a route handler, and contains JavaScript functions to handle the generation of the pages at that route. (Some people call route handlers also page handlers.)


## Route handlers

A route handler is a function that receives a standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object, and returns a standard [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object (or a `Promise` of such, meaning the function can be `async`).

Using the default file-based router, this function needs to be exported under the name of an HTTP method. For example for an HTTP GET:

```ts title=routes/index.server.ts
export const GET = (req: Request) => {
  return new Response("Hello World");
}
```

Since they return a standard `Response` object, route handlers can be used to generate HTML, JSON, XML, plain text (like the above example), binary data such as images, or whatever else you can think of. If you're [running a server](/docs/setup/#start-a-server), a `Response` can also [represent a redirect](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static).

For more advanced features, Mastro also passes a second argument to handlers: the [context](https://npmx.dev/package-docs/@mastrojs/mastro/v/0.9.2#typeAlias-Context).

```ts title=routes/index.server.ts
import { type Handler } from "@mastrojs/mastro";

export const GET: Handler = (req, ctx) => {
  return new Response("Hello World");
}
```


## Files and folders

Different hosting providers often serve the same file under many [slightly different urls](https://github.com/slorber/trailing-slash-guide/blob/main/docs/Hosting-Providers.md). But if a URL works with Mastro's dev server, it should work with your hosting provider (but not necessarily the other way around).

A URL that does not end with a slash represents a file. A URL that ends with a slash represents a folder (an `index.html` or `index.server.js` file is used to represent its containing folder):

| File in `routes/`             | Route type | URL          |
|:------------------------------|:-----------|:-------------|
| `file.html`                   | static     | `/file.html` |
| `file.html.server.js`         | handler    | `/file.html` |
| `file.server.js`              | handler    | `/file` (no extension) |
| `folder/index.html`           | static     | `/folder/`   |
| `folder/index.server.js`      | handler    | `/folder/`   |
| `folder/(folder).server.js`   | handler    | `/folder/`   |
| `folder/index.html.server.js` | handler    | `/folder/`   |

Since having lots of files called `index.server.js` can get confusing, you can also name it `(folder).server.js`, where `folder` is the name of the containing folder.


## Route parameters

Using route parameters, a single route can represent many different pages with the same basic url structure. For example, to match any URL of the form `/blog/*`, you could use a route parameter called `slug`:

```ts title=routes/blog/[slug].server.ts
import { type Handler } from "@mastrojs/mastro";

export const GET: Handler = (req, ctx) => {
  const { slug } = ctx.params;
  return new Response(`Current URL path is /blog/${slug}`);
}
```

Above, `slug` is just an example name for the parameter. You can **name parameters whatever** you want, as long as it's alphanumeric. (Mastro uses the standard `URLPattern` API under the hood.)

To capture URL segments containing slashes (often called **rest parameters**), use `[...slug]` instead of `[slug]`.

Both of these can be used as the name of a folder inside `routes/`, or like above, as part of the route handler file name.

When you're using Mastro as a **static site generator** and have a route with a route parameter, Mastro cannot guess which URL paths you want to generate. In that case, you need to export an additional function called `getStaticPaths`, which needs to return an array of strings (or a `Promise` of such):

```ts title=routes/blog/[slug].server.ts
export const getStaticPaths = async () => {
  return ["/blog/my-first-post", "/blog/we-are-back"];
}
```

See the guide for an example of a [static blog from markdown files](/guide/static-blog-from-markdown-files/).


## Programmatic router

As an alternative to the default file-based router, Mastro also offers a programmatic router, which is similar to Express.js or Hono.
If you want to stick to the default router, you can [jump to the next chapter now](/docs/html-components/).

To switch to the programmatic router when using Node.js, modify the `server.ts` file in your project to something like the following.

```ts title=server.ts del={1,5} ins={2,6-12}
import { createFileRouterApp } from "@mastrojs/mastro/server";
import { createApp } from "@mastrojs/mastro/server";
import { FastResponse, serve } from "srvx";

export const app = createFileRouterApp()
export const app = createApp()
  .get("/", () => new Response("Hello world"))
  .post("/", () => new Response("Hello HTTP POST"))
  .get("/blog/:slug/", (req, ctx) => {
    const { slug } = ctx.params;
    return new Response(`Hello ${slug}`);
  })

if (import.meta.main) {
  globalThis.Response = FastResponse;
  serve({ fetch: app.createHandler() });
}
```

The first argument of each call (e.g. `"/blog/:slug/"`) is used as the `pathname` to construct a standard [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API). The second argument is a [route handler](#route-handlers).

When using TypeScript and middleware, be sure to chain the method calls as shown above – otherwise the types won't be inferred correctly.

The `createApp()` factory function (imported from `@mastrojs/mastro/server`) includes the default middleware for Node.js and Bun.
If you're on a serverless platform (e.g. Cloudflare Worker, or in a Service Worker), use [`new Mastro()`](https://npmx.dev/package-docs/@mastrojs/mastro#class-Mastro) directly instead (import it from `@mastrojs/mastro"`).


### Organizing programmatic handlers

If you have more than a few routes, it makes sense to place their handler functions in dedicated files. However, unlike with the file-based router, they don't need to be in the `routes` folder. Since they're normal JavaScript modules, you can name both the files and the functions whatever you want. However, it's customary to create a `handlers` folder and follow one of the two naming conventions demonstrated in the following example.

1.  Export a function called `handler` and pass the whole module to the route:

    ```ts title=handlers/About.ts ins={4}
    import { html, htmlToResponse } from "@mastrojs/mastro";
    import { Layout } from "../components/Layout.ts";

    export const handler = (req: Request) =>
      htmlToResponse(Layout({ children: html`<p>Welcome home</p>` }));
    ```

    ```ts title=server.ts ins={6}
    import { Mastro } from "@mastrojs/mastro";

    import * as About from './handlers/About.ts';

    export const app = new Mastro()
      .get("/about/", About)
    ```

2.  If you want to export separate functions for different HTTP verbs like `GET` or `POST`, name the functions like that, and pass them to the router:

    ```ts title=handlers/Home.ts ins={4}
    import { html, htmlToResponse } from "@mastrojs/mastro";
    import { Layout } from "../components/Layout.ts";

    export const GET = (req: Request) =>
      htmlToResponse(Layout({ children: html`<p>Welcome home</p>` }));
    ```

    ```ts title=server.ts ins={8}
    import { Mastro } from "@mastrojs/mastro";

    import * as About from './handlers/About.ts';
    import * as Home from './handlers/Home.ts';

    export const app = new Mastro()
      .get("/about/", About)
      .get("/", Home.GET)
    ```

### More programmatic options

Using a module exporting a `handler` function, you can also export [`getStaticPaths`](/guide/static-blog-from-markdown-files/#generating-pages-with-route-parameters) and/or [`pregenerate`](/guide/bundling-assets/#build-step) variables. Those will be picked up by the router if you pass the whole module:

```ts
import * as News from './handlers/News.ts';

export const app = new Mastro()
  .get("/news/:slug/", News)
```

The above is equivalent to passing a config object manually:

```ts
  .get("/news/:slug/", {
    handler: (req) => new Response(`Hello ${req.url}`),
    getStaticPaths: async () => (["/news/foo/", "/news/bar/"]),
    pregenerate: true,
  })
```

See also the [API docs for the programmatic router](https://npmx.dev/package-docs/@mastrojs/mastro#class-Mastro).
