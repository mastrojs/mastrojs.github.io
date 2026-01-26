---
title: "Everything is a route – one interface for servers, static sites, and assets"
description: "Use the standards-based Request/Response-API not only for writing your server, but also for static site and asset generation."
date: 2026-01-29
author: Mauro Bieg
---

**In Unix, everything is a file. In Mastro, everything is an HTTP route. You use the standards-based Request/Response-API not only for writing your server, but also for static site and asset generation. Let me show you the beauty of that.**

The Request/Response-API is the [modern way to write JavaScript servers](https://marvinh.dev/blog/modern-way-to-write-javascript-servers/). For example:

```ts
const myHandler = async (req: Request) => {
  return new Response("Hello world!");
};
 ```

In fact, it’s such a great interface that Mastro decided to go all-in on it, and use it for all of the following functionality:

1. on-demand server-side rendering (SSR) of
  	- HTML pages
    - JSON REST APIs
    - RSS feeds
    - etc.
2. static site generation (SSG)
3. asset generation of
	  - resized images
	  - CSS/JS bundles
	  - etc.

Let’s look at the three cases.

## Server-side rendering

Server-side rendering is the obvious part. After all, that’s the use-case that popularized the Request/Response-API (e.g. when writing Cloudflare Workers). In Mastro, this looks as follows:

```ts
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";

export const GET = () =>
  htmlToResponse(
    Layout({
      title: "Hi",
      children: html`<p>Hello world!</p>`,
    })
  );

```

But even then, a lot of frameworks only use this Request/Response-API for JSON REST APIs, 404s and redirects, but not for normal HTML pages. For the 200-OK HTML case, this gets rid of the `htmlToResponse` function call. But it makes other cases [awkward](https://github.com/withastro/astro/issues/14684).


## Static site generation

During [static site generation](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#static-site-generation-vs-running-a-server), all the HTML of the website is generated upfront before being deployed to a static file server or CDN. Thus in a way, it’s the inverse of on-demand server-side rendering.

But if you forget in what order things happen, it is in fact a strict subset of the cases you encounter when on-demand rendering: the url-path of a GET request will fully determine what static file is served – query parameters and HTTP headers are ignored. As such, using a full Request object may be overkill.

But as a web developer, having one unified interface is nice. You don't have to switch back and forth between different ways of doing things. And it allows you to effortlessly change a route from being server-side rendered to being statically pregenerated. To do so, the only thing you need to add to the file above is:

```ts
export const pregenerate = true;
```

If your whole site it statically generated, you don’t even need to add that line.

When you execute the Mastro generate script, it will call all your route handlers with synthetic requests and create files from the output. (Tangent: to write side-effect-free unit tests for these route handlers, you can do the same: simply call the handler with a [`new Request(url)`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request). This requires no mocking, or spinning up a whole browser like with Playwright.)

Regardless of whether you have a server or a static site in production, for development you need a local server. As a bonus, this way of defining pages lets us use the production server also for local development. This ensures there are no differences between your development setup and production. The only difference is that for local development, Node.js/Deno/Bun are called with the `--watch` flag to leverage their built-in file watcher.


## Asset generation

Most web frameworks have some sort of functionality to pregenerate static assets that are expensive to compute, like for example resized images, or bundled CSS or JavaScript. In Ruby on Rails for example, this is called the _asset pipeline_. In Vite-based frameworks it's usually a series of Vite plugins.

But what are assets if not simply pregenerated static files? Indeed, from Mastro’s point of view, it doesn’t matter at all whether you want to pregenerate an HTML file (i.e. static site generation), or a CSS or JavaScript file (i.e. asset generation) – or even a binary file like a transformed image. Just slap that `pregenerate = true` line from above on your asset route, and you can use Mastro to precompute it before starting your server. And again, if your complete website is static, you don’t even need that line.

For example, to generate a `styles.css` file containing the bundled CSS of all your components, create a route file named `styles.css.server.js`:

```js title=routes/styles.css.server.js
import { findFiles, readTextFile } from "@mastrojs/mastro";

export const GET = async () => {
  const files = await findFiles("components/**/*.css");
  const contents = await Promise.all(files.map(readTextFile));
  return new Response(
    contents.join("\n\n"),
    { headers: { "Content-Type": "text/css" } },
  );
}
```

And since the interface is the same as for any other HTTP route, if you know web standard HTML, you already know how to load this into your HTML:

```html
<link rel="stylesheet" href="/styles.css">
```

Isn’t that beautiful?

And again, we get the snappy development server for free, which computes the bundle on the fly and lazily. If you don't load `/styles.css`, it isn't computed either.

The same approach works for any other kind of content, e.g. for images. Using the [`@mastrojs/images` package](https://jsr.io/@mastrojs/images):

```js title=routes/_images/[...slug].server.ts
import { createImagesRoute } from "@mastrojs/images";

export const { GET, getStaticPaths } = createImagesRoute({
  hero: {
    transform: (image) => image.resize(300, 300),
  },
  hero2x: {
    transform: (image) => image.resize(600, 600),
  }
});
```

This declares two image presets: `hero` and `hero2x`. Assuming you have a file `images/blue-marble.jpg`, you would request resized versions in WebP format as follows:

```html
<img alt="Planet Earth"
  src="/_images/hero/blue-marble.jpg.webp"
  srcset="/_images/hero2x/blue-marble.jpg.webp 2x"
  >
```

The beautiful thing here is that we didn't have to build image transformations into Mastro itself, nor does Mastro have a complex plugin API that we'd need to keep compatible. `@mastrojs/images` is an independent package, that simply exports the `GET` function that adheres to the standard Request/Response-API. (It also exports the `getStaticPaths` function, which is Mastro-specific, but that just returns the paths used for static site generation as strings – hardly a complex API.)

Similarly, to bundle JavaScript, we could call e.g. `esbuild` in the route handler. For an example of that, have a look at the [bundling and assets chapter in the Mastro Guide](/guide/bundling-assets/).

By inverting the flow of a classic asset pipeline, and leveraging the standards-based Request/Response-API, we managed to unify the development server, production server, static site generation, and asset generation mechanisms. That's how Mastro gets by with just [~700 lines of implementation code](https://github.com/mastrojs/mastro/tree/main/src#readme).

What do you think? I'd love to chat on [Bluesky](https://bsky.app/profile/mastrojs.bsky.social) or [GitHub](https://github.com/mastrojs/mastro/discussions/)!
