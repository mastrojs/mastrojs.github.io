---
title: The simplest web framework and site generator yet.
metaTitle: 'Mastro: the simplest web framework and site generator'
description: "A minimal tool for people who care about their users and the web."
layout: hero
---

<div class="herolist">

🤗 Mastro is a **minimal** tool for people who **care** about their users and the web.\
👨‍🍳 Use **web standards** and build directly on top of the browser and your JavaScript runtime.

<p class="mt-3 mb-6">
  <a class="button hide-mobile" data-goatcounter-click="home.try" data-goatcounter-title="top" href="https://github.dev/mastrojs/template-basic">Try online with GitHub</a>
  <a class="button -secondary" data-goatcounter-click="home.start" href="#powerful-for-experienced-developers">Get started</a>
  <a class="button -minimal" data-goatcounter-click="home.github" href="https://github.com/mastrojs/mastro/">☆ Mastro on GitHub</a>
</p>

## Minimal yet powerful

- **Static site generation** of [fast websites](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/) – ideal for blogs, marketing sites or webshops.
- **Server-side rendering** of [on-demand content](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/) – use Mastro as a full-stack web framework.
- **It all works the same**: add a [REST API](/guide/forms-and-rest-apis/#client-side-fetching-a-rest-api), serving JSON or XML, just like you'd render HTML.
- **Composable abstractions**: a [router](/docs/routing/#the-file-based-router-(default)) and a few [helper functions](/docs/html-components/) – that's all there is to Mastro.
- **Multi-runtime**: works on Deno, Node.js, Bun, Cloudflare and Service Workers.

## No bloat

- **No overhead**: implemented in just [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) of TypeScript, Mastro runs [fast](#fast-for-everyone).
- **No client-side JavaScript** (until you [add some](/guide/interactivity-with-javascript-in-the-browser/)): create [MPA](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/) websites that load [fast](#fast-for-everyone).
- **No bundler** (until you [add one](/guide/bundling-assets/)): your code ships exactly how you wrote it.
- **No magic**: use plain `<img>` and `<a>` tags referencing [HTTP-first assets](/guide/bundling-assets/#bundling-css).
- **No VC-money**: no eventual enshitification – selling is none of our business.
- **No update treadmill**: we use web standards instead of complex [dependencies](https://jsr.io/@mastrojs/mastro/dependencies).
- **No lock-in**: swap out Mastro later or fork it – it's only [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) after all.

</div>

<div class="tip center-text mt-3 mb-3">

## As seen on the Internet!

<div class="flex-center">

  <a href="https://thenewstack.io/minimalist-mastro-framework-offers-modern-take-on-mpas/"><img alt="The New Stack" loading="lazy" src="/assets/home/thenewstack.svg" width="400" height="48"></a>

  <a href="https://typescript.fm/bonus54"><img alt="TypeScript.fm" loading="lazy" srcset="/assets/home/typescriptfm@2x.webp 2x, /assets/home/typescriptfm.webp" width="150" height="150"></a>

  <a href="https://thathtml.blog/2024/12/new-custom-element-superclass-on-the-block/"><img alt="That HTML blog" loading="lazy" src="/assets/home/thathtmlblog.svg" width="400" height="91"></a>

</div>

<div class="flex-center">

<blockquote>
Mastro's source code is extremely readable.<br>
– <a href="https://typescript.fm/bonus54">Erik Onarheim</a>
</blockquote>

<blockquote>
A library worth checking out!<br>
– <a href="https://thathtml.blog/2024/12/new-custom-element-superclass-on-the-block/">Jared White</a>
</blockquote>

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
      title: "My blog",
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

<a class="button -secondary" href="https://github.com/mastrojs/mastro/tree/main/examples/">More examples</a>
<a class="button -minimal" href="https://github.com/mastrojs/mastrojs.github.io">Source of this website</a>


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

Start with HTML and CSS. Then build a static blog, a to-do list app with JavaScript. Finally, run a server with a REST API.

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
  deno run -A npm:@mastrojs/create-mastro@0.1.5
  ```
  </div>
  <div tabindex=0 id="content2">

  Mastro requires Node.js >= 24. Since it's a [JSR package](https://jsr.io/@mastrojs/mastro), `pnpm` is recommended (although `npm` and `yarn` [also work](https://jsr.io/docs/npm-compatibility)).
  Copy and paste into your terminal (or use the [template repo](https://github.com/mastrojs/template-basic-node)):

  ```sh
  pnpm create @mastrojs/mastro@0.1.5
  ```
  </div>
  <div tabindex=0 id="content3">

  Copy and paste into your terminal (or use the [template repo](https://github.com/mastrojs/template-basic-bun)):

  ```sh
  bun create @mastrojs/mastro@0.1.5
  ```
  </div>
  <div tabindex=0 id="content4">

  Use Deno, Node.js, or Bun to generate a static site for any CDN. However, to run code on-demand in a [Cloudflare Worker](https://workers.cloudflare.com/), copy into your terminal (or use the [template repo](https://github.com/mastrojs/template-basic-cloudflare)):

  ```sh
  pnpm create @mastrojs/mastro@0.1.5 --cloudflare
  ```
  </div>
</section>

<a class="button" data-goatcounter-click="home.github" href="https://github.com/mastrojs/mastro/">☆ Mastro on GitHub</a>
<a class="button -secondary" href="/docs/">Docs</a>


## Fast for everyone

<div class="col2">

<div class="pagespeed">

**Great UX**: websites built with Mastro are fast – even on [low-end devices on 3G](https://infrequently.org/series/performance-inequality).

<a href="https://pagespeed.web.dev/">

- ![100%](/assets/home/circle.svg) Performance
- ![100%](/assets/home/circle.svg) Accessibility
- ![100%](/assets/home/circle.svg) SEO

</a>
</div>
<div>

**Great DX**: dev server starts instantly, and SSG is fast – e.g. for [500 markdown files](https://github.com/mb21/bench-framework-markdown/commit/87e5713b01d298394f866ec3cb86da46db910ada):

|          |       |         |
|:---------|------:|:--------|
| Mastro   |  0.5s | &nbsp;🏁 |
| Eleventy |  0.7s |         |
| Astro    |  2.2s |         |
| Next.js  | 16.3s |         |

</div>

</div>


## A foundation to build upon

The minimal Mastro [core package](https://jsr.io/@mastrojs/mastro) doesn’t come "batteries included", but it is built to be extended.

<div class="col2">
<div>

### Extensions

- Tiny wrappers for carefully chosen deps:
  - [markdown](https://jsr.io/@mastrojs/markdown) to HTML
  - [images](https://jsr.io/@mastrojs/images) – resize/compress/etc.
  - [og-image](https://jsr.io/@mastrojs/og-image) – generate images from text
  - [feed](https://jsr.io/@mastrojs/feed) – generate RSS/Atom feeds
- [Install](https://mastrojs.github.io/guide/third-party-packages/) 3rd-party packages like:
  - [Kysely](https://www.kysely.dev/) – type-safe SQL query builder
  - [Sveltia CMS](https://github.com/mastrojs/template-sveltia-cms) – git-based CMS

Need something else? [Please ask](https://github.com/mastrojs/mastro/discussions/new?category=q-a)!

</div>
<div>

### Client-side interactivity

When you need interactivity in the browser, use plain JavaScript, or [add a library](/guide/third-party-packages/#on-the-client) such as [HTMX](https://htmx.org/), [Alpine](https://alpinejs.dev/), [Unpoly](https://unpoly.com/), [ArrowJS](https://arrow-js.com/), etc.

To [share templates](https://github.com/mastrojs/mastro/tree/main/examples/todo-list-server#interactive-to-do-list-with-ssr-and-rest-api) with the server, use Reactive Mastro – a tiny reactive GUI lib.

<a class="button" href="/reactive/">Reactive Mastro</a>
<a class="button -secondary" href="/reactive/why-reactive-mastro/">Why?</a>

</div>
</div>

## Join the community

We're building an inclusive community, where people of all kinds of backgrounds and experience levels feel welcome and safe, and help each other. A place to ask questions and learn new things.

<div class="col2">
<div>

### Want help or chat?

@-mention us on [Bluesky](https://bsky.app/profile/mastrojs.bsky.social), or talk to us on:

<a class="button -secondary" data-goatcounter-click="home.github.stoat" href="https://stt.gg/k7QMEaP1">Stoat Chat</a>
<a class="button -minimal" data-goatcounter-click="home.github.discussions" href="https://github.com/mastrojs/mastro/discussions/new/choose">GitHub Discussions</a>
</div>
<div>

### Star us on GitHub!

Every star and every share helps.

<a class="button -secondary" data-goatcounter-click="home.github.issues" href="https://github.com/mastrojs/mastro/">GitHub</a>
<a class="button -minimal" data-goatcounter-click="home.github.issues" href="https://github.com/mastrojs/mastro/issues/new">Report a bug</a>
</div>
</div>
