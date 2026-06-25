---
title: Caching, Service Workers and streaming
---

There are various ways to improve your website's performance, and reduce load on your server. Usually, it involves some form of caching.

## Caching

Storing data in a second place, in order for future requests to be served faster, is known as _caching_. The place where it's stored is called a _cache_. Caching is either done because the data was expensive to compute, or because the cache is physically closer to where the data will be needed. That's what a CDN is – a distributed cache with multiple locations across the globe, where the user will automatically connect to the one that's geographically closest to them.

Eagerly pregenerating assets in a build step, like we've seen in the [previous chapter](/guide/bundling-assets/), is one kind of caching. Another kind is to store the result of one request for future requests to the same URL (either in a CDN, an in-memory cache of your server, on using Redis or similar). This offers more flexibility and finer granularity, but has the disadvantage that the first request (until the cache is populated) will be slow.

The thing that's generally very difficult to get right with caching is _cache invalidation_: the question of when and how to remove a result from the cache, because it's no longer up to date. With static site generation, we typically just regenerate the whole site every time any part of it has changed. This is very easy to implement and reason about, but for websites with millions of pages, it usually takes too long. Another strategy is to set a time-to-live: tell the cache that it should invalidate an entry if it's older than a certain number of seconds, minutes or days. This is also easy to implement, but means that when you update a page, visitors will still see the old version of the page until it expires. There are many more caching strategies, each with their own subtleties to consider.

### HTTP caching

If you want to improve performance and reduce load on your server, HTTP caching is usually the first level of defense. You do so by sending HTTP headers in your server's response. When using Mastro's [`htmlResponse`](https://jsr.io/@mastrojs/mastro/doc/~/htmlResponse) function, for example:

```js
return htmlResponse(myHtml, 200, { "Cache-Control": "max-age=60" });
```

The above tells any CDN, proxy, and ultimately the browser, that they can store a copy of the page and use it until it's older than 60 seconds. After that, they'll have to fetch a fresh copy if they need one.

:::tip
The [MDN caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching), and [this guide to HTTP caching](https://www.jonoalderson.com/performance/http-caching/), are both good starting places to learn more about HTTP caching.
:::


### Fingerprinting assets with hash-based file names

Increasing the cache lifetime of your HTML pages results in more cache hits. But it also means that any time you update your page, it takes longer for users to see the new version.

But for assets that you reference from your HTML (e.g. images, fonts, CSS and JavaScript files) there is a way out: we can add a unique hash of the asset file's contents to the file name. That way, whenever you publish a new version of the asset with different contents, the URL is a different one. This means we can set the cache lifetime of each URL to effectively forever.

In Mastro, if you place a file in `routes/_assets/` (or any subfolder), the build step will add a hash to its output file name. For example `routes/_assets/logo.png` will be copied to `generated/_assets/logo-f2ca1bb6.png`. This works also for dynamic routes like `routes/_assets/images/[...slug].server.ts`.

If you're running a server, make sure you run the [build step](/guide/bundling-assets/#build-step) (with `--only-pregenerate`) when you deploy to production. If you have a static site, you're running `generate` already anyway. This will not only populate the `generated` folder, but also create a `generatedAssets.json` file, which the `asset` function reads out when you use it in your HTML:

```ts title=components/Header.ts
import { asset, html } from "@mastrojs/mastro";

export const Header = () =>
  html`<img src=${asset("logo.png")}>`;
```

If there is a `generatedAssets.json` file preset (i.e. in production), this would output `<img src="/_assets/logo-f2ca1bb6.png">`. In local development, we don't want to spend a lot of time calculating hashes, so if there is no `generatedAssets.json` file, it's going to output `<img src="/_assets/logo.png">`. If you test the build step locally, don't forget to delete the `generatedAssets.json` file afterwards. (If that trips you up, you can do your own implementation of an [`asset`](https://github.com/mastrojs/mastro/blob/main/src/core/responses.ts#L85) function, e.g. one that looks out for an env variable to detect whether you're in production or not.)

Finally, in production, we shouldn't forget to serve the assets with a very long lifetime. For example 31556952 seconds, which is 1 year. When running a Node.js, Deno or Bun server, Mastro does this automatically.

For a static site, you need to configure your CDN or static file server to do so. Many CDNs (e.g. [Netlify](https://docs.netlify.com/manage/routing/headers/) or [Cloudflare](https://developers.cloudflare.com/pages/configuration/headers/)) have a `_headers` file for this:

```txt title=routes/_headers
/_assets/*
  Cache-Control: public, max-age=31556952, immutable
```

To make sure everything is working as expected, use your browser's network dev tools to inspect the `Cache-Control` response header for a few assets, and also for other routes – there is nothing more annoying than your users caching HTML pages forever, and you not noticing that they never see any updates to your website.

## Service Workers

A [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) is a piece of JavaScript that you can add to your website, which then is installed to, and runs on your users' browsers. One use-case is a programmable caching proxy. Another is using Mastro to do routing and HTML-rendering directly inside a service worker. But be sure to understand the Service Worker life-cycle before you add one to your production website.

Read about different ways to think about [Service Workers: HTTP proxies, offline-capable web apps, or free frontend servers](/blog/2026-03-09-whatever-happened-to-js-service-workers/).


## HTTP Streaming

Caching is great, but sometimes it's not an option – for example when you need the absolute newest data from the database. To improve performance in a case like that, you should consider HTTP streaming, where each chunk of the HTML page is sent from the server as soon as it's ready. That way, a user may already see the first row of a big data set in their browser, while the last row hasn't even been read out from the database yet.

To support it, all you have to do, is not break it on any level of the stack: from the database driver, to the HTML templates, all the way to your web hosting provider and CDN proxy. If there's an `await` or similar anywhere in that chain, which blocks until the whole page is loaded, then it cannot be streamed.

For an example, see [HTML Streaming in the docs](/docs/html-components/#html-streaming).

### Server-Sent Events (SSE)

To stream data (usually JSON), a very simple and common format is [server-sent events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). An example use-case is streaming in responses from an LLM like ChatGPT. A simple SSE server might look like:

```ts title=routes/sse.server.ts
import { sseResponse } from "@mastrojs/mastro";

export const GET = () => {
  return sseResponse(generator());
};

// JS generator returning an AsyncIterable
async function* generator() {
  yield { i: 1 };
  yield { i: 2 };
  yield { i: 3 };
}
```

If you're using a GET request and no custom headers, you can use the browser-built-in [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) to consume the SSE stream on the client. If you're using HTTP POST, use custom headers, or just want a more modern client that returns an [AsyncIterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols), use the tiny [fetch-event-stream library](https://github.com/lukeed/fetch-event-stream).

Play around with the Mastro [example of server-sent events](https://github.com/mastrojs/mastro/tree/main/examples/server-sent-events)!


## WebSockets

Server-sent events discussed above are unidirectional. If you also need to send data back from the client to the server, you can do so either via normal HTTP POSTs, or if you want a streaming connection, then use [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). This is often used for real-time bidirectional communication like a chats between users.

To write a web socket server, use `Deno.serve` with [`Deno.upgradeWebSocket`](https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket), or `Bun.serve` with the [`websocket` parameter](https://bun.com/docs/runtime/http/websockets).
Although the [Node.js issue](https://github.com/nodejs/node/issues/19308) was closed when it got a built-in [WebSocket client](https://nodejs.org/en/learn/getting-started/websocket), as of Node.js v25, there is still no built-in WebSocket server functionality and you'd need to use a library.
