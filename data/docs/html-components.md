---
title: "Components and HTML"
---

To construct HTML, Mastro exports the [`html`](https://jsr.io/@mastrojs/mastro/doc/~/html) tagged [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), which makes sure things are properly escaped (unless [`unsafeInnerHtml`](https://jsr.io/@mastrojs/mastro/doc/~/unsafeInnerHtml) is used).

For syntax-highlighting, be sure to configure your editor accordingly. For example for VS Code, we recommend the [FAST Tagged Template Literals extension](https://marketplace.visualstudio.com/items?itemName=ms-fast.fast-tagged-templates).

Using template literals means that you have complete control over your HTML. You're free to [write HTML instead of XHTML](https://jakearchibald.com/2023/against-self-closing-tags-in-html/). That being said, while it says `html` on the tin, you can actually also use this to construct `SVG` or `XML` strings. It's just not going to be enforced that it's valid XML unless you run it through a [validator](https://validator.w3.org/) (which you should be doing anyway).

```ts
import { html, renderToString } from "@mastrojs/mastro";

const myName = "World";
const btnClass = "btn";

const str = renderToString(
  html`
    <h1>Hello ${myName}</h1>
    <a href="/" class=${btnClass}>Home</a>
  `
);
```

However, usually you will directly construct a `Response` object using `htmlToResponse`:

```ts title=routes/index.server.ts
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";

export const GET = (req: Request) =>
  htmlToResponse(
    Layout({
      title: "Hello world",
      children: html`<p>Welcome!</p>`,
    })
  );
```

In the above example, `Layout()` is a component call.


## Components

A Mastro server-side component is just a normal JavaScript function, that by convention is capitalized, takes a `props` object, and returns something of type `Html`. There's really no magic going on here.

Let's look at how a `Layout` component might be defined. Notice that it is in turn calling a component called `Header`.

```ts title=components/Layout.ts
import { html, type Html } from "@mastrojs/mastro";
import { Header } from "./Header.ts";

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
        ${Header()}
        <h1>${props.title}</h1>
        ${props.children}
      </body>
    </html>
  `;
```


## HTTP Streaming

[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and [AsyncIterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) can be passed directly into HTML templates without needing to be `await`ed.
When passed to [`htmlToResponse`](https://jsr.io/@mastrojs/mastro/doc/~/htmlToResponse), this will create a `Response` that sends the chunks over the wire as soon as they're available. For static site generation, this doesn't matter much (in fact, eagerly awaiting may even be a bit faster).

But when running a server, streaming instead of awaiting can dramatically speed up [time to first byte](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte): a user can start reading the top of your page, while the last row hasn't even left the database yet. In HTTP/1.1, this was known as [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding), but in HTTP/2 and HTTP/3 it's built in at the lower levels of the protocol.

To not break streaming, make sure you place promises directly in the template instead of awaiting them, and make sure to use an `AsyncIterable` instead of an array.

```ts title=routes/index.server.ts
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../components/Layout.ts";
import * as db from "../database.ts";

export const GET = (req: Request) => {
  // no await here to not break streaming
  const titlePromise = db.loadTitle();
  const rows = db.loadWidgets();

  return htmlToResponse(
    Layout({
      title: "My widgets",
      children: html`
        <h1>${titlePromise}</h1>
        <ul>
          ${mapIterable(rows, (row) =>
            html`<li>${row.title}</li>`
          )}
        </ul>
      `,
    })
  );
}

/**
 * Maps over an `AsyncIterable`, just like you'd map over an array.
 */
async function * mapIterable<T, R> (
  iter: AsyncIterable<T>,
  callback: (val: T) => R,
): AsyncIterable<R> {
  for await (const val of iter) {
    yield callback(val)
  }
}
```

We use our own `mapIterable` function, because while standard [Iterator helpers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/map) are specced and implemented, [async iterator helpers](https://github.com/tc39/proposal-async-iterator-helpers) are still a work in progress.


## Reading files

To abstract over the different environments Mastro runs in – the [Mastro VS Code extension](/guide/setup/), Deno, Node.js and Bun – the `@mastrojs/mastro` package also exports a few functions to read out files from your project folder: [`readDir`](https://jsr.io/@mastrojs/mastro/doc/~/readDir), [`findFiles`](https://jsr.io/@mastrojs/mastro/doc/~/findFiles) (uses `fs.glob`), [`readTextFile`](https://jsr.io/@mastrojs/mastro/doc/~/readTextFile), and [`readFile`](https://jsr.io/@mastrojs/mastro/doc/~/readFile).
