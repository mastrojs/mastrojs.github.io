---
title: Using Reactive Mastro
template: splash
---

You register your custom element once with `window.customElements.define('my-counter', class extends ReactiveElement { })` (the name must start with a lowercase letter and contain a hyphen), and then you can use it wherever in your HTML body, e.g. `<my-counter></my-counter>`. No JavaScript imports nor manually calling a constructor needed.

Your class extends Reactive Mastro's `ReactiveElement` class, which in turn extends the browser's `HTMLElement` class. Thus you're almost using plain
custom elements, and have access to all native callbacks and methods (such as [attaching shadow DOM](https://github.com/mastrojs/mastro/issues/2)), should you choose to use them. However, what `ReactiveElement` does for you on `connectedCallback`, is two things:

- attach event listeners to handle your `data-on*` attributes (e.g. `data-onclick`), and
- bind signals to the DOM elements you put `data-bind` on.

This enables a declarative developer experience (similar to React):

- When an event (e.g. a `click` event) fires, the event listener calls an _action_ method (`inc` in the counter example above).
- That method updates a central _state_ (the signal, which is a public field of your class).
- The signal in turn causes the _view_ (i.e. the DOM) to automatically be updated in all the affected places.

This makes sure your model (the signal) stays in sync with your view (the DOM), and saves you from the spaghetti code that happens all too quickly when manually updating the DOM using jQuery or vanilla JavaScript. For a longer introduction to this approach of state management, see for example [Solid's docs](https://docs.solidjs.com/guides/state-management).

### Client-side rendering islands

One way to use Reactive Mastro is to implement an [islands architecture](https://jasonformat.com/islands-architecture/). Each custom element is an interactive island in your otherwise static (or server-rendered) HTML page. By implementing an `initialHtml` function on your component, which Reactive Mastro will call, you can client-side render the HTML for that island:

Server HTML:

```html
<my-counter start="7"></my-counter>
```

Client JS:

```js
import { html, ReactiveElement, signal } from "mastro/reactive"

customElements.define("my-counter", class extends ReactiveElement {
  count = signal(parseInt(this.getAttribute("start") || "0", 10))

  initialHtml () {
    return html`
      Counting <span data-bind="count">${this.getAttribute("start")}</span>
      <button data-onclick="inc">+</button>
    `
  }

  inc () {
    this.count.set(c => c + 1)
  }
})
```

Note the `html` function which [tags the template literal](https://blog.jim-nielsen.com/2019/jsx-like-syntax-for-tagged-template-literals/) that follows it. To syntax highlight such tagged template literals, you may want to install an extension for your favourite editor, such as [this extension for VSCode](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html).

Implementing an `initialHtml` function has the advantage that you can also dynamically instantiate such a component as a child of another component, thereby building up hierarchies of client-side rendered components like you may know from SPAs. If you want to client- and server-render the same HTML, you can assign the html string to a variable, export it, and use it in your JavaScript-based server (e.g. Mastro).

### Server-side rendering even more

However, often you don't need the ability to client-side render the whole component. Instead, you would prefer to server-render almost all your HTML, and never send it to the client as JavaScript. That's where Reactive Mastro really shines: you can ship even less JavaScript to the client than in an islands architecture. See the "counter" example at the very top of this page? Note that the HTML never shows up in the client-side JavaScript. This is a pattern [some call HTML web components](https://hawkticehurst.com/2023/11/a-year-working-with-html-web-components/). In a big application with lots of content, this approach can significantly reduce your JavaScript bundle size.

It also enables you to more clearly think about what your page will look like before JavaScript finishes loading and executing, or when it fails to execute at all – an old idea called [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

This might mean that instead of adding and removing HTML elements in the DOM with client-side JavaScript, you server-side render all of them, and then hide some with client-side JavaScript and CSS. For example, to either show one tab or the other, in React it's common to do something like `{visibleTab === "tab1" ? <Tab1 /> : <Tab2 />}`. But that means you need to send the JavaScript to render both Tab1 and Tab2 to the client. You can avoid that e.g. as follows:

Server HTML:

```html
<simple-tabs>
  <button data-onclick="switchTo('home')">Home</button>
  <button data-onclick="switchTo('profile')">Profile</button>

  <section data-bind="class.hidden=isNotActiveTab('home')">
    <h3>Home</h3>
    <p>My home is my castle.</p>
  </section>

  <section data-bind="class.hidden=isNotActiveTab('profile')">
    <h3>Profile</h3>
    <p>My name is...</p>
  </section>
</simple-tabs>

<style>
  .hidden {
    display: none;
  }
</style>
```

Client JS:

```js
import { ReactiveElement, signal } from "mastro/reactive"

customElements.define("simple-tabs", class extends ReactiveElement {
  activeTab = signal("home")

  switchTo (tab: string) {
    this.activeTab.set(tab)
  }

  isNotActiveTab (tab: string) {
    return tab !== this.activeTab()
  }
})
```

Note how we intentially didn't add the `hidden` class in the HTML sent from the server. That way, if client-side JavaScript fails to run, the user sees both tabs and can still access the content. Depending on the layout and position of the element on the page, this might mean that on slow connections, the user first sees both elements before one is hidden once JavaScript executed (try it out by enabling [network throttling](https://developer.mozilla.org/en-US/docs/Glossary/Network_throttling) in your browser's dev tools). If you think that's a bigger problem than sometimes inaccessible content, you can of course also add the `hidden` class already on the server.

### Initializing state from the server

As we've seen in the previous examples, the canonical version of state lives in the signals. Since signals are normal JavaScript objects (like e.g. Promises), they can be shared between components, even if the components are different islands and otherwise not connected.

Often, you need to initialize some state not with a simple static value (like `0` in the counter example), but with a dynamic value from the server (for example a user object, or an array of todo items from the database). If you embed the JavaScript dynamically on the HTML page anyway, then you can just include that data as a variable. If your JavaScript is in a static file however, there are a few different strategies.

Primitive values like strings are best put on attributes, like in the counter above:

```html
<my-counter start="7"></my-counter>
```

```js
class extends ReactiveElement {
  count = signal(parseInt(this.getAttribute("start") || "0", 10))
```

This works also for more complex values that are serializable as JSON:

```html
<my-profile user=${JSON.serialize(user)}></my-profile>
```

```js
class extends ReactiveElement {
  user = signal(JSON.parse(this.getAttribute("user")))
```

If you're server-rendering the data to HTML anyway, instead of duplicating the data in JSON, you can of course also parse the HTML. Depending on the structure of the data and the HTML serialization, this may of course be a bit more involved than the following simple example:

```html
<name-list>
  <ul>
    ${names.map(name => html`<li>${name}</li>`}
  </ul>
</name-list>
```

```js
class extends ReactiveElement {
  names = signal(Array.from(this.querySelectorAll('li')).map(el => el.innerText))
```

