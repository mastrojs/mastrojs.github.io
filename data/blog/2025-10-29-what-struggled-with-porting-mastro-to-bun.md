---
title: What I struggled with when porting Mastro to Bun
date: 2025-10-29
author: Mauro Bieg
---

In our last blog post, I talked about [What I learned porting Mastro from Deno to Node.js](/blog/2025-10-27-what-learned-porting-from-deno-to-node-js.md). The next step was of course to get Mastro working on Bun as well.

And again, there were some gotchas that took me some time to resolve. Let’s go through them.


## fs.glob

The first thing I immediately ran into was easy to understand. Calling the Node.js `fs.glob` function with the `withFileTypes` option in Bun, while type-checking fine, results in a “not-implemented” runtime error. There’s a [Bun GitHub issue](https://github.com/oven-sh/bun/issues/22018) about that, with @robobun making a half-hearted attempt at a PR. You might wonder who @robobun is, and looking at their profile, it says “the official helper for Bun” – appears to be some AI bot.

Anyway, I just resorted to calling `fs.glob` without the `withFileTypes` option when in Bun, and making a call to `stat` for each file, to determine whether it’s a folder or a file.


## URLPattern

Next one up. While all three major browsers, Deno, and Node.js now support [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern), there is still an open [issue about it in Bun](https://github.com/oven-sh/bun/issues/2286).

This was also relatively easy to fix by loading the [urlpattern-polyfill](https://www.npmjs.com/package/urlpattern-polyfill), which I added as a dependency to [Mastro’s Bun starter template](https://github.com/mastrojs/template-basic-bun).


## bun create

The first tricky one was that running

    bun create @mastrojs/mastro@latest

failed to detect that we were running in Bun, and would download the wrong template – even when I checked for `typeof Bun` or `process.versions.bun`, which are the [official ways](https://bun.com/guides/util/detect-bun) to detect that.

But after publishing that package a few times, waiting for it to propagate through the CDNs, and running the command again, I was certain: neither of these work when inside `bun create`. Probably they're shimming it somehow to fake Node.js compatibility. But I couldn't find any official docs on that.

Thus we do what other such packages seem to do:

    process.env.npm_config_user_agent?.startsWith("bun")


## Bun.write

When generating the static files, I wanted to call `Bun.write` instead of the [weird Node.js code](/blog/2025-10-27-what-learned-porting-from-deno-to-node-js/#deno-namespace-adieu). That was the second weird gotcha: [Bun.write](https://bun.com/reference/bun/write) apparently doesn't take a standard [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), only: `string | ArrayBufferLike | TypedArray<ArrayBufferLike> | Blob | BlobPart[]`. Just to be sure, I tried passing it a `ReadableStream`. It didn’t fail at runtime, rejoice! But wait. What do we find when opening the generated file in a text editor? The file contains the contents `[object ReadableStream]` 🤡

So what does that mean? Does `Bun.write` just not support streaming into a file? Will it always have to wait for the whole thing to be written into a Buffer in memory first? The [official workaround](https://bun.com/docs/guides/write-file/stream) is to go through a `Response` object, which might or might not stream 🤷🏽‍♂️

Be that as it may, I already had a `Response` object coming from the Mastro route handler. So I decided to special-case it and directly pass it that `Response` object (instead of [`response.body`](https://developer.mozilla.org/en-US/docs/Web/API/Response/body), which is a `ReadableStream`). Then I ran the program. And... nothing. Like, literally nothing happened. It didn’t print “Generated static site and wrote to generated/ folder” like Mastro usually does. And indeed, while it created the folder, it was empty. But exit code was zero.

So I put some `console.log`s and an additional try-catch around it:


```js
console.log("before");
try {
  const nrBytesWritten = await Bun.write(outFilePath, response);
  console.log("after", nrBytesWritten);
} catch (e) {
  console.log("caught", e);
}
```

The above logged "before", and again exited with an exit code of zero. Yes, it just silently seemed to crash. Wow.

For all that the `Bun.write` docs like to advertise "the fastest syscalls available to copy from input into destination", that doesn't help a whole lot if it doesn't work properly.

And no, I cannot be bothered to create a reproducible test case right now. For the record, this was in Bun v1.3.1 on macOS 15.7.1, and I ran it in the [Mastro template for Bun](https://github.com/mastrojs/template-basic-bun) after editing `node_modules/@mastrojs/mastro/src/generator.js` directly. It might have something to do with `response` coming from a dynamically imported module (the route handler), or I don't know. I am happy to accept pull requests though, should anybody feel called to make `Bun.write` work in Mastro.

But for now, the moral of the story seems to be once again to just use Node.js's old-school and verbose API. At least that works – even in Bun.

Either way, it would actually be interesting to update [our benchmark](https://github.com/mb21/bench-framework-markdown/commit/87e5713b01d298394f866ec3cb86da46db910ada) to see whether streaming the `Response.body` into the file is actually really faster and/or consumes less memory, compared to serializing to a string first, and test it in Deno, Node.js and Bun.


## Conclusion

While those were weird, the good news is that overall, supporting Bun required very few [code changes to Mastro](https://github.com/mastrojs/mastro/commit/9073c2059471a1dcb796378d8c459be0adf6b6a3).
