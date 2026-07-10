---
title: "No dependencies. No build step.\nJust a simple web framework."
metaTitle: 'Mastro: No dependencies. No build step. Just a simple web framework and static site generator.'
description: "A minimal tool for people who care about their users and web standards."
layout: hero
---

<div class="herolist">

Mastro is a **web framework** and **site generator** for people who care about their users and web standards. It's is implemented in just **~800 lines** of TypeScript.

Use JavaScript/TypeScript’s mature tooling to build fast MPA websites.
Instead of going through layers of abstraction, work directly with the browser and your JavaScript runtime – Node.js, Deno, Bun, or Workers.

<a class="button" data-goatcounter-click="home.start" href="/docs/getting-started/">Get started</a>
<a class="button -secondary" href="/docs/">Docs</a>
<a class="button -minimal" data-goatcounter-click="home.github" href="https://github.com/mastrojs/mastro/">☆ Mastro on GitHub</a>

<div class="tip text-center mt-3 mb-3">

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


## Minimal yet powerful

- **Static site generation** (SSG) – ideal for blogs, marketing sites or webshops that are [fast](/#fast-for-everyone).
- **Server-side rendering** (SSR) – use Mastro's composable primitives as a [full-stack framework](/guide/forms-and-rest-apis/#a-mock-database).
- **Everything is a route**: serve HTML, JSON [REST APIs](/guide/forms-and-rest-apis/#client-side-fetching-a-rest-api), [CSS](/blog/2026-05-26-component-scoped-css-without-build-step/), and [images](/guide/bundling-assets/#transforming-images) with the [same API](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/).
- **Adopt incrementally**: use [templates](/docs/html-components/) in your existing codebase or [migrate route by route](/blog/2025-11-06-migration-from-express/).


## No dependencies, no build step

- **No bloat**: implemented in just [~800 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) of TypeScript, Mastro is [fast](#fast-for-everyone).
- **No build step** (until you [add one](/guide/bundling-assets/)): your code ships exactly how you wrote it.
- **No JavaScript** (until you [ship some](/guide/interactivity-with-javascript-in-the-browser/)): create [MPA](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/) websites that load extremely [fast](#fast-for-everyone).
- **No dependencies**: use web standards instead of keeping up with the frontend treadmill.
- **No VC-money**: no eventual enshitification – selling is none of our business.
- **No lock-in**: swap out Mastro later or fork it – it's only [~800 lines](https://github.com/mastrojs/mastro/tree/main/src#readme).

<a class="button" href="/docs/why-mastro/">Why Mastro?</a>

</div>


<div class="col-2 breakout gap-1">
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

<a class="button hide-mobile" data-goatcounter-click="home.try" href="https://vscode.dev/github/mastrojs/template-basic">Try Mastro online</a>
<a class="button -secondary" href="https://github.com/mastrojs/mastro/tree/main/examples/">More examples</a>
<a class="button -minimal" href="https://github.com/mastrojs/mastrojs.github.io">Source of this website</a>


## Easy for beginners

<div class="col-2">
<div>

Put your first website live without installing anything on your computer: The popular VS Code editor also runs in the browser.

<a class="button" data-goatcounter-click="home.try" data-goatcounter-title="beginners" href="https://vscode.dev/github/mastrojs/template-basic">Launch Mastro in your browser</a>

</div>
<div>

Start with learning HTML and CSS. Then build a static blog and a to-do list app with JavaScript. Finally, serve a REST API.

<a class="button -secondary" href="/guide/">Follow the guide</a>
</div>
</div>


## Powerful for experienced developers

> I've seen things you wouldn't believe. Megabytes of JavaScript on fire in the browser. I watched towers of complex abstractions collapse upon themselves. All those websites will be lost in time, like tears in rain. Time to let them die.


<a class="button" href="/docs/getting-started/">Install Mastro</a>
<a class="button -secondary" href="/docs/">Docs</a>
<a class="button -minimal" data-goatcounter-click="home.github" href="https://github.com/mastrojs/mastro/">☆ Mastro on GitHub</a>


## Fast for everyone

<div class="col-2">

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
| 11ty     |  0.7s |         |
| Astro    |  2.2s |         |
| Next.js  | 16.3s |         |

</div>

<div>

### Why Mastro instead of...
<details>
<summary>Next.js</summary>

Next.js creates [bloated SPAs](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/): every feature you add increases the amount of JS your users have to download. Running your code on the server, then running it again on the client, also adds a lot of complexity.
</details>

<details>
<summary>Astro</summary>

Astro was a big inspiration for Mastro (the name originated from "minimal Astro"). But Astro currently has [246 dependencies weighing 87 MB](https://npmx.dev/package/astro). Astro is also heavily coupled to its [bundler](/guide/bundling-assets/), which makes some simple things surprisingly complex.
</details>

<details>
<summary>11ty</summary>

Eleventy has a lot of options around static site generation, but it doesn't run as a server. It is [not TypeScript-first](https://github.com/11ty/eleventy/issues/3787), and currently still has [116 dependencies weighing 14 MB](https://npmx.dev/package/@11ty/eleventy).
</details>

<details>
<summary>Hono</summary>

Hono is almost as minimal as Mastro. But it is more backend focused (e.g. it doesn't come with a file-based router).
</details>
</div>

<div>

### Escape the frontend treadmill

With today's browsers and engines, there is no need for complex frameworks and build systems anymore.

<a class="button" href="/docs/why-mastro/">Why Mastro?</a>
</div>
</div>


## A foundation to build upon

The minimal Mastro [core package](https://jsr.io/@mastrojs/mastro) doesn’t come "batteries included", but it's built to be extended.

<div class="col-2">
<div>

### Extensions / plugins

- Tiny libs in the `@mastrojs` namespace:
  - [markdown](https://github.com/mastrojs/markdown) to HTML
  - [images](https://github.com/mastrojs/images) – resize/compress/etc.
  - [og-image](https://github.com/mastrojs/og-image) – generate images from text
  - [feed](https://github.com/mastrojs/feed) – generate RSS/Atom feeds
  - [atproto](https://github.com/mastrojs/atproto) – add support for [Standard.site](/blog/2026-06-05-how-to-add-standard-site-support-to-your-website/)
  - [api](https://github.com/mastrojs/api) – type-safe REST APIs and clients
  - [result](https://github.com/mastrojs/result) – a minimal `Result` type
- [Install](/guide/third-party-packages/) 3rd-party packages like:
  - [Kysely](https://www.kysely.dev/) – type-safe SQL query builder
  - [Sveltia CMS](https://github.com/mastrojs/template-sveltia-cms) – git-based CMS

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

<div class="col-2">
<div>

### Want help or chat?

Talk to us on [Bluesky](https://bsky.app/profile/mastrojs.bsky.social),
<a data-goatcounter-click="home.github.discussions" href="https://github.com/mastrojs/mastro/discussions">GH Discussions</a>, or:

<a class="button" data-goatcounter-click="home.discord" href="https://discord.gg/gmw2VEW5Rw">Discord</a>
<a class="button -secondary" data-goatcounter-click="home.stoat" href="https://stt.gg/k7QMEaP1">Stoat</a>
</div>
<div>

### Star us on GitHub!

Every star and every share helps.

<a class="button -secondary" data-goatcounter-click="home.github.issues" href="https://github.com/mastrojs/mastro/">GitHub</a>
<a class="button -minimal" data-goatcounter-click="home.github.issues" href="https://github.com/mastrojs/mastro/issues/new">Report a bug</a>
</div>
</div>
