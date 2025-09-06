---
title: Bundling, pregenerating assets and caching
---

## Bundling

If you have a website with dozens, or even hundreds, of client-side JavaScript files, the time may have come to bundle them.

Bundling multiple files into one is generally done because making one HTTP request is faster than making multiple (even with HTTP/2 and HTTP/3): especially if not all URLs are initially known to the client. In that case, the client might first need to request the HTML, which contains the URL to the first JavaScript module, which in turn contains the URL to another imported JavaScript module, and so forth. This results in a so-called network-waterfall, where each request has to complete before the next can be started. Especially on slow mobile connections, this can slow down the loading of lots of files dramatically.

The same can happen in CSS when using [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) or [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import). Ideally, those should only be used in `<style>` tags directly in the initial HTML.

### Bundling JavaScript

When bundling JavaScript, to prevent e.g. clashes of variables with the same name in different files, the syntax needs to be parsed and variables renamed. JavaScript bundlers like [esbuild](https://esbuild.github.io/) or [Rolldown](https://rolldown.rs/) recursively follow the import statements and try to bundle only code that’s actually used (often called “tree-shaking”). This gets more complicated if not all pages of the website require the same JavaScript. For that case, bundlers try to create different chunks ("code-splitting"), balancing the ideals of fewer chunks, chunks containing no unnecessary code for that page, and little code being duplicated across chunks.

For both CSS and client-side JavaScript, there is usully a trade-off between loading only what you need for the current page (which is optimizing initial page load speed), over loading everything in a single request that the user might need if they afterwards also visit other pages (which is optimal overall, but only if the user does visit more pages).

### Bundling CSS

CSS is easier to bundle than JavaScript. The simplest way is to just concatenate all CSS files found in alphabetical order. This is a reasonalbe strategy if you don't have megabytes of CSS, and still allows you to colocate the CSS source files in the same folder with the corresponding component (e.g. `/components/Header/header.css`). In Mastro, a route that does that might look as follows:

```js title=routes/styles.css.server.js
import { findFiles, readTextFile } from "mastro";

export const GET = async () => {
  const files = await findFiles("components/**/*.css");
  const contents = await Promise.all(files.map(readTextFile));
  return new Response(
    contents.join("\n\n"),
    { headers: { "Content-Type": "text/css" } },
  );
}
```

Which can be consumed with:

```html
<link rel="stylesheet" href="/styles.css">
```

As you can imagine, bundling of hundreds of files can be computationally expensive, and would take the server longer than generating a typical HTML page. When doing static site generation, this doesn't matter. But doing that every time a user makes a request to a server would be slow and wasteful. We'll look at that later.


## Transforming images

Another example of an expensive route would be transforming images (e.g. resizing or compressing into WebP format). In Mastro, such a route might look as follows:

```js title=routes/_images/[...slug].server.ts
import { createImagesRoute } from "mastro/images";

export const { GET, getStaticPaths } = createImagesRoute({
  hero: {
    transform: image => image.resize(300, 300),
  },
  hero2x: {
    transform: image => image.resize(600, 600),
  }
});
```

This declares the presets `hero` and `hero2x`. Assuming you have a file `images/blue-marble.jpg`, you could request resized versions in WebP format as follows:

```html
<img alt="Planet Earth"
  src="/_images/hero/blue-marble.jpg.webp"
  srcset="/_images/hero2x/blue-marble.jpg.webp 2x"
  >
```


## Build step

Because bundling CSS and JavaScript and transforming images are expensive computations, it’s common for frameworks to do this only once, in a build step, before starting the server. These pre-built files are often called _assets_.

Actually, we’ve started the guide with an extreme application of this strategy: static site generation. There, not only images and bundles are pre-computed, but also every single HTML file is pre-generated. Thus for a static site, the above works very well. But if you're running a server, you may want to pregenerate the images in a build step. Add a `pregenerate` task to your `deno.json`:

```json title=deno.json ins={3}
{
  "tasks": {
    "pregenerate": "deno run -A mastro/generator --pregenerateOnly",
```

Then add `deno task pregenerate` to your CI/CD workflow. This will generate a `dist/` folder just like `generate` would for a static site. But this time, it will only attempt to generate routes with the following line added:

```js title=routes/_images/[...slug].server.ts ins={3}
import { createImagesRoute } from "mastro/images";

export const pregenerate = true;

export const { GET, getStaticPaths } = createImagesRoute({
  hero: {
    transform: image => image.resize(300, 300),
  },
  hero2x: {
    transform: image => image.resize(600, 600),
  }
});
```

Run `deno task pregenerate` and check what was written to the `dist/` folder.

If you start the server with `deno task start` and access it on a `http://localhost:8000`, the images will still be rendered on the fly, enabling you to quickly change things when developing your website. However, when you open `http://127.0.0.1:8000` in your browser (that's using the IP address for localhost), the Mastro server will assume we're running in production and load the pregenerated image from the `dist/` folder. You should see in your browser's network dev tools that this is much quicker.


## Caching

Storing data, so that future requests can be served faster, is known as _caching_. The place where it's stored is called a _cache_. Caching is either done because the data was expensive to compute, or because the cache is physically closer to where the data will be needed. That's what a content delivery network (CDN) is – a distributed cache with multiple locations across the globe, where the user will automatically connect to the one that's geographically closest to them.

Eagerly pregenerating assets in a build step, like we've seen above, is one kind of caching. Another kind is to store the result of one request for future requests to the same URL. This offers more flexibility and finer granularity, but has the disadvantage that the first request (until the cache is populated) will be slow.

The thing that's generally very difficult to get right with caching is _cache invalidation_: the question of when and how to remove a result from the cache, because it's no longer up to date. With static site generation, we typically just regenerate the whole site – every time any part of it is changed. This is very easy to implement and reason about, but for websites with millions of pages, it usually takes too long. Another strategy is to set a time-to-live: tell the cache that it should invalidate an entry if it's older than a certain number of seconds, minutes or days. This is also easy to implement, but means of course that when you update a page, visitors will still see the old version of the page until it expires. There are many more caching strategies, each with their own subtleties to consider.

:::tip
### HTTP caching

If you want to improve performance and reduce load on your server by leveraging the browser cache and/or a CDN, the [MDN article on HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) is a good place to start reading.
:::
