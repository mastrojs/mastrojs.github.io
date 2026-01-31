---
title: Reactive Mastro 🧙
metaTitle: Reactive Mastro – GUI library for MPAs
description: A tiny reactive GUI library for your existing MPA.
---

A tiny (2.8kB min.gz) reactive GUI library for your existing MPA. Reactive Mastro sits somewhere in between React/Vue/Solid/Svelte one one end, and Alpine/HTMX/Stimulus on the other end – while being smaller and simpler than all of them.

Reactive Mastro was conceived as the client-side part of [Mastro](/), but you can just as well use it with any other static site or server that renders HTML (such as Rails, Django, PHP, etc).

<a class="button" href="/reactive/install/">Get started</a>
<a class="button -secondary" href="/reactive/why-reactive-mastro/">Why Reactive Mastro?</a>

Server-side part is plain HTML:

```html
<my-counter>
  Count is <span data-bind="count">0</span>
  <button data-onclick="inc">Click me</button>
</my-counter>
```

Client-side part is plain JavaScript:

```js
import { ReactiveElement, signal } from "@mastrojs/reactive"

customElements.define("my-counter", class extends ReactiveElement {
  count = signal(0)

  inc () {
    this.count.set(c => c + 1)
  }
})
```

Result is:

:::tip

<my-counter>
  Count is <span data-bind="count" style="width: 2ch; display: inline-block">0</span>
  <button class="-minimal" data-onclick="inc">Click me</button>
</my-counter>
<script type="module">
import { ReactiveElement, signal } from "https://esm.sh/jsr/@mastrojs/reactive@0.4.1?bundle"
customElements.define("my-counter", class extends ReactiveElement {
  count = signal(0)
  inc () {
    this.count.set(c => c + 1)
  }
})
</script>

:::

For more examples, check out the [Todo list](https://codepen.io/mb2100/pen/EaYjRvW) CodePen, [client-side examples](https://github.com/mastrojs/mastro/tree/main/examples/reactive-mastro), [SSR example](https://github.com/mastrojs/mastro/tree/main/examples/todo-list-server), or continue reading.

## Get started with Reactive Mastro
