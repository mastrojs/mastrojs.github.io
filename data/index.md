---
title: The simplest web framework and site generator yet.
metaTitle: 'Mastro: the simplest web framework and site generator'
description: 'No bloat, no magic, no config. Mastro gets out of the way, so that you can focus on building awesome websites.'
layout: hero
---

<p class="center-text mt-3">
Let nothing get between you and the high-performance engine that is a modern browser.
</p>

<div class="herolist">

- **Minimal yet powerful**: a [router](/docs/routing/), and a few [composable functions](/docs/html-components/) to return [Responses](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response).
- **It all works the same**: static site generation, server rendering HTML, or even JSON.
- **No bloat**: written in just [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) of TypeScript, Mastro is a tiny library.
- **No client-side JavaScript** (until you [add some](/guide/interactivity-with-javascript-in-the-browser/)): create [MPA](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/) websites that load [fast](#fast-for-everyone).
- **No bundler** (until you [add one](/guide/bundling-assets/)): your code ships exactly as you wrote it.
- **No magic**: use plain `<img>` and `<a>` tags referencing HTTP-first [assets](/guide/bundling-assets/#transforming-images).
- **No VC-money**: no eventual enshitification – selling is none of our business.
- **No update treadmill**: we use web standards instead of complex [dependencies](https://jsr.io/@mastrojs/mastro/dependencies).
- **No lock-in**: swap out Mastro or fork it – it's only [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) after all.

</div>

<p class="center-text mt-3">
  <a class="button" data-goatcounter-click="home.try" data-goatcounter-title="top" href="https://github.dev/mastrojs/template-basic">Try online with GitHub</a>
  <a class="button -secondary" href="#powerful-for-experienced-developers">Install with Deno, Node.js or Bun</a>
</p>

<div class="tip center-text mt-3 mb-6">

## As seen on the Internet!

<div class="flex-center">

  <a href="https://thenewstack.io/minimalist-mastro-framework-offers-modern-take-on-mpas/"><img alt="The New Stack" loading="lazy" src="/assets/home/thenewstack.svg" width="400" height="48"></a>

  <a href="https://typescript.fm/43#t=38m22s"><img alt="TypeScript.fm" loading="lazy" srcset="/assets/home/typescriptfm@2x.webp 2x, /assets/home/typescriptfm.webp" width="110" height="110"></a>

  <a href="https://thathtml.blog/2024/12/new-custom-element-superclass-on-the-block/"><img alt="That HTML blog" loading="lazy" src="/assets/home/thathtmlblog.svg" width="400" height="91"></a>

</div>

</div>

<div class="col2 breakout gap-1">
<div>

```ts title=routes/hello.server.js
// Respond to a HTTP GET with plain text
export const GET = () => {
  return new Response("Hello World");
}
```

```ts title=routes/api.server.ts
import { jsonResponse } from "@mastrojs/mastro";
import { addComment } from "../models/comments.ts";

// Respond to a HTTP POST with JSON
export const POST = async (req: Request) => {
  const data = await req.json();
  const comment = await addComment(data);
  return jsonResponse(comment);
};
```

</div>

<div>
<section class="tab-group -code">
<header>
  <label><input type="radio" name="htmlcode" class="tab1" checked>routes/index.server.ts</label>
  <label><input type="radio" name="htmlcode" class="tab2">components/Layout.ts</label>
</header>

<div tabindex=0 id="content1">

```ts
import { readMarkdownFiles } from "@mastrojs/markdown";
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";

// Respond with HTML
export const GET = async () => {
  const posts = await readMarkdownFiles("posts/*.md");
  return htmlToResponse(
    Layout({
      title: "Hello world",
      children: posts.map((post) => html`
        <p>${post.meta.title}</p>
      `)
    })
  );
};
```
</div>
<div tabindex=0 id="content2">

```ts
import { html, type Html } from "@mastrojs/mastro";

interface Props {
  title: string;
  children: Html;
}

export const Layout = (props: Props) =>
  html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${props.title}</title>
      </head>
      <body>
        <h1>${props.title}</h1>
        ${props.children}
      </body>
    </html>
  `;
```

</div>
</section>
</div>
</div>

Look at [more examples](https://github.com/mastrojs/mastro/tree/main/examples/), or the [source of this website](https://github.com/mastrojs/mastrojs.github.io).


## Easy for beginners

With Mastro, there is very little to learn – except for the web standards HTML, CSS, and JavaScript.

<div class="col2">
<div>

### No installation needed

The popular VS Code editor also runs in the browser: put your first website live without installing anything on your computer.

<a class="button" data-goatcounter-click="home.try" data-goatcounter-title="beginners" href="https://github.dev/mastrojs/template-basic">Get started on GitHub.dev</a>

</div>
<div>

### Learn the fundamentals

Start with HTML and CSS. Then build a blog, and a to-do list app with JavaScript. Finally, run a server with a REST API.

<a class="button" href="/guide/">Follow the guide</a>
</div>
</div>


## Powerful for experienced developers

> I've seen things you wouldn't believe. Megabytes of JavaScript on fire in the browser. I watched towers of complex abstractions collapse upon themselves. All those websites will be lost in time, like tears in rain. Time to let them die.

There are various [ways to run Mastro](/guide/cli-install/) and [deploy to production](/guide/deploy/). To get started, the easiest is [Deno](https://deno.com).

<section class="tab-group">
  <header>
    <label><input type="radio" name="install" class="tab1" checked>Deno</label>
    <label><input type="radio" name="install" class="tab2">Node.js</label>
    <label><input type="radio" name="install" class="tab3">Bun</label>
    <label><input type="radio" name="install" class="tab4">CF Workers</label>
  </header>

  <div tabindex=0 id="content1">

  Copy and paste into your terminal (or use the [template repo](https://github.com/mastrojs/template-basic-deno)):

  ```sh
  deno run -A npm:@mastrojs/create-mastro@0.0.9
  ```
  </div>
  <div tabindex=0 id="content2">

  Mastro requires Node.js >= 24. Since it's a [JSR package](https://jsr.io/@mastrojs/mastro), `pnpm` is recommended (although `npm` and `yarn` [also work](https://jsr.io/docs/npm-compatibility)).
  Copy and paste into your terminal (or use the [template repo](https://github.com/mastrojs/template-basic-node)):

  ```sh
  pnpm create @mastrojs/mastro@0.0.9
  ```
  </div>
  <div tabindex=0 id="content3">

  Copy and paste into your terminal (or use the [template repo](https://github.com/mastrojs/template-basic-bun)):

  ```sh
  bun create @mastrojs/mastro@0.0.9
  ```
  </div>
  <div tabindex=0 id="content4">

  Use Deno, Node.js, or Bun to generate a static site for the Cloudflare CDN. However, to run code on-demand in a [Cloudflare Worker](https://workers.cloudflare.com/), copy into your terminal (or use the [template repo](https://github.com/mastrojs/template-basic-cloudflare)):

  ```sh
  pnpm create @mastrojs/mastro@0.0.9 --cloudflare
  ```
  </div>
</section>

<a class="button" data-goatcounter-click="home.github" href="https://github.com/mastrojs/mastro/">☆ Mastro on GitHub</a>
<a class="button -secondary" href="/docs/">Docs</a>


## Fast for everyone

<div class="col2">

<div class="pagespeed">

**Websites built with Mastro load fast**

<a href="https://pagespeed.web.dev/">

- ![100%](/assets/home/circle.svg) Performance
- ![100%](/assets/home/circle.svg) Accessibility
- ![100%](/assets/home/circle.svg) SEO

</a>
</div>
<div>

**and build fast.** For [500 markdown files](https://github.com/mb21/bench-framework-markdown/commit/87e5713b01d298394f866ec3cb86da46db910ada):

|          |       |         |
|:---------|------:|:--------|
| Mastro   |  0.5s | &nbsp;🏁 |
| Eleventy |  0.7s |         |
| Astro    |  2.2s |         |
| Next.js  | 16.3s |         |

</div>

</div>


## Extensible

The minimal [Mastro core package](https://jsr.io/@mastrojs/mastro) doesn’t come "batteries included". But it is easily extended, simply by calling functions. There is a growing list of official extensions (usually just a single file wrapping a carefully chosen external dependency), and NPM and JSR packages you can [install](https://mastrojs.github.io/guide/third-party-packages/) which work well with Mastro.

- [Reactive Mastro](/reactive/) – client-side reactive GUI library
- [@mastrojs/markdown](https://jsr.io/@mastrojs/markdown) – generate HTML from markdown
- [@mastrojs/images](https://jsr.io/@mastrojs/images) – transform images (resize, compress, etc)
- [@mastrojs/og-image](https://jsr.io/@mastrojs/og-image) – generate images from text
- [@mastrojs/feed](https://jsr.io/@mastrojs/feed) – generate an Atom feed
- [Kysely](https://www.kysely.dev/) – type-safe SQL query builder
- [Sveltia CMS](https://github.com/mastrojs/template-sveltia-cms) – git-based CMS


## Reactive Mastro – interactivity simplified

When you need client-side interactivity, add Reactive Mastro – a tiny reactive GUI library for MPAs.

<a class="button" href="/reactive/">Get started</a>
<a class="button -secondary" href="/reactive/why-reactive-mastro/">Why Reactive Mastro?</a>


## Join the community

We're looking to build an inclusive community, where people of all kinds of backgrounds and experience levels feel welcome and safe, and help each other out. A place to ask questions and learn new things.

<div class="col2">
<div>

Do you have a question, need help, or want to talk about future plans?

<a class="button" data-goatcounter-click="home.github.discussions" href="https://github.com/mastrojs/mastro/discussions/new/choose">Start a GitHub discussion</a>
</div>
<div>

Something not working as expected? We consider that a bug.

<a class="button -secondary" data-goatcounter-click="home.github.issues" href="https://github.com/mastrojs/mastro/issues/">Open a GitHub issue</a>
</div>
</div>
