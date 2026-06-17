---
title: "Routing"
---

In Mastro, [everything is a route](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/).
There are no configuration files, and only one special folder: the `routes` folder. It supports three different kinds of files:

1. [Unprocessed static files](#unprocessed-static-files): any file in the `routes` folder that doesn’t match the patterns below is served to the browser unchanged. Naming is up to you, e.g. `routes/favicon.ico`, `routes/styles.css`, or `routes/scripts.js`)
2. [Route handlers](#route-handlers): each `*.server.js` (or `*.server.ts`) file represents a route, which runs code on the server to generate one or more pages.
3. [TypeScript](/docs/install-setup/#typescript) files for the browser: because browsers don't support TypeScript, Mastro type-strips `*.client.ts` files and serves them as `*.client.js`.


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

Since they return a standard `Response` object, route handlers can be used to generate HTML, JSON, XML, plain text (like the above example), binary data such as images, or whatever else you can think of. If you're [running a server](/docs/install-setup/#ssg%2C-ssr-and-deploying), a `Response` can also [represent a redirect](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static).


## Files and folders

Different hosting providers often serve the same file under [slightly different urls](https://github.com/slorber/trailing-slash-guide/blob/main/docs/Hosting-Providers.md). In Mastro, the URL for a file does not end with a slash, while the URL for a folder does end with a slash. Since a folder itself cannot contain any code, an `index.html` or `index.server.js` file is used to represent the containing folder.

| File in `routes/`           | URL          |
|:----------------------------|:-------------|
| `file.html`                 | `/file.html` |
| `folder/index.html`         | `/folder/`   |
| `file.server.js`            | `/file`      |
| `file.html.server.js`       | `/file.html` |
| `folder/index.server.js`    | `/folder/`   |
| `folder/(folder).server.js` | `/folder/`   |

Since having lots of files called `index.server.js` would get confusing quickly, you can also name it `(folder).server.js`, where `folder` is the name of the containing folder.


## Route parameters

Using route parameters, a single route can represent many different pages with the same basic url structure. For example, to match any URL of the form `/blog/*/`, you could use a route parameter called `slug`:

```ts title=routes/blog/[slug].server.ts
import { getParams } from "@mastrojs/mastro";

export const GET = (req: Request) => {
  const { slug } = getParams(req);
  return new Response(`Current URL path is /blog/${slug}`);
}
```

Above, `slug` is just an example name for the parameter. You can **name parameters whatever** you want, as long as it's alphanumeric. (Mastro uses the standard `URLPattern` API under the hood.)

To capture URL segments containing slashes (often called **rest parameters**), use `[...slug]` instead of `[slug]`.

Both of these can be used as the name of a folder inside `routes/`, or like above, as part of the route handler file name. To **debug** and `console.log` your routes, you can `import { loadRoutes } from "@mastrojs/mastro"`.

When you're using Mastro as a **static site generator** and have a route with a route parameter, Mastro cannot guess which URL paths you want to generate. In that case, you need to export an additional function `getStaticPaths`, which needs to return an array of strings (or a `Promise` of such):

```ts title=routes/blog/[slug].server.ts
export const getStaticPaths = async () => {
  return ["/blog/my-first-post/", "/blog/we-are-back/"];
}
```

See the guide for an example of a [static blog from markdown files](/guide/static-blog-from-markdown-files/).


## Programmatic router

As an alternative to the file-based router, Mastro also offers a programmatic router, which is similar to Express.js or Hono.
If you want to stick to the default router, [jump to the next chapter now](/docs/html-components/).

To try the programmatic router, modify the `server.ts` file in your project to something like the following.

```ts title=server.ts
import { getParams } from "@mastrojs/mastro";
import { Mastro } from "@mastrojs/mastro/server-programmatic";

const fetchHandler = new Mastro()
  .get("/", () => new Response("Hello world")
  .post("/", () => new Response("Hello HTTP POST")
  .get("/blog/:slug/" => (req) => {
    const { slug } = getParams(req);
    return new Response(`Hello ${slug}`);
  })
  .createHandler();

Deno.serve(fetchHandler);
```

If you're not using Deno, the last line will look different. But if you've started with a template using the file-based router, you basically replace `mastro.fetch` with the `fetchHandler`.

The first argument of each call (e.g. `"/blog/:slug/"`) is used as the `pathname` to construct a [standard URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API). The second argument is a [route handler](#route-handlers).


### Organizing programmatic handlers

If you have more than a few routes in your programmatic router, it makes sense to place their handler functions in dedicated files (instead of using inline functions like above).

However, unlike with the file-based router, they don't need to be in the `routes` folder. Since they're normal JavaScript modules, you can name both the files and the functions whatever you want. However, it's customary to create a `handlers` folder and follow one of the two naming conventions demonstrated in the following example.

If you want to export separate functions for GET and other HTTP verbs like POST, name the functions like that and later pass them to the router:

```ts title=handlers/Home.ts
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";

export const GET = (req: Request) =>
  htmlToResponse(
    Layout({
      title: "Home page",
      children: html`<p>Welcome to ${req.url}</p>`,
    }),
  );

```

But usually it's simpler to export a function called `handler`. In that case you can pass the whole module to the router:

```ts title=handlers/About.ts
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";

export const handler = (req: Request) =>
  htmlToResponse(
    Layout({
      title: "About us",
      children: html`<p>Welcome to ${req.url}</p>`,
    }),
  );

```

```ts title=server.ts
import { Mastro } from "@mastrojs/mastro/server-programmatic";

import * as Home from './handlers/Home.ts';
import * as About from './handlers/About.ts';

const fetchHandler = new Mastro()
  .get("/", Home.GET)
  .get("/about/", About)
  .createHandler();

Deno.serve(fetchHandler);
```

### More programmatic options

Using a module exporting a `handler` function, you can also export [`getStaticPaths`](/guide/static-blog-from-markdown-files/#generating-pages-with-route-parameters) and/or [`pregenerate`](/guide/bundling-assets/#build-step) variables. Those will be picked up by the router if you pass the whole module:

```ts
import * as News from './handlers/News.ts';

const fetchHandler = new Mastro()
  .get("/news/:slug/", News)
  .createHandler();
```

The above is equivalent to passing a config object manually:

```ts
  .get("/news/:slug/", {
    handler: (req) => new Response(`Hello ${req.url}`)
    getStaticPaths: async () => (["/news/foo/", "/news/bar/"]),
    pregenerate: true;
  })
```

See also the [API docs for the programmatic router](https://jsr.io/@mastrojs/mastro/doc/server/~/Mastro).
