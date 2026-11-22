---
title: Installing Reactive Mastro
---

There are basically two ways to install Reactive Mastro. Using the pre-bundled file from the CDN, or using a package manager and bundler.

## Using a CDN

If you're on tech stack without a bundler (for example [Mastro](/), see [third-party packages](/docs/install-npm-packages-with-no-build-step/)), then you can simply import Reactive Mastro as a [JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). For example using the version pre-bundled and minified version:

```html
<script type="module">
  import { ReactiveElement, signal } from "https://cdn.jsdelivr.net/npm/@mastrojs/reactive@0.4.4/dist/reactive.min.js"
```

Instead of referencing the jsDelivr CDN, you can of course also download that file above and host it together with your other static assets.

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
          "@mastrojs/reactive": "https://cdn.jsdelivr.net/npm/@mastrojs/reactive@0.4.4/dist/reactive.min.js"
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

If you're using a framework that uses a bundler, you can add the `@mastrojs/reactive` package as a dependency:

    pnpm add @mastrojs/reactive

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
