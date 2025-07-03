---
title: Why Reactive Mastro?
template: splash
---

If you want the fastest initial page load possible, you will want to send very little JavaScript to the client. For almost all kinds of websites, that means you want a MPA (Multi-Page App) where the browser handles page navigation, not an SPA (Single-Page App) where that's reimplemented in JavaScript. If you need convincing, read Astro's [content-driven and server-first](https://docs.astro.build/en/concepts/why-astro/#content-driven) sections, or Nolan's [the balance has shifted away from SPAs](https://nolanlawson.com/2022/05/21/the-balance-has-shifted-away-from-spas/). Browsers have really stepped up their game regarding MPA page navigations. Two highlights:

- [back-forward cache](https://web.dev/articles/bfcache) is implemented in all modern browsers (meaning e.g. an infinite-loading list added with JavaScript will still be there on browser back navigation)
- [cross-document view transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API/Using#basic_mpa_view_transition) are implemented in Chrome and Safari.

### How does it compare to React, Vue, Svelte etc?

If you’re building a complex SPA (e.g. Figma or Google Sheets) which deals with client-side GUI state that contains deeply nested objects or arrays with thousands of items, then you’re probably better off with one of the major client-side frameworks (but if you're starting a new project, please go for a modern one like Svelte or Solid). However, optimising for the SPA case comes at a cost. Yes, nowadays all these frameworks support server-side-rendering for a faster initial page load, but still:

- They send all the data for the current page twice: once as HTML (the server-side-rendering), and once as JSON (for hydration).
- Since they are SPAs, at the latest when the user navigates to the next page, they need to download all the code for that page to the client.
- By reimplementing things that the browser already can do (like page navigation), they send a lot of JavaScript to the client that's just not needed if you work with the browser instead of against it.

Thus if you like the developer experience of those frameworks, but have an MPA and want to avoid the performance pain-points above, then Reactive Mastro might be for you.

By completely separating the server- and client-parts, you have full control over, and complete understanding of what’s sent to the client and what’s kept on the server. Because Mastro is not using a system like JSX, you can even avoid the hassle of a build step. You just write valid HTML and plain JavaScript.

While you can use TypeScript for server and client logic, not having a template processor (like JSX) comes at the cost of TypeScript not being able to check that the attributes in the server-generated HTML actually have corresponding handlers in the client-side scripts. Perhaps we’ll introduce an optional processor in the future that changes this trade-off. Also, when in conflict, Reactive Mastro aims to prioritize initial page load speed over raw client-side rendering performance.

### How does it compare to Alpine, Stimulus, HTMX?

While these libraries are also tailored towards MPAs, and also integrate well with whatever server-side HTML templating system you’ve already in place, Reactive Mastro is even smaller:

- smaller in terms of JavaScript size: min+gzipped, Reactive Mastro is 2.8kB vs the others >10kB
- smaller in terms of API surface to learn

In Alpine, you put all logic into HTML attributes. Reactive Mastro only uses attributes to attach the signals and event listeners to the DOM. The rest is written in normal JavaScript using signals, giving you a declarative developer experience. You will be familiar with [signals](https://docs.solidjs.com/concepts/intro-to-reactivity) if you have used either Solid, Svelte runes, Vue refs or Preact signals. The use of signals is also one of the differentiators to Stimulus, where you have to remember to imperatively call the right method to update the DOM yourself in all the right places. Stimulus also requires you to add the right `data-controller` and `data-x-target` attributes, which are not needed in Reactive Mastro.

Finally, there is HTMX, where every interaction makes a request to the server which sends back some HTML that’s inserted into the DOM. You never have to think about generating HTML on the client. But it also comes at a steep cost in terms of GUI-latency, especially on a bad network connection.


## Implementation

### Signals

For signals, we currently use the [maverick-js/signals](https://github.com/maverick-js/signals) library, mostly because it's tiny (~1kB minzipped). But we could consider switching that out with [signal-polyfill](https://github.com/proposal-signals/signal-polyfill) or similar if that would suit our needs better.

Besides that, the implementation of Reactive Mastro is just three very small files: one for [`html`](https://github.com/mastrojs/mastro/blob/main/src/html.ts) rendering, one for the [`ReactiveElement`](https://github.com/mastrojs/mastro/blob/main/src/reactive/reactive.ts) base class and one to parse the [`data-bind`](https://github.com/mastrojs/mastro/blob/main/src/reactive/reactive.util.ts) syntax.

### Custom elements

To connect our JavaScript with the right HTML element on the page, we use [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). Custom elements are part of the [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) suite of technologies. But when using Reactive Mastro, you don't have to use shadom DOM (which has a lot of gotchas) nor `<template>` elements (which are only useful with shadom DOM).

Using custom elements means the browser handles most of the work for us, such as enabling multiple instances of the same component on the same page and instantiation of nested components as soon as they're in the DOM.
