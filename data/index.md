---
title: The simplest web framework and site generator yet.
metaTitle: 'Mastro: the simplest web framework and site generator'
description: 'No bloat, no magic, no config. Mastro gets out of the way, so that you can focus on building awesome websites.'
layout: hero
---

- **Minimal yet powerful**: Mastro fills in the few missing pieces that aren't yet built into the platform: a file-based [router](/docs/routing/) and a handful of [composable functions](/docs/html-components/) to return standard [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) objects.
- **Static site generation and on-demand server rendering** of HTML or JSON [works all the same](/docs/routing/#route-handlers).
- **No bloat**: written in just [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) of TypeScript, Mastro feels like a framework but is just a library.
- **No client-side JavaScript** (until you [add some](/guide/interactivity-with-javascript-in-the-browser/)): create [MPA](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/) websites that load blazingly [fast](#fast-for-everyone).
- **No bundler** (until you [add one](/guide/bundling-assets-caching/)): your code arrives in the browser exactly how you wrote it.
- **No magic**: use normal `<img>` and `<a>` tags referencing HTTP-first [assets](/guide/bundling-assets-caching/#transforming-images).
- **No VC-money**: no eventual enshitification – selling a service is not what we're interested in.
- **No update treadmill**: we use web standards instead of relying on complex [dependencies](https://jsr.io/@mastrojs/mastro/dependencies).
- **No lock-in**: swap out calls to the Mastro library later on. Or fork it – it's only [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) after all.

<a class="button" data-goatcounter-click="home.try" data-goatcounter-title="top" href="https://github.dev/mastrojs/template-basic">Try online with GitHub</a>
<a class="button -secondary" href="#powerful-for-experienced-developers">Install with Deno, Node.js or Bun</a>

<div class="tip center-text">

## As seen on the Internet!

<div class="flex">

  <a href="https://thenewstack.io/minimalist-mastro-framework-offers-modern-take-on-mpas/"><img alt="The New Stack" loading="lazy" src="/assets/home/thenewstack.svg" width="400" height="48"></a>

  <a href="https://typescript.fm/43#t=38m22s"><img alt="TypeScript.fm" loading="lazy" srcset="/assets/home/typescriptfm@2x.webp 2x, /assets/home/typescriptfm.webp" width="110" height="110"></a>

  <a href="https://thathtml.blog/2024/12/new-custom-element-superclass-on-the-block/"><img alt="That HTML blog" loading="lazy" src="/assets/home/thathtmlblog.svg" width="400" height="91"></a>

</div>

</div>

<div class="tabs">
<details name="example" open>
<summary>routes/index.server.ts</summary>

```ts
import { readMarkdownFiles } from "@mastrojs/markdown";
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";

export const GET = async (req: Request) => {
  const posts = await readMarkdownFiles("data/posts/*.md");
  return htmlToResponse(
    Layout({
      title: "Hello world",
      children: posts.map((post) => html`
        <p>${post.meta.title}</p>
      `)
    })
  );
}
```
</details>
<details name="example">
<summary>components/Layout.ts</summary>

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

</details>
</div>

Want to see more? Have a look at some [examples](https://github.com/mastrojs/mastro/tree/main/examples/), or the [source of this website](https://github.com/mastrojs/mastrojs.github.io).


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

> I've seen things you people wouldn't believe. Megabytes of JavaScript on fire in the browser. I watched towers of complex abstractions collapse upon themselves. All those codebases will be lost in time, like tears in rain. Time to let them die.

There are [various way to run Mastro](/guide/cli-install/). If you're unsure which runtime to pick, we recommend [Deno](https://deno.com). For Node.js, `pnpm` is [recommended](https://jsr.io/docs/npm-compatibility), although `npm` and `yarn` also work.

<div class="col3">

- **Deno**  ([template](https://github.com/mastrojs/template-basic-deno))

  ```sh
  deno run -A npm:@mastrojs/create-mastro@0.0.8
  ```

- **Node.js**  ([template](https://github.com/mastrojs/template-basic-node))

  ```sh
  pnpm create @mastrojs/mastro@0.0.8
  ```

- **Bun**  ([template](https://github.com/mastrojs/template-basic-bun))

  ```sh
  bun create @mastrojs/mastro@0.0.8
  ```
</div>

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
