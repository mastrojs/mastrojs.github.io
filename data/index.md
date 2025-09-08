---
title: The simplest web framework and site generator you've ever seen.
metaTitle: 'Mastro: the simplest web framework and site generator you’ve ever seen.'
description: 'No bloat, no magic, no config. Mastro gets out of the way, so that you can focus on building awesome websites.'
layout: hero
---

A simple file-based [router](/guide/server-side-components-and-routing/#routing-and-page-handlers), a handful of [composable functions](https://jsr.io/@mastrojs/mastro/doc) to return [standard Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) objects. Serve HTML, JSON, or whatever. No magic, no config.
Mastro gets out of the way, so that you can focus on building awesome websites.

- **No bloat**: written in just [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) of TypeScript, Mastro is a framework distilled to its essence.
- **No client-side JavaScript** (until you [add some](/guide/interactivity-with-javascript-in-the-browser/)): create lean [MPA](/guide/javascript/) websites that load blazingly [fast](#fast-for-everyone).
- **No bundler** (until you [add one](/guide/bundling-assets-caching/)): your code arrives in the browser exactly as you wrote it.
- **No magic**: use normal `<img>` and `<a>` tags referencing HTTP-first [assets](/guide/bundling-assets-caching/#transforming-images).
- **No VC-money**: this forces us to stay lean ourselves, and prevents eventual enshitification.
- **No hosting offer** to sell you on: frankly, running a service is not what we're interested in.
- **No update treadmill**: we use web standards and virtually no [dependencies](https://jsr.io/@mastrojs/mastro/dependencies), which allows us to keep things small and low-maintenance.

<p>
<picture>
  <source media="(width < 550px)" sizes="100vw" srcset="/assets/vscode-example-mobile.webp 512w, /assets/vscode-example-mobile@2x.webp 1024w">
  <source media="(width >= 550px)" sizes="100vw" srcset="/assets/vscode-example.webp 900w, ../../assets/vscode-example@2x.webp 1800w">
  <img  src="/assets/vscode-example.webp" width="1800" height="1017" alt="Screenshot">
</picture>
</p>

<div class="col2 -vertical-center">

  <a href="https://thenewstack.io/minimalist-mastro-framework-offers-modern-take-on-mpas/"><img alt="The New Stack" loading="lazy" src="/assets/home/thenewstack.svg" width="427"></a>

  <a href="https://thathtml.blog/2024/12/new-custom-element-superclass-on-the-block/"><img alt="That HTML blog" loading="lazy" src="/assets/home/thathtmlblog.svg" width="427"></a>

</div>


## Easy for beginners – no installation needed

With Mastro, there is very little to learn – except for the web standards HTML, CSS, and JavaScript. The popular VS Code editor also runs in the browser: put your first website live without installing anything on your computer.

<a class="button" href="https://github.dev/mastrojs/template-basic">Try online with GitHub</a>
<a class="button -secondary" href="/guide/setup/">Guide: Setup</a>


## Powerful for experienced developers

I've seen things you people wouldn't believe. Megabytes of JavaScript on fire in the browser. I watched towers of hard to debug abstractions collapse upon themselves. All those moments will be lost in time, like tears in rain. Time to let them die.

```sh title=Terminal
deno run -A jsr:@mastrojs/mastro@0.2.1/init
```

Start with the [template repo](https://github.com/mastrojs/template-basic-deno), run the above in a terminal, or see [installation instructions](/guide/setup-mastro-cli-or-server/#setup-a-local-server).

<a class="button" href="https://github.com/mastrojs/mastro/">Star Mastro on GitHub</a>
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

While the guide uses Mastro, the patterns discussed are universal to web development.

<a class="button" href="/guide/">Follow the guide</a>


## Reactive Mastro – interactivity simplified

The final part of Mastro is a tiny (2.8k min.gz) client-side reactive GUI library for MPAs.

<a class="button" href="/reactive/">Build interactive user interfaces</a>
<a class="button -secondary" href="/reactive/why-reactive-mastro/">Why Reactive Mastro?</a>


## Join the community

Something not working as expected? Would you like to contribute? Do you have a question?

<a class="button" href="https://github.com/mastrojs/mastro/issues/">Open a GitHub issue</a>
