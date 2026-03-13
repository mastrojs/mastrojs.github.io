---
title: Caching, Service Workers and streaming
---

There are various ways to improve performance, and reduce load on your server.

## Caching

Storing data, in order for future requests to be served faster, is known as _caching_. The place where it's stored is called a _cache_. Caching is either done because the data was expensive to compute, or because the cache is physically closer to where the data will be needed. That's what a CDN is – a distributed cache with multiple locations across the globe, where the user will automatically connect to the one that's geographically closest to them.

Eagerly pregenerating assets in a build step, like we've seen in the [previous chapter](/guide/bundling-assets/), is one kind of caching. Another kind is to store the result of one request for future requests to the same URL (either in a CDN, an in-memory cache of your server, on using Redis or similar). This offers more flexibility and finer granularity, but has the disadvantage that the first request (until the cache is populated) will be slow.

The thing that's generally very difficult to get right with caching is _cache invalidation_: the question of when and how to remove a result from the cache, because it's no longer up to date. With static site generation, we typically just regenerate the whole site every time any part of it has changed. This is very easy to implement and reason about, but for websites with millions of pages, it usually takes too long. Another strategy is to set a time-to-live: tell the cache that it should invalidate an entry if it's older than a certain number of seconds, minutes or days. This is also easy to implement, but means that when you update a page, visitors will still see the old version of the page until it expires. There are many more caching strategies, each with their own subtleties to consider.

## HTTP caching

If you want to improve performance and reduce load on your server, HTTP caching is usually the first level of defense.
You do so by setting certain HTTP headers in your server's HTTP response, which will be picked up by the browser and/or a CDN.

In Mastro, you can pass plain JS objects (or [standard headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)) to the [`htmlResponse` function](https://jsr.io/@mastrojs/mastro/doc/~/htmlResponse) (or to the [standard Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) constructor).

The [MDN article on HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching), or [this guide to HTTP caching](https://www.jonoalderson.com/performance/http-caching/) are both good places to start reading.

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
