---
title: Four ways to do component-scoped CSS without a complex build step
description: ""
date: 2026-05-26
author: Mauro Bieg
authorLink: https://github.com/mb21
---

People have been exploring different ways to organize their CSS for almost as long as CSS has been around. In the beginning with methodologies like BEM, later with tooling like CSS modules, CSS-in-JS, and now [with Tailwind](/blog/2025-11-27-why-not-just-use-inline-styles-tailwind/).

But with browsers now [natively supporting](/guide/css/#want-to-learn-more-css%3F) CSS nesting, variables and `@scope` rules, let's look at four approaches to do things without resorting to complex tooling.


## 1. One big CSS file

Still a great way to get started. Don't overcomplicate things for a small website! And you always need a file with some globals to set up CSS variables, fonts, etc. anyway. If you're following Heydon Pickering's way of [applying a thorough base style to all your HTML elements](https://www.smashingmagazine.com/2016/11/css-inheritance-cascade-global-scope-new-old-worst-best-friends/) (which I highly recommend), a single file can carry you a long way.


## 2. A plain CSS file for each component

But maybe you've started organizing your template files into components. In that case, you may want to colocate your CSS for each component in the same folder (e.g. `components/Header.css`). But if you have more than a dozen components, serving each CSS file separately starts negatively affecting performance.

We'll be using [Mastro server components](/docs/html-components/) in the following examples, but you probably can adapt the approach to whatever setup you're using. A Mastro component for your website's header might look as follows. (Note that the `Header` component in turn uses the `Navigation` component.)

```js title=components/Header.js
import { html } from "@mastrojs/mastro";
import { Navigation } from "./Navigation.js";

export const Header = () =>
  html`
    <header>
      <p>My awesome website</p>
      ${Navigation()}
    </header>
  `;
```

The simplest way to [bundle](/guide/bundling-assets/) all your CSS is to just read out all your CSS files, and concatenate them. [In Mastro, everything is a route](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/). And a route to do that would look like:

```js title=routes/styles.css.server.js
import { findFiles, readTextFile } from "@mastrojs/mastro";

export const GET = async () => {
  const files = await findFiles("components/**/*.css");
  const contents = await Promise.all(files.map(readTextFile));
  return new Response(
    contents.join("\n\n"),
    { headers: { "Content-Type": "text/css" } },
  );
}
```

The route can be consumed by putting the following in your HTML:

```html
<link rel="stylesheet" href="/styles.css">
```

If you're using Mastro for static site generation, the resulting `styles.css` file will be generated along with all the other static pages. If you're using Mastro as a server, you should mark the route for [pregeneration](/guide/bundling-assets/#build-step). (Note that this approach is not yet supported when running Mastro in-browser with the VSCode extension.)

It's true that this doesn't minimize or otherwise transform your CSS. But your CDN or server most likely supports gzip compression out of the box, so there is no big performance hit. And you control exactly what gets shipped to the browser – no magic transforms or outdated prefixes are ever applied.


## 3. Inlining the styles into the component

CSS [@scope rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope) are now supported in every browser (including Safari >= 17.4). They are a browser-native solution to what BEM, CSS modules, etc. have been trying to do: scoping the styles to only apply to specific DOM subtrees.

One way to use them is by putting them directly in the HTML where they're used:

```js title=components/Header.js
import { html } from "@mastrojs/mastro";
import { Navigation } from "./Navigation.js";

export const Header = () =>
  html`
    <header>
      <p>My awesome website</p>
      ${Navigation()}

      <style>
        @scope {
          :scope {
            background-color: cyan;
          }
          p {
            font-size: 3rem;
          }
        }
      </style>
    </header>
  `;
```

The `:scope` selector will apply to the parent element of the `<style>` tag in the DOM, which is known as the scope root. In this example, it's the `<header>` element. Usually, that would be the root element of your component.

But the real win is that the selectors inside the `@scope` only apply to elements inside the scope root. In this example, only paragraphs inside this `<header>` element will get a font-size of `3rem`. All the other paragraphs on your website will remain untouched!

But at this point, the styles would also apply to whatever is rendered by the `Navigation` component, because it's inside the `<header>`. For the styles to only apply from the `<header>` but stop at the `<nav>` element (excluding it), you could use "donut scoping":

```html ins={2}
<style>
  @scope to (nav) {
    :scope {
      background-color: cyan;
    }
    p {
      font-size: 3rem;
    }
  }
</style>
```

Inlining the styles directly into the HTML like that, without making an additional HTTP request to a CSS route, is actually great for first page load performance – as long as you have the component only once or twice on the page. But for subsequent page loads, it would be better if we go back to putting the CSS in an external route that can be cached by the browser. What is faster depends a lot on how many times you use your components on any given page, how much CSS you have, and on how many pages your users typically visit.


## 4. Server-side CSS-in-JS

The other way to use @scope rules is to put them in an external stylesheet, and identify the scope root with a selector. With a bit of server-side JavaScript, we can still colocate the styles with the component's HTML.

Still using the donut scoping technique, but introducing the convention that every component root has a `data-scope` attribute (hat tip to Julia Evans [who dug out that example from the CSS spec](https://social.jvns.ca/@b0rk/116612656494336520)), this could look as follows:

```js title=components/Header.js
import { css, html } from "@mastrojs/mastro";
import { Navigation } from "./Navigation.js";

const root = "header";

export const Header = () =>
  html`
    <header data-scope=${root}>
      <p>My awesome website</p>
      ${Navigation()}
    </header>
  `;

export const styles = css`
  @scope ([data-scope=${root}]) to ([data-scope]) {
    :scope {
      background-color: cyan;
    }
    p {
      font-size: ${2 * 3}rem;
    }
  }
`;
```

Instead of `data-scope`, you could also use a different convention to uniquely identify component roots. For example using classes, with the convention that they need to contain a dash, like `@scope (.my-header) to ([class*="-"])`. Or using unregistered [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) with e.g. `@scope (my-header) to (:not(:defined))`.

The above uses Mastro's [`css`](https://jsr.io/@mastrojs/mastro/doc/~/css) tag literal (new in Mastro v0.8.5, feel free to copy its [one-line-implementation](https://github.com/mastrojs/mastro/blob/main/src/core/responses.ts#L105)). Just like the `html` tag literal, it enables [syntax highlighting](https://marketplace.visualstudio.com/items?itemName=ms-fast.fast-tagged-templates) and embedding server-side JavaScript expressions ([not client-side](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/), like many other CSS-in-JS solutions). This allows you to calculate things in server-side JavaScript that you might previously have used SCSS for. Heck, you could insert randomly generated class names and roll your own CSS Modules implemention with a few lines of code:

```js title=components/Header.js
import { css, html } from "@mastrojs/mastro";
const name = (prefix) => `${prefix}-${Math.random().toString(36).substring(2, 7)}`;

const root = name("header");

export const Header = () =>
  html`
    <header class=${root}>
      <p>My awesome website</p>
    </header>
  `;

export const styles = css`
  .${root} {
    background-color: cyan;
    > p {
      font-size: ${2 * 3}rem;
    }
  }
`;
```

Either way, to collect all the exported `styles` under a `/styles.css` route, use for example:

```js title=routes/styles.css.server.js
import { findFiles, readTextFile } from "@mastrojs/mastro";

export const GET = async () => {
  const base = await readTextFile("base.css").catch(() => "");
  const files = await findFiles("components/**/*.{js,ts}");
  const styles = await Promise.all(
    files.map(f => import("../" + f).then(m => m.styles))
  );
  return new Response(
    base + styles.join(""),
    { headers: { "Content-Type": "text/css" } },
  );
}
```


## Conclusion

By leaning into CSS features built into every modern browser, and leveraging [Mastro's flexible routes system](/blog/2026-01-29-everything-is-a-route-one-interface-for-servers-static-sites-and-assets/), we're getting most of the functionality of common build tools – but none of the complexity. We don't require any additional dependencies, and we're in full control of what gets sent to the browser.
