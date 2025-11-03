---
title: "Routing"
---

Mastro uses a file-based router.
Files in your project's `routes/` folder are sent out unmodified to your website's visitors – with the following two exceptions:

1. `*.client.ts` files are type-stripped and served as `*.client.js` (see [TypeScript](/docs/install-setup/#typescript)).
2. `*.server.js` (or `*.server.ts`) files are route handlers (or page handlers) that should contain JavaScript functions that handle the generation of the page in question.

The folder structure in the `routes/` folder determines under what URL a static file or a dynamic route is served.


## Static files

As such, the simplest Mastro website is an `index.html` file placed in the `routes/` folder. Other static files can also be placed there (e.g. `routes/favicon.ico`), and organized to your liking.

For example, if you'd like to have a folder called `assets`, create it, and add a file `routes/assets/styles.css`, and perhaps one `routes/assets/scripts.js`. Then reference them like:

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

To link to other pages, or to place images on your page, use the standard [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) and [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) elements respectively. Mastro does not use special `<Link>` or `<Image>` constructs.

For links (and also for references to static files), it's easiest to always use _absolute paths_ that start with a `/`. For example `href="/assets/styles.css"` above.


## Files and folders

Different hosting providers often serve the same file under [slightly different urls](https://github.com/slorber/trailing-slash-guide/blob/main/docs/Hosting-Providers.md). In Mastro, the URL for a file does not end with a slash, while the URL for a folder does end with a slash. Since a folder itself cannot contain any code, an `index.html` or `index.server.js` file is used to represent the containing folder.

| File in `routes/`           | URL          |
|:----------------------------|:-------------|
| `file.html`                 | `/file.html` |
| `folder/index.html`         | `/folder/`   |
| `file.server.js`            | `/file`      |
| `folder/index.server.js`    | `/folder/`   |
| `folder/(folder).server.js` | `/folder/`   |

Since having lots of files called `index.server.js` would get confusing quickly, you can also name it `(folder).server.js`, where `folder` is the name of the containing folder.


## Route handlers

A route handler like `index.server.ts` needs to export a function named `GET` (when [running a server](/docs/install-setup/#ssg%2C-ssr-and-deploying), other HTTP verbs like `POST` are also supported). It receives a standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) objects and needs to return a standard [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object (or a `Promise` of such, meaning the function can be `async`), for example:

```ts title=routes/index.server.ts
export const GET = (req: Request) => {
  return new Response("Hello World");
}
```

Therefore, route handlers can be used to generate HTML, JSON, XML, plain text (like the above example), binary data such as images, or whatever else you can think of. If you're running a server, a `Response` can also [represent a redirect](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static).


## Route parameters

Using route parameters, a single route can represent lots of different pages with the same basic url structure. For example, to match any URL of the form `/blog/*/`, you could use a route parameter called `slug`:

```ts title=routes/blog/[slug].server.ts
import { getParams } from "@mastrojs/mastro";

export const GET = (req: Request) => {
  const { slug } = getParams(req.url);
  return new Response(`Current URL path is /blog/${slug}/`);
}
```

Above, `slug` is just an example name for the parameter. You can **name parameters whatever** you want, as long as it's alphanumeric. (Mastro uses the standard `URLPattern` API under the hood.)

To capture URL segments containing slashes (often called **rest parameters**), use `[...slug]` instead of `[slug]`.

Both of these can be used as the name of a folder inside `routes/`, or like above, as part of the route handler file name. To **debug** and `console.log` your routes, you can `import { routes } from "@mastrojs/mastro"`.

When you're using Mastro as a **static site generator** and have a route with a route parameter, Mastro cannot guess which URL paths you want to generate. In that case, you need to export an additional function `getStaticPaths`, which needs to return an array of strings (or a `Promise` of such):

```ts title=routes/blog/[slug].server.ts
export const getStaticPaths = async () => {
  return ["/blog/my-first-post/", "/blog/we-are-back/"];
}
```

See the guide for an example of a [static blog from markdown files](http://localhost:8000/guide/static-blog-from-markdown-files/).
