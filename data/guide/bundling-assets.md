---
title: Bundling and pregenerating assets
---

If you build your project in such a way that it only has a handful of client-side JavaScript files, you can enjoy the benefits of not having to deal with a bundler:

- In error messages and other places in your browser's dev tools, line numbers are correct and stack traces are always readable – even in production and logs.
- You can use the JavaScript debugger built into your browser's dev tools without finicky source maps.
- Not bundling doesn't add another layer that you need to debug when things go wrong (e.g. when your bundle is unexpectedly large and you don't know why).
- No messing with different build configs for client, server, tests, dev and production.
- No bundler update treadmill from Webpack to Vite to whatever's next.
- During development, the server starts up immediately, and changes are reflected instantly. It's a truly awesome developer experience.

But for some very interactive apps, a lot of client-side JavaScript is unavoidable. And for most websites, what negatively [impacts performance the most, is too much client-side JavaScript](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#client-side-vs-server-side-javascript). Thus if you have dozens, or even hundreds, of different client-side JavaScript files, the time may have come to bundle them.


## Bundling

Bundling multiple files into one is generally done because making one HTTP request is faster than making multiple. Yes, [even with HTTP/2](https://css-tricks.com/musings-on-http2-and-bundling/), and [even today](https://dev.to/konnorrogers/why-we-still-bundle-with-http2-in-2022-3noo) – at least until [JavaScript Module Declarations](https://github.com/tc39/proposal-module-declarations) or something similar is standardized and implemented by browsers. If you want to know for sure whether adding a bundler to your tech stack is worth the added complexity, you'll need to benchmark a typical user journey on your website under typical conditions – once with a bundler, and once without.

Making multiple HTTP requests is especially slow if not all URLs are initially known to the client. Although this aspect could be mitigated with [`rel=preload`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload) for CSS, and [`rel="modulepreload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload) for JavaScript. But without any preload hints, the client first needs to request the HTML, which contains the URL to the first JavaScript module, which in turn contains the URL to another imported JavaScript module, and so forth. This results in a so-called network-waterfall, where each request has to complete before the next can be started. Especially on slow mobile connections, this can slow down the loading of lots of files dramatically.

<!-- TODO: add waterfall in network dev tools -->

The same can happen in CSS when using [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) or [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import). Ideally, those should only be used in `<style>` tags directly in the initial HTML.

### Bundling JavaScript

When bundling JavaScript, to prevent e.g. clashes of variables with the same name in different files, the syntax needs to be parsed and some things need to be wrapped in functions and/or renamed. JavaScript bundlers like [esbuild](https://esbuild.github.io/) recursively follow the import statements and try to bundle only code that’s actually used. This is called "dead-code elimination", or in the JavaScript world also "tree-shaking" (but beware that the bundler must assume that [importing a module can have side-effects](https://esbuild.github.io/api/#ignore-annotations)).

In Mastro, a route that bundles all JavaScript that's referenced from the `routes/app.client.ts` entry point, might look as follows:

```ts title=routes/bundle.js.server.ts
import * as esbuild from "npm:esbuild";

export const GET = async () => {
  const { outputFiles } = await esbuild.build({
    entryPoints: ["routes/app.client.ts"],
    bundle: true,
    write: false,
  });
  return new Response(outputFiles[0].contents, {
    headers: { "Content-Type": "text/javascript; charset=utf-8" },
  });
};
```

It could be consumed like:

```html
<script type="module" src="/bundle.js"></script>
```

If you decide to bundle all your client-side JavaScript, you most probably want to move the source files out of the `routes/` folder, perhaps in a new `client/` folder or similar, and adjust the `entryPoints` accordingly.

As you can imagine, bundling of hundreds of files can be computationally expensive, and would take the server longer than generating a typical HTML page. When doing static site generation, this doesn't matter. But doing that every time a user makes a request to a server would be slow and wasteful. We'll look at [pregenerating assets later](#build-step).

Bundling gets more complicated if not all pages of the website require the same JavaScript. For that case, some bundlers try to create different chunks ("code splitting"), balancing the conflicting goals of fewer chunks, chunks containing no unnecessary code for that page, and little code being duplicated across chunks.

For both CSS and client-side JavaScript, there is usully a trade-off between loading only what you need for the current page (which is optimizing initial page load speed), over loading everything in a single request that the user might need if they afterwards also visit other pages (which is optimal overall, but only if the user does visit more pages).

### Bundling CSS

CSS is easier to bundle than JavaScript. The simplest way is to just concatenate all CSS files found in alphabetical order. This is a reasonalbe strategy if you don't have megabytes of CSS, and still allows you to colocate the CSS source files in the same folder with the corresponding component (e.g. `/components/Header/header.css`). In Mastro, a route that does that might look as follows:

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

Which can be consumed with:

```html
<link rel="stylesheet" href="/styles.css">
```


## Transforming images

Another example of an expensive route would be transforming images (e.g. resizing or compressing into WebP format). One way to do that is, with the [`@mastrojs/images` package](https://jsr.io/@mastrojs/images):

<div class="col3">

- ```sh title=Deno
  deno add jsr:@mastrojs/images
  ```

- ```sh title=Node.js
  pnpm add jsr:@mastrojs/images
  ```

- ```sh title=Bun
  bunx jsr add @mastrojs/images
  ```
</div>

Then you can add a route like:

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

This declares two presets: `hero` and `hero2x`. Assuming you have a file `images/blue-marble.jpg`, you could request resized versions in WebP format as follows:

```html
<img alt="Planet Earth"
  src="/_images/hero/blue-marble.jpg.webp"
  srcset="/_images/hero2x/blue-marble.jpg.webp 2x"
  >
```


## Build step

Because bundling CSS and JavaScript, and transforming images, are expensive computations, it’s common for frameworks to do this only once, in a build step, before starting the server. These pre-built files are often called _assets_.

Actually, we’ve started the guide with an extreme application of this strategy: static site generation. There, not only images and bundles are pre-computed, but also every single HTML file is pre-generated. Thus for a static site, the above works very well. But if you're running a server, you may want to pregenerate the images in a build step. Add a `pregenerate` task to your `deno.json`:

```json title=deno.json ins={4}
{
  "tasks": {
    "generate": "deno run -A mastro/generator",
    "pregenerate": "deno run -A mastro/generator --only-pregenerate",
```

Then add `deno task pregenerate` to your CI/CD workflow (e.g. when using Deno Deploy, add it as your "Build command"). This will generate a `generated/` folder just like `deno task generate` would for a static site. But this time, it will only attempt to generate routes with the following line added:

```js title=routes/_images/[...slug].server.ts ins={3}
import { createImagesRoute } from "@mastrojs/images";

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

Run `deno task pregenerate` and check what was written to the `generated/` folder.

If you start the server with `deno task start` and access it on a `http://localhost:8000`, the images will still be rendered on the fly, enabling you to quickly change things when developing your website. However, when you open `http://127.0.0.1:8000` in your browser (that's using the IP address for localhost), the Mastro server will assume we're running in production, and load the pregenerated image from the `generated/` folder. You should see in your browser's network dev tools that this is much quicker.

You can pregenerate not only images, CSS or JavaScript, but also entire HTML pages. Simply add a `export const pregenerate = true;` to your route.

Usually, serving the pregenerated files with your normal web server will be fast enough. However, you could also push e.g. the `generated/_images/` folder to your CDN (content delivery network), and configure it to serve all URLs starting with `/_images/` directly from the CDN.


## Caching

Storing data, in order for future requests to be served faster, is known as _caching_. The place where it's stored is called a _cache_. Caching is either done because the data was expensive to compute, or because the cache is physically closer to where the data will be needed. That's what a CDN is – a distributed cache with multiple locations across the globe, where the user will automatically connect to the one that's geographically closest to them.

Eagerly pregenerating assets in a build step, like we've seen above, is one kind of caching. Another kind is to store the result of one request for future requests to the same URL. This offers more flexibility and finer granularity, but has the disadvantage that the first request (until the cache is populated) will be slow.

The thing that's generally very difficult to get right with caching is _cache invalidation_: the question of when and how to remove a result from the cache, because it's no longer up to date. With static site generation, we typically just regenerate the whole site – every time any part of it is changed. This is very easy to implement and reason about, but for websites with millions of pages, it usually takes too long. Another strategy is to set a time-to-live: tell the cache that it should invalidate an entry if it's older than a certain number of seconds, minutes or days. This is also easy to implement, but means of course that when you update a page, visitors will still see the old version of the page until it expires. There are many more caching strategies, each with their own subtleties to consider.

:::tip
### HTTP caching

If you want to improve performance and reduce load on your server by leveraging the browser cache and/or a CDN, the [MDN article on HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching), or [this guide to HTTP caching](https://www.jonoalderson.com/performance/http-caching/) are both good places to start reading.
:::


## HTTP Streaming

Caching is great, but sometimes it's not an option – for example when you need the absolute newest data from the database. To improve performance in a case like that, you should consider HTTP streaming, where each chunk of the HTML page is sent from the server as soon as it's ready. That way, a user may already see the first row of a big data set in their browser, while the last row hasn't even been read out from the database yet.

To support it, all you have to do, is not break it on any level of the stack: from the database driver, to the HTML templates, all the way to your web hosting provider and CDN proxy. If there's an `await` or similar anywhere in that chain, which blocks until the whole page is loaded, then it cannot be streamed. For an example, see [HTTP Streaming in the docs](/docs/html-components/#http-streaming).

