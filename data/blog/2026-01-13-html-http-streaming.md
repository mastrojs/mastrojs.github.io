---
title: Improve Time to First Byte by streaming your HTML
date: 2026-01-13
author: Mauro Bieg
canonical: "https://calendar.perfplanet.com/2025/improve-ttfb-and-ux-with-http-streaming/"
---

If you have a statically generated website hosted on a CDN, it’s probably very fast (unless you add too much client-side JavaScript).

However, for dynamically generated pages that load content from a database, one of the most overlooked ways to speed up the perceived page load speed is HTTP streaming.

Unless you do streaming on your server, when you load rows from your database, it’s usually loaded into an array (or a similar structure), and only when the whole database query is done, the server continues assembling the HTML. And only when the whole page’s HTML is completely assembled, the server starts sending it over the wire to the browser. In JavaScript, this usually has the `await` keyword in front of the `db.query()` call. This is especially slow if you have a slow database, or a database call returning many rows.


## Streaming

Enter HTTP streaming. In HTTP/1.1, this was known as [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding) (some of you may remember it from PHP’s `flush()` function). But in HTTP/2 and HTTP/3, streaming is built in at the lower levels of the protocol.

The idea is simple: if for example the header of our page doesn’t depend on a database call, we can immediately send it over the wire to the browser. This dramatically improves [time to first byte](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte), and users can start reading the top of our page, while our server is still waiting for the database.

But there is more: if we have a page displaying hundreds or even thousands of rows from our database (perhaps a table, dashboard, or just your blog’s index page), we can also stream the database’s response, and display the HTML that was generated form the first result row, while the last row hasn't even left the database yet. All we have to do is not block the streaming anywhere in the whole chain from the database driver, to the HTML templates, all the way to your web hosting provider and CDN proxy. If there’s an `await` or similar anywhere in that chain, which blocks until the whole page is loaded, then it cannot be streamed.


## JavaScript/TypeScript example

Let’s look at a simple example using the [Mastro](https://mastrojs.github.io/) server framework to generate the HTML, and [Kysely](https://www.kysely.dev/) to query the database. Here’s the page handler for an HTTP GET to our page:

```ts
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";
import { db } from "../db/db.ts";
import { mapIterable } from "../db/iterable.ts";

export const GET = (req: Request) => {
  const rows = db
    .selectFrom("person")
    .select(["first_name"])
    .where("gender", "=", "woman")
    .stream();
  return htmlToResponse(
    Layout({
      title: "Hello World",
      children: html`
        <p>Welcome!</p>
        <ul>
          ${mapIterable(rows, (row) =>
            html`<li>${row.first_name}</li>`)}
        </ul>
      `,
    }),
  );
};
```

Note that we’re doing `rows = db.stream()` instead of `rows = await db.execute()`. While the latter would return an array, the former returns a [JavaScript Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). More specifically, an `AsyncIterable` containing Promises.

While JavaScript already has standard [Iterator helpers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/map), [Async Iterator Helpers](https://github.com/tc39/proposal-async-iterator-helpers) are unfortunately still a work in progress. Thus we had to roll our own `mapIterable` functions, which loops the Iterable just like you would `map` over an array. But importantly, it streams results through as they come in: the result of the `mapIterable` is again an `AsyncIterable`, which can be passed to the `html` template. Finally, the `htmlToResponse` function constructs a standard [JavaScript Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

Feel free to check out and play around with the [whole example project](https://github.com/mastrojs/mastro/tree/main/examples/postgresql).


_This article was originally published on the Web Performance Calendar. Read the [original article](https://calendar.perfplanet.com/2025/improve-ttfb-and-ux-with-http-streaming/)._

