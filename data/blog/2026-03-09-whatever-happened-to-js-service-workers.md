---
title: Whatever happened to JavaScript Service Workers?
description: "What's the right way to think about Service Workers in 2026? Are they HTTP proxies, offline-capable web apps, or free frontend servers?"
date: 2026-03-09
author: Mauro Bieg
---

**What's the right way to think about Service Workers in 2026? Are they HTTP proxies, offline-capable web apps, or free frontend servers?**

Not to be confused with Web Workers, which are relatively simple background threads for a website, [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) are a special kind of Web Worker. They have been available in all major browsers since 2017, but after a couple of years of hype, they largely disappeared from the web discourse again. Let’s fix that!

It’s sometimes a bit hard to grasp what Service Workers exactly are and what use-cases they enable. First, let’s look at three different views.


## Service Workers as network request proxies

This may be technically the most correct view (which is the best kind of correct).

After visiting a website with a service worker, it’s automagically installed in the user’s browser. From then on, it can intercept network requests from that website and handle them, e.g. acting as an HTTP proxy that caches network requests.

There are various caching strategies to choose from, like downloading everything upfront, only using the cache when there is no network connection, stale-while-revalidate, and many more.


## Service Workers as offline-capable apps

Yet service workers are not limited to caching resources as they are. Since they are implemented in JavaScript, they can also generate HTML pages on-the-fly – either by reading data from an on-device cache (like the [CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)), or by reading from a JSON API server.

In this architecture, the service worker code is often called the “app shell”. It can be updated independently from, and less often than the content of the app – which is typically text and images.

If that sounds a lot like a native mobile app that periodically pulls in content, or like a Single-Page-App ([SPA](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#spa-vs-mpa)), you’re not wrong. All three kinds of apps run code on-device in order to render some kind of GUI.

Like mobile apps – but unlike SPAs – Service Worker apps work even when the device is offline – but only once they’re installed and have downloaded all the data they need to work offline.

Finally, if you add a manifest file with the app’s home-screen icon, you have a PWA – a [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).


## Service Workers as running a free frontend server on the client

Making a request to a JSON API and rendering the response to HTML can equally be seen as basically what a stateless frontend server does. But while you’ve got to pay someone to keep your server running, a service worker is free forever!

While an edge network (e.g. Cloudflare Workers) is closer to your users than a traditional server, nothing beats already being installed in your user’s browser. But yes, the service worker first needs to be installed. This can be as easy as having a static loading page, or having the user install the PWA first.

But sometimes you just need that first page load to be already server-side rendered and up-to-date. The good news is that this is totally doable. The bad news is that it does add a bunch of complexity. It’s a problem anyone who’s been trying to server-side render SPAs (e.g. with Next.js) is familiar with – although a service worker is much more similar to a server environment than a browser window with its DOM and state.

Of course, there are things you can do in a browser window that you cannot do in a service worker. For example triggering animations, playing audio, or displaying popups. While a lot can be done with modern CSS alone, you may sometimes still need client-side JavaScript inside the browser window for that kind of interactivity. But intercepting a page navigation and rendering the HTML in the client – the quintessential SPA – is much better done off the main thread and inside a service worker. That even lets you [stream in the HTML](/blog/2026-01-13-html-http-streaming/), so that users can start interacting with the top of your page, while the bottom is still loading. And those interactions will be buttery smooth, since no JavaScript is blocking the main thread.


## What’s the catch?

That all sounds great. And the [2025 Web Almanac says](https://almanac.httparchive.org/en/2025/pwa#service-worker) that of the top 1000 pages by page rank, roughly 30% are managed by a service worker – which is more than I expected. There is definitely value here for developers of established websites. But why isn't every website running a service worker?

The whole thing comes at the cost of having to figure out an installation, updating and content caching strategy. This is probably the primary reason service workers are not in such widespread use as originally imagined. Because cache invalidation is just really hard to reason about.

A cache does speed things up and enable offline use-cases. But it can also serve outdated data – potentially forever. Most web developers are used to their changes taking effect immediately. Without getting deep into HTTP caching headers, the default on the web is for things to update within a few minutes or hours.

The default with service workers is that they may update only after 24 hours – and unless you call [`skipWaiting()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting), only after all existing tabs are closed and a new tab is opened. The reason for this is the cache that may be shared by different versions of the service worker. But I'd argue it's still a bad default. While there are ready-made solutions like [Workbox](https://developer.chrome.com/docs/workbox/), not everyone wants to install a library that may be somewhat of a black box.

I'm thinking of putting some effort into one or two Mastro starter templates with service workers with good defaults. Perhaps one for the "offline-capable app" use-case, and one for the "frontend server on the client" use-case. What do you think, would that be useful? Or do you have experience implementing a sort of service worker kill-switch? Let us know [on GitHub](https://github.com/mastrojs/mastro/discussions/categories/general) or `@` us [on Bluesky](https://bsky.app/profile/mastrojs.bsky.social).


## What does Mastro bring to the table for Service Workers?

Mastro is primarily a server-side web framework and static site generator. But since it’s so lightweight, it’s also well suited to do routing and HTML-rendering inside a service worker.

Mastro works well for either of the two architectures outlined above: an “app shell” that always renders everything in the service worker, or an “isomorphic” app that renders the initial page on the server (or Cloudflare Worker), and subsequent page navigations in the Service Worker – sharing all the code. To get started, see this simple [Mastro Service Worker project](https://github.com/mastrojs/mastro/tree/main/examples/bundled-service-worker).

To explore this design space further, I’m planning to build a Bluesky client app running in a service worker. Perhaps it will even render other kinds of ATProto content, like blog posts. To stay tuned, subscribe below!
