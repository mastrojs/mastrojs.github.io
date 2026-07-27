---
title: Why Mastro?
---

Most JavaScript frameworks were designed to solve problems that no longer exist.

- [SPAs have peaked](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/). Browsers now have [MPA view transistions](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#buttery-smooth-navigation-in-mpas).
- [Native CSS](/guide/css/#want-to-learn-more-css%3F) can now replace much of SCSS. [Component-scoping works natively](/blog/2026-05-26-component-scoped-css-without-build-step/).
- Node.js supports [TypeScript type stripping](https://nodejs.org/api/typescript.html#type-stripping) and [file watching](https://nodejs.org/api/cli.html#watch) out of the box.
- With ES modules in all browsers, bundling [shouldn't be the default anymore](/guide/bundling-assets/).

Instead of starting with a client-side framework like React, and being forced to add more complex tooling with every release, Mastro was designed from the ground up server-first. Its core design principle is that **[everything is a route](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/)**.


#### Mastro is for people who…

<details>
<summary><strong>care about their users</strong></summary>

…and value accessible websites that load fast – even on [low-end phones and slow networks](https://infrequently.org/series/performance-inequality/).
</details>

<details>
<summary><strong>care about the web</strong></summary>

…and understand it as its own medium.

- A webpage is [not a printed page with fixed dimensions](https://alistapart.com/article/dao/).
- Mastro is designed to work with the [grain of the web](https://frankchimero.com/blog/2015/the-webs-grain/). Write [semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html), and [progressively](https://piccalil.li/blog/its-about-time-i-tried-to-explain-what-progressive-enhancement-actually-is/) [enhance](https://thehistoryoftheweb.com/the-inclusive-web-of-progressive-enhancement/) it with [beautiful CSS](/blog/2025-11-27-why-not-just-use-inline-styles-tailwind/) and [interactive JavaScript](/guide/interactivity-with-javascript-in-the-browser/).
- Mastro is primarily designed for content-driven websites, and not for apps that download megabytes of client-side code and [reimplement basic browser functionality](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/).
</details>

<details>
<summary><strong>care about simple and pragmatic technology</strong></summary>

- Instead of towers of leaky abstractions, Mastro gives you direct access to the underlying platform: the browser and your JavaScript runtime.
- No magic: simple things should be simple, and complex things possible.
- Mastro grows with you: it is a beginner-friendly static site generator, but can morph into an unopinionated full-stack framework running [database-driven REST APIs and rich client-side interactivity](https://github.com/mastrojs/mastro/tree/main/examples/todo-list-server#interactive-to-do-list-with-ssr-and-rest-api).
- Explicit [separation of server and client-side](/docs/routing/). Code and secrets that were intended to stay on the server shouldn't accidentally end up in the client bundle.
- [Everything is a route](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/) – Mastro provides a uniform interface for all content types: HTML, JSON, XML, binary, whatever. Instead of being abstracted away, the full power of the HTTP protocol is at your disposal through the standard Request/Response API.
</details>

<details>
<summary><strong>care about their dependencies</strong></summary>

- Mastro will never take on VC-money and there will be no eventual enshittification.
- Mastro’s [implementation](https://github.com/mastrojs/mastro/tree/main/src#readme) is low-maintenance and so small that you can read it in an hour or two. Should you ever outgrow it, you can simply fork it and adjust things to your needs.
- Mastro is modular. If you prefer e.g. another templating engine, use that instead.
- Mastro has a tiny [API-surface](https://jsr.io/@mastrojs/mastro/doc), which is already very stable. Once we hit v1.0, the public API will get frozen, so that projects that depend on Mastro aren’t stuck on an update-treadmill.
- [Additional packages](/#extensions-%2F-plugins) in the `@mastro` namespace may have higher rates of change, and we invite the community to create additional packages on top of the standard Request/Response-API.
</details>

#### Why Mastro instead of...
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
