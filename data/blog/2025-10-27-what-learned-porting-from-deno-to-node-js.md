---
title: What I learned porting Mastro from Deno to Node.js
date: 2025-10-27
author: Mauro Bieg
---

**The Mastro web framework and static site generator initially ran only in the browser and Deno – it was living in the future, so to speak. Here's the story of how I ported it to Node.js (which has a surprising amount of functionality built-in nowadays), and what I would do differently next time.**

The first part of Mastro that I coded was actually [Reactive Mastro](https://mastrojs.github.io/reactive/) (a tiny reactive GUI library), which needs to run only in the browser. Then, I reused that minimal way to construct HTML in the [Mastro](https://mastrojs.github.io/) web framework and static site generator.

I started developing Mastro on Deno. The idea was (and still is) to build a modern tool from first principles – with minimal dependencies. Deno’s extensive standard library, early adoption of web standards like [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API), and builtin TypeScript support, made it a relatively easy choice. It was like building an MVP of Mastro in a future version of the JavaScript ecosystem. I don’t even remember whether Bun was already around at that time, or whether Deno’s philosophy of a green-field approach just more appealed to me for my green-field project. At that time, I didn’t know yet whether Mastro would be a one-off experiment, or whether it would turn into something with legs. But after getting it running on Deno, I found it had promise.

In just ~700 lines of TypeScript, I had something that covered like 90% of my use-cases when building websites. It was a very nice bonus that I got the static site generator running as a _VSCode for the Web_ extension, running completely inside the browser. ([Try it online on github.dev](https://github.dev/mastrojs/template-basic))


## Deno 2.0 and Node.js compatibility

Then Bun and Deno 2.0 happened, having extensive Node.js compatibility, and even [Cloudflare joined in](https://blog.cloudflare.com/nodejs-workers-2025/). The Node.js builtins seem to have become the standard library across JavaScript server runtimes – for better or worse. And to be fair, the commitment of the Node.js project to stability is actually something I’d like to see more of in the JavaScript ecosystem.

With Node.js now supporting TypeScript natively, I started to wonder: how much work would it take to make Mastro run in Node.js? And would the result still be minimal, maintainable, and without a build-step? Or would it be too riddled with compromises and if-Deno-else-Node cases?


## Deno namespace adieu

So I got to work. Targeting Node.js v24 LTS, we got builtin TypeScript type-stripping, `--watch` flag, a test runner, and `URLPattern` support. The first step was obviously to remove all calls to functions in the `Deno` namespace (like `Deno.readTextFile`), and replace them with the Node.js equivalents, which run just fine in Deno as well. This was mostly painless.

Pretty much the only case where I decided to still use a Deno-only function when it was available was for writing a stream to a file. Because look at that – please let me know if there's a better way!

```ts
const writeFile = async (path: string, data: ReadableStream<Uint8Array>) => {
  if (typeof Deno === "object") {
    return Deno.writeFile(path, data);
  } else {
    const { createWriteStream } = await import("node:fs");
    const { Readable } = await import("node:stream");
    return new Promise<void>((resolve, reject) =>
      Readable.fromWeb(data as any)
        .pipe(createWriteStream(path))
        .on("finish", resolve)
        .on("error", reject)
    );
  }
};
```

Since Mastro’s route handlers return a standard Response object, and all we have to do now when generating a static file is to call `writeFile("index.html", response.body)` (using the [`response.body` property](https://developer.mozilla.org/en-US/docs/Web/API/Response/body)), which seems extremely lean. Now let's look at the case of running a server (either for local development, or for production).


## Polyfilling Request/Response API

Using the standards-based `Request`/`Response` API for route handlers was one of the very first design decisions for Mastro. Val Town’s Steve Krouse called this [The API we forgot to name](https://blog.val.town/blog/the-api-we-forgot-to-name/), and Marvin Hagemeister more recently [The modern way to write JavaScript servers](https://marvinh.dev/blog/modern-way-to-write-javascript-servers/). Now, on Deno, you can pass such a handler to `Deno.serve`, and you’re pretty much done: it will start a server, and you can open your website in the browser.

Unfortunately, this is not something Node.js supports (and [apparently has no plans to](https://github.com/nodejs/help/issues/4174)). Thus we need a polyfill: fortunately, the [`@remix-run/node-fetch-server` package](https://www.npmjs.com/package/@remix-run/node-fetch-server) does exactly that, seems high-quality, and has no dependencies itself. In keeping with Mastro’s philosophy of exposing primitives and simple helper functions wherever possible, I decided to simple add `node-fetch-server` to [Mastro’s Node.js starter template](https://github.com/mastrojs/template-basic-node), where people can configure it to their liking, or even swap it out with something else. Check it out in the `server.ts` file, it’s still relatively bare-bones – even if not quite as clean as in [Mastro’s Deno starter template](https://github.com/mastrojs/template-basic-deno).


## HTTP imports and stdlib

Node.js also doesn’t support http imports. In fact, they recently [reverted the `--experimental-network-imports` flag](https://github.com/nodejs/node/pull/53822), because it wasn’t clear how this would work within Node’s security model. This forced me to reorganize some code, and move some non-core Mastro helpers out to [their own packages](https://jsr.io/@mastrojs). Arguably, this was for the best anyway, as it makes the modular nature of Mastro clearer. These packages are each only a single file, wrapping a carefully chosen external dependency.

The last two functions from Deno’s standard library that I needed were [`contentType`](https://jsr.io/@std/media-types/doc/~/contentType) from `@std/media-types` and [`serveFile`](https://jsr.io/@std/http/doc/~/serveFile) from `@std/http`. The former wasn’t a problem, because that package is marked as Node.js-compatible. The latter I ended up simply copying into the Mastro codebase (with proper attribution). They are both pure functions that run on Node.js without any problems.

And voila, we have Mastro fully running on Node.js! But hold on, we still need to publish it as a package somewhere.


## NPM vs JSR

If you haven’t been following the Deno ecosystem, you may be surprised to hear that there’s an alternative to the NPM package registry now: [JSR](https://jsr.io/). While its search absolutely sucks, its auto-generated docs pages are quite nice. And most importantly for me personally: I can simply push my TypeScript files to it, and it will make the transpiled JavaScript files available for consumption with Node.js. No need for me to install and update TypeScript, `@types/node`, nor understand the various fields in `tsconfig.json`. That's all contained in the `deno` executable.

While `pnpm` is recommended to consume JSR packages, `npm` and `yarn` also work through a [compatibility layer](https://jsr.io/docs/npm-compatibility). For the Mastro VSCode extension, I use [esm.sh](https://esm.sh/) to import the Mastro JSR package in the browser.

Thus I have a very simple and lean setup for maintaining a single code-base that runs in the browser, Deno and Node.js – with almost no duplicated code. (After quite some fiddling and experimenting, Bun works as well now, but that's a story for another blog post.)


## JSR and npx

To create a new Mastro project, I used to advertise `deno run -A jsr:@mastrojs/mastro@0.3.0/init`, which would download and run the `init` export directly from the `@mastrojs/mastro` package from JSR and run it. Simple.

But remember, Node.js doesn’t do scripts over HTTP. In the Node.js ecosystem it’s all `npx` nowadays. Or apparently `npm create`, which runs `npx` and just prepends `create-` to the package name?! But then at least you can do `pnpm create` instead of `pnpm dlx` 🙈 Either way, unfortunately JSR doesn’t support generating a `package.json` with a [`bin` field](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin) – which is what `npx` or `npm/pnpm create` needs when you execute:

    pnpm create @mastrojs/mastro@latest

Thus what I ended up doing was simply moving that script out to its own package, and publish that one to NPM. So now the above command works. Because I didn’t want to add TypeScript and a build step just for that, I opted to write [that script](https://github.com/mastrojs/mastro/blob/main/create-mastro/index.js) in plain JavaScript, put the TypeScript type annotations in JSDoc comments, and add a `//@ts-check` at the top of the file. That way, I can run `deno check` on it and it’s fully type-checked.


## Conclusion

If I’d start a new project today that needs to run on many JavaScript engines, I’d obviously plan ahead a bit more, and use Node.js builtins over the Deno namespace where possible.

But overall, I’m quite happy with how things turned out. Deno allowed me to “live in the future”, before the same features landed in Node.js. And for some things, this is still the case; like `Deno.serve` (which you can polyfill), or not having to `npm install` and deal with the `node_modules` folder.

I hope by reading this, you can avoid some of the pitfalls in your next project.
