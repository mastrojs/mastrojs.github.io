---
title: Installing Reactive Mastro
template: splash
---

There are basically two ways to install Reactive Mastro. Using `npm`, or using the pre-bundled file from the CDN.

### Using `npm`

If your project uses npm and a bundler, you can add the `mastro` package as a dependency:

    npm install mastro

For example using the [Astro framework](https://astro.build/), you can then use Reactive Mastro in a `.astro` component like:

```html
<my-counter>
  Count is <span data-bind="count">0</span>
  <button data-onclick="inc">+</button>
</my-counter>

<script>
  import { ReactiveElement, signal } from "mastro/reactive"

  customElements.define("my-counter", class extends ReactiveElement {
    count = signal(0)
    inc () {
      this.count.set(c => c + 1)
    }
  })
</script>
```

(This will usually bundle Reactive Mastro together with your own JavaScript. That means one http request less, but it also means that every time you change your JavaScript, the whole bundle changes and its cache is invalidated.)

### Using the file from the CDN

If you don't want to deal with the complexities of a bundler, you can use the version pre-bundled and minified by [esm.sh](https://esm.sh/). Import it as a [JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), for example:

```html
<script type="module">
  import { ReactiveElement, signal } from "https://esm.sh/mastro@0.0.6/reactive?bundle"
```

Instead of referencing the esm.sh CDN directly, you can of course also [**download Reactive Mastro**](https://esm.sh/stable/mastro@0.0.6/es2022/reactive.bundle.js?bundle) and host it together with your other static assets.

Either way, we recommend using an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) so that you can refer to the file in all your own JavaScript modules using the shorthand `mastro/reactive`. That way, there is only one place to update the version number, and changing it will not change your own JavaScript files, which would invalidate their cache.

Here's a complete example that you can save as a `.html` file and open it in your browser by double clicking:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Counter</title>
    <script type="importmap">
      {
        "imports": {
          "mastro/reactive": "https://esm.sh/stable/mastro@0.0.6/reactive?bundle"
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
      import { ReactiveElement, signal } from "mastro/reactive"

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
