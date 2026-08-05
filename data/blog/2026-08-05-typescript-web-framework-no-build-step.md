---
title: TypeScript web framework with no build step – but how?
description: "Don't you have to compile TypeScript to JavaScript before you can run it?"
date: 2026-08-05
author: Mauro Bieg
authorLink: https://github.com/mb21
---

Mastro brands itself as a TypeScript web framework with no dependencies and no build step. But wait, how is that even possible? Don’t you have to compile TypeScript to JavaScript before you can run it? Yes, but developer experience all depends on how you do it.

Most TypeScript web frameworks nowadays do the TypeScript compilation as part of a complex build pipeline, which also applies a bunch of other transformations like minification, bundling multiple files together, and transforming JSX, HTML or CSS. By caching build artifacts, doing slightly less work when running as a dev server than what they do for a production build, and calling out to native-code, these tools are very good at hiding all the work they do.

Mastro, on the other hand, takes a different approach: just don’t do any of that work at all.


## Server-side TypeScript

The server-side code you write with Mastro is directly executed by Node.js, Deno or Bun – they all support [type-stripping](https://nodejs.org/api/typescript.html#type-stripping) natively nowadays, and have a built-in `--watch` flag (to get an auto-updating dev server). So for server-side code, the TypeScript transformation happens right in the JavaScript runtime – the first of many such transformations in the JIT compiler pipeline. But since nothing is pre-built, dev server start-up and reload is instantaneous – even for very large projects.

The feeling of working on a Mastro website is hard to describe. When switching back from a project with `node_modules` folders in the hundreds of MBs, it’s like a weight was unchained from your legs and you can suddenly fly. And then you open the browser’s dev tools on your website, and you see the exact same code you’re familiar with from your editor – nothing was transformed or injected – so at the same time, you feel very close to the high-performance rendering engine of the browser.


## Client-side TypeScript

Technically, there is no client-side TypeScript. Browsers still only support plain JavaScript. However, there are two lightweight solutions around this.

1. You can write **TypeScript types in JavaScript comments using [JSDoc annotations](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)**. This TypeScript:

    ```ts
    const wordCounts = (text: string) =>
      text.split(" ").reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    ```

    would look like as follows as plain JavaScript with JSDoc type annotations:

    ```js
    /**
     * @param {string} text
     */
    const wordCounts = text =>
      text.split(" ").reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, /** @type {Record<string, number>} */ ({}));
    ```


    While the syntax may not be quite as elegant, the functionality is pretty much equivalent. type errors show up in your IDE, and files can be checked with `tsc`. Try it on the [playground](https://www.typescriptlang.org/play/?filetype=js#code/PQKhCgAIUgBAHAhgJ0QW0gbwM4BdkCWAdgOYC+kuApgB65QjDgDGA9kXpAO6vIAmAYVYBXIrmyQAvJVq4pAPhl0AdNngAbArgAUAIki6AlFEjLkVPsOZVt2xM2YAabrz6GFWE5Ej3mAbR5+AF0pSDsHANcQgB9oyAAGdwBqSABGAG4vSHNcYWQiHwdM7zJnUBhYXABPeCosACUqNn4AHjxCUmciYTQAIypkeQpGMMwyQ0N0oA). And because all the annotations are only in JavaScript comments, the exact same file runs in the browser and can be published to npm – all without a build step.

2. But if you just want to write normal TypeScript, Mastro has you covered as well. When the dev server gets a request from the browser for a `*.client.ts` file, **Mastro type-strips it on the fly using Node.js’s built-in [`stripTypeScriptTypes`](https://nodejs.org/api/module.html#modulestriptypescripttypescode-options) function**. That’s right, still no build step!

Arguably, if you have a static site, you kind of have a build step per definition: generating the static site. And if you’re running a server, you probably still have a step in your CI pipeline where you run `tsc` to actually check the types, and maybe to [pregenerate assets](/guide/bundling-assets/).


## Conclusion

But either way, it’s a completely different setup than using a bundler like Vite or Webpack. No traversing the module graph, no fragile caching, and the production output is identical to the dev server’s: no server code that accidentally ends up in the client bundle, line numbers are still the same in production, and stack traces and browser dev tools are usable without finicky source maps.

Eliminating the build step makes things a lot simpler to reason about. It also allows Mastro’s dev server, static site generation and asset generation to be much faster than a bundler-based setup, leading to a delightful developer experience. And because Mastro is server-first, your users get very fast websites too.
