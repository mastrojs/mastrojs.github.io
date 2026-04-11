---
title: Why Mastro?
---

The JavaScript ecosystem has been moving to ever more complex frameworks and build systems. But a lot of that isn't necessary anymore.

- Browsers now have [MPA view transistions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API/Using#basic_mpa_view_transition) and [bfcache](https://web.dev/articles/bfcache). SPAs have [peaked](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#spa-vs-mpa).
- Native [CSS features](/guide/css/#want-to-learn-more-css%3F) replace much of SCSS.
- Node.js supports [TypeScript type stripping](https://nodejs.org/api/typescript.html#type-stripping) and [file watching](https://nodejs.org/api/cli.html#watch) out of the box.
- With ES modules in all browsers, bundling [shouldn't be the default anymore](/guide/bundling-assets/).

I have [been building websites](https://github.com/mb21/) for two decades. From PHP, over Ruby on Rails, to Next.js and Astro. I've seen a lot of things that work well, and a lot of things that don't. This has informed the following design principles.


## Design Principles

1.  Mastro is for people who **care about their users**, and value accessible websites that load fast – even on [low-end phones and slow networks](https://infrequently.org/series/performance-inequality/).

2.  Mastro is for people who **care about the web** and understand it as its own medium.
    - A webpage is [not a printed page with fixed dimensions](https://alistapart.com/article/dao/).
    - Mastro is designed to work with the [grain of the web](https://frankchimero.com/blog/2015/the-webs-grain/). Write [semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html), and [progressively](https://piccalil.li/blog/its-about-time-i-tried-to-explain-what-progressive-enhancement-actually-is/) [enhance](https://thehistoryoftheweb.com/the-inclusive-web-of-progressive-enhancement/) it with [beautiful CSS](http://localhost:8000/blog/2025-11-27-why-not-just-use-inline-styles-tailwind/) and [interactive JavaScript](/guide/interactivity-with-javascript-in-the-browser/).
    - Mastro is primarily designed for content-driven websites, and not for apps that download megabytes of client-side code and [reimplement basic browser functionality](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/).

3.  Mastro is for people who **care about simple technology**.
    - Instead of towers of leaky abstractions, Mastro gives you direct access to the underlying platform: the browser and your JavaScript runtime.
    - Simple things should be simple, and complex things should be possible.
    - Mastro grows with you: it is a beginner-friendly static site generator, but can morph into an unopinionated full-stack framework running [database-driven REST APIs and rich client-side interactivity](https://github.com/mastrojs/mastro/tree/main/examples/todo-list-server#interactive-to-do-list-with-ssr-and-rest-api).
    - Explicit separation of server and client-side. Code and secrets that were intended to stay on the server shouldn't accidentally end up in the client bundle.
    - Mastro provides a uniform interface for all content types: HTML, JSON, XML, binary, whatever. Instead of being abstracted away, the full power of the HTTP protocol is at your disposal [through the standard Request/Response API](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/).

4.  Mastro is for people who **care about their dependencies**.
    - Mastro will never take on VC-money and there will be no eventual enshittification.
    - Mastro’s [implementation](https://github.com/mastrojs/mastro/tree/main/src#readme) is low-maintenance and so small that you can read it in an hour or two. Should you ever outgrow it, you can simply fork it and adjust things to your needs.
    - Mastro is modular. If you prefer e.g. another templating engine, use that instead.
    - Mastro has a tiny [API-surface](https://jsr.io/@mastrojs/mastro/doc), and once we hit v1.0 it will remain extremely stable, so that projects that depend on Mastro aren’t stuck on an update-treadmill.
    - [Additional packages](/#extensions) in the `@mastro` namespace may have higher rates of change, and we invite the community to create additional packages on top of the standard Request/Response-API.
