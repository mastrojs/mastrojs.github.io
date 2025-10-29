---
title: The simplest web framework and site generator you've ever seen.
metaTitle: 'Mastro: the simplest web framework and site generator'
description: 'No bloat, no magic, no config. Mastro gets out of the way, so that you can focus on building awesome websites.'
layout: hero
---

Static site generation and on-demand rendering of HTML or JSON – it all works exactly the same in Mastro: a file-based [router](/guide/server-side-components-and-routing/#routing-and-page-handlers), and a handful of [composable functions](https://jsr.io/@mastrojs/mastro/doc) to return standard [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) objects.
No magic, no config – just focus on building awesome websites.

- **No bloat**: written in just [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) of TypeScript, Mastro is a framework distilled to its essence.
- **No client-side JavaScript** (until you [add some](/guide/interactivity-with-javascript-in-the-browser/)): create [MPA](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/) websites that load blazingly [fast](#fast-for-everyone).
- **No bundler** (until you [add one](/guide/bundling-assets-caching/)): your code arrives in the browser exactly how you wrote it.
- **No magic**: use normal `<img>` and `<a>` tags referencing HTTP-first [assets](/guide/bundling-assets-caching/#transforming-images).
- **No VC-money**: this forces us to stay lean and prevents eventual enshitification.
- **No hosting offer**: selling a service is not what we're interested in.
- **No update treadmill**: we use web standards instead of relying on many [dependencies](https://jsr.io/@mastrojs/mastro/dependencies).
- **No lock-in**: if you don't like some aspect of Mastro, just fork the code – it's only [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) after all.

<a class="button" href="https://github.dev/mastrojs/template-basic">Try online with GitHub</a>
<a class="button -secondary" href="#experienced-developers-–-do-you-want-off-the-frontend-treadmill%3F">Install with Deno, Node.js or Bun</a>

<p>
<picture>
  <source media="(width < 550px)" sizes="100vw" srcset="/assets/vscode-example-mobile.webp 512w, /assets/vscode-example-mobile@2x.webp 1024w">
  <source media="(width >= 550px)" sizes="100vw" srcset="/assets/vscode-example.webp 900w, /assets/vscode-example@2x.webp 1800w">
  <img  src="/assets/vscode-example.webp" width="1800" height="1017" loading="lazy" alt="Screenshot">
</picture>
</p>

<div class="col2 -vertical-center">

  <a href="https://thenewstack.io/minimalist-mastro-framework-offers-modern-take-on-mpas/"><img alt="The New Stack" loading="lazy" src="/assets/home/thenewstack.svg" width="427"></a>

  <a href="https://thathtml.blog/2024/12/new-custom-element-superclass-on-the-block/"><img alt="That HTML blog" loading="lazy" src="/assets/home/thathtmlblog.svg" width="427"></a>

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

Want to see more? Have a look at some [small examples](https://github.com/mastrojs/mastro/tree/main/examples/), or the [source of this website](https://github.com/mastrojs/mastrojs.github.io).


## Easy for beginners – no installation needed

With Mastro, there is very little to learn – except for the web standards HTML, CSS, and JavaScript. The popular VS Code editor also runs in the browser: put your first website live without installing anything on your computer.

<a class="button" href="https://github.dev/mastrojs/template-basic">Get started on GitHub.dev</a>
<a class="button -secondary" href="/guide/setup/">Guide: Setup</a>


## Experienced developers – do you want off the frontend treadmill?

I've seen things you people wouldn't believe. Megabytes of JavaScript on fire in the browser. I watched towers of hard to debug abstractions collapse upon themselves. All those moments will be lost in time, like tears in rain. Time to let them die.

There are [various way to run Mastro](/guide/cli-install/). If you're unsure which runtime to pick, we recommend [Deno](https://deno.com).

<div class="col3">

- **Deno**  ([template](https://github.com/mastrojs/template-basic-deno))

  ```sh
  deno run -A npm:@mastrojs/create-mastro@latest
  ```

- **Node.js**  ([template](https://github.com/mastrojs/template-basic-node))

  ```sh
  pnpm create @mastrojs/mastro@latest
  ```

- **Bun**  ([template](https://github.com/mastrojs/template-basic-bun))

  ```sh
  bun create @mastrojs/mastro@latest
  ```
</div>

<a class="button" href="https://github.com/mastrojs/mastro/">☆ Mastro on GitHub</a>
<a class="button -secondary" href="/guide/server-side-components-and-routing/">Guide: Mastro</a>
<a class="button -minimal" href="https://jsr.io/@mastrojs/mastro/doc">API docs</a>


## Fast for everyone

<div class="col2">

<div class="pagespeed">

**Websites built with Mastro load fast**

<a href="https://pagespeed.web.dev/analysis/https-mastrojs-github-io/krzuxxl52f?form_factor=mobile">

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


## Learn web development – from fundamentals to advanced techniques

Work with the fabric of the web instead of fighting it. Start with the fundamentals: HTML and CSS. Then build a static blog, and implement a to-do list app: once with plain JavaScript, then reactively. Finally, run a server with a REST API, and learn about caching and different architectures.

<a class="button" href="/guide/">Follow the guide</a>


## Reactive Mastro – interactivity simplified

The final part of Mastro is a tiny (2.8k min.gz) client-side reactive GUI library for MPAs.

<a class="button" href="/reactive/">Build interactive user interfaces</a>
<a class="button -secondary" href="/reactive/why-reactive-mastro/">Why Reactive Mastro?</a>


## Join the community

It's still early days. But we're looking to build an inclusive community, where people of all kinds of backgrounds and experience levels feel welcome and safe. A place to ask questions and learn new things, where people help each other out.

If you have a question, need help, or want to talk about future plans, please start a GitHub Discussion.
Something not working as expected or confusing? We consider that a bug – either in the code or in the docs. Please open an issue.

<a class="button" href="https://github.com/mastrojs/mastro/discussions/new/choose">Start a GitHub discussion</a>
<a class="button -secondary" href="https://github.com/mastrojs/mastro/issues/">GitHub issues</a>
