---
title: The simplest website generator you’ve ever seen.
metaTitle: 'Mastro: the simplest website generator you’ve ever seen.'
description: 'Static site generator and web framework built from first principles.'
layout: hero
---

Mastro is a static site generator and web framework built from first principles.
A simple file-based router, a handful of [composable functions](https://jsr.io/@mastrojs/mastro/doc) to return HTML and standard [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects. No magic, no config.
Mastro is mostly about what it doesn't have:

- **No bloat**: written in just [~700 lines](https://github.com/mastrojs/mastro/tree/main/src#readme) of TypeScript, Mastro is a framework distilled to its essence.
- **No bundler**: control exactly what code arrives in the browser.
- **No client-side JavaScript** by default: create lean websites that load blazingly fast.
- **No VC-money**: this forces us to stay lean ourselves, and prevents eventual enshitification.
- **No hosting offer** to sell you on: frankly, running a service is not what we're interested in.
- **No update treadmill**: we use the platform and [almost no dependencies](https://jsr.io/@mastrojs/mastro/dependencies), which allows us to keep things small and low-maintenance.

<p><img sizes="100vw" srcset="/assets/vscode-example.webp 900w, ../../assets/vscode-example@2x.webp 1800w" src="/assets/vscode-example.webp" width="1800" height="1017" alt="Screenshot"></p>


## Easy for beginners

With Mastro, there is very little to learn – except for web standards: HTML, CSS and JavaScript. Use the popular VS Code editor, which also runs in the browser: no need to install anything nor learn the terminal.

<a class="button" href="https://github.dev/mastrojs/template-basic">Launch with GitHub</a>
<a class="button -secondary" href="/guide/setup/">Guide: Setup</a>


## Powerful for experienced developers

I've seen things you people wouldn't believe. Megabytes of JavaScript on fire in the browser. I watched towers of hard to debug abstractions collapse upon themselves. All those moments will be lost in time, like tears in rain. Time to let them die.

```sh title=macOS/Linux/WSL
deno run -A jsr:@mastrojs/mastro@0.1.3/init
```

Use the [template repo](https://github.com/mastrojs/template-basic-deno) or run the above in a unix terminal. See the guide for [installation instructions](/guide/setup-mastro-cli-or-server/#setup-a-local-server).

<a class="button" href="https://github.com/mastrojs/mastro/">Star Mastro on GitHub</a>
<a class="button -secondary" href="/guide/server-side-components-and-routing/">Guide: Mastro</a>
<a class="button -minimal" href="https://jsr.io/@mastrojs/mastro/doc">API docs</a>


## Mastro in the media

<div class="col2 -vertical-center">

  <a href="https://thenewstack.io/minimalist-mastro-framework-offers-modern-take-on-mpas/"><img alt="The New Stack" loading="lazy" src="/assets/home/thenewstack.svg" width="427"></a>

  <a href="https://thathtml.blog/2024/12/new-custom-element-superclass-on-the-block/"><img alt="That HTML blog" loading="lazy" src="/assets/home/thathtmlblog.svg" width="427"></a>

</div>


## Learn to work with the fabric of the web

Start with the fundamentals: HTML and CSS. Then build a static blog. Finally, explore two ways of implementing a to-do list app: once with plain JavaScript, then reactively.

While the guide uses Mastro, the patterns discussed are universal to web development.

<a class="button" href="/guide/">Follow the guide</a>


## Fast for everyone

<div class="col2">

<div class="pagespeed">

**Mastro websites load fast**

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


## Reactive Mastro – interactivity simplified

The final part of Mastro is a tiny (2.8k min.gz) client-side reactive GUI library for MPAs.

<a class="button" href="/reactive/">Build interactive user interfaces</a>
<a class="button -secondary" href="/reactive/why-reactive-mastro/">Why Reactive Mastro?</a>


## Community

Something not working as expected? Would you like to contribute? Do you have a suggestion?

<a class="button" href="https://github.com/mastrojs/mastro/issues/">Open a GitHub issue</a>
