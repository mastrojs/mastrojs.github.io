---
title: Installing Reactive Mastro
---

There are basically two ways to install Reactive Mastro. Using the pre-bundled file from the CDN, or using a package manager and bundler.

## Using a CDN

If you're on tech stack without a bundler (for example [Mastro](/), see [third-party packages](/guide/third-party-packages/)), then you can simply import Reactive Mastro as a [JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). For example using the version pre-bundled and minified by [esm.sh](https://esm.sh/):

```html
<script type="module">
  import { ReactiveElement, signal } from "https://esm.sh/jsr/@mastrojs/reactive@0.4.1?bundle"
```

Instead of referencing the esm.sh CDN directly, you can of course also [**download Reactive Mastro**](https://esm.sh/@jsr/mastrojs__reactive@0.4.0/es2022/mastrojs__reactive.bundle.mjs) and host it together with your other static assets.

Either way, we recommend using an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) so that you can refer to the file in all your own JavaScript modules using the shorthand `@mastrojs/reactive`. That way, there is only one place to update the version number, and changing it will not change your own JavaScript files, which would invalidate their cache.

Here's a complete example that you can save as a `.html` file and open it in your browser by double clicking:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Counter</title>
    <script type="importmap">
      {
        "imports": {
          "@mastrojs/reactive": "https://esm.sh/jsr/@mastrojs/reactive@0.4.1?bundle"
        }
      }
    </script>
  </head>
  <body>
    <my-counter>
      Count is <span data-bind="count">0</span>
      <button data-onclick="inc">+</button>
    </my-counter>

    <script type="module">
      import { ReactiveElement, signal } from "@mastrojs/reactive"

      customElements.define("my-counter", class extends ReactiveElement {
        count = signal(0)
        inc () {
          this.count.set(c => c + 1)
        }
      })
    </script>
  </body>
</html>
```

## Using a framework with bundler

If you're using a framework that uses a bundler (e.g. Astro), you can add the `@mastrojs/reactive` package as a dependency. For example using [JSR’s npm compatibility layer](https://jsr.io/docs/with/node):

    npx jsr add @mastrojs/reactive

Or with any of the following package managers, which support JSR natively:

    pnpm add jsr:@mastrojs/reactive
    yarn add jsr:@mastrojs/reactive
    deno add jsr:@mastrojs/reactive

Then, for example using the [Astro web framework](https://astro.build/), you can use Reactive Mastro in a `.astro` component like:

```html
<my-counter>
  Count is <span data-bind="count">0</span>
  <button data-onclick="inc">+</button>
</my-counter>

<script>
  import { ReactiveElement, signal } from "@mastrojs/reactive"

  customElements.define("my-counter", class extends ReactiveElement {
    count = signal(0)
    inc () {
      this.count.set(c => c + 1)
    }
  })
</script>
```

This will usually bundle Reactive Mastro together with your own JavaScript. That means one HTTP request less, but it also means that every time you change your JavaScript, the whole bundle changes and its cache is invalidated.
