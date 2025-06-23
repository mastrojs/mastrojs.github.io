---
title: Reactive Mastro reference
template: splash
---

Reactive Mastro requires you to learn only two attributes: `data-bind` and `data-on*`.

### `data-bind`

Creates a reactive binding of a signal (or the result of a method call) to a property of the DOM element which you specify the attribute on. The following syntax variations are supported.

#### Set contents (innerHTML)
```html
<div data-bind="myField"></div>
```
This binds the `myField` signal to the contents of the div. Normal strings will be properly escaped. To construct an HTML string, use Reactive Mastro's `html` tagged template literal (e.g. ``myField = html`<strong>my text</strong>` ``).

#### Set a property
```html
<input data-bind="value=myField">
or nested properties:
<div data-bind="style.display=myField"></div>
```
This sets arbitrary [JavaScript properties, not attributes](https://stackoverflow.com/a/6004028/214446) on an element.

#### Toggle a class
```html
<div data-bind="class.myCssClass=myField"></div>
```
This toggles the specified class depending on whether `myField` is truthy or not, leaving other classes on the element untouched.

#### Pass a static attribute to a custom element
```html
<user-info name="Peter"></user-info>
```

#### Pass a signal to a custom element
```html
<user-info data-bind="props.name=myField"></user-info>
```
This uses the `props.` syntax, which is specific to Reactive Mastro. Because the `user-info` component shouldn't have to care whether the `name` passed is a static string or a signal, both will be automatically assigned as a signal to a field of the nested component, and be uniformly accessible as such (e.g. `this.name()` or `data-bind="name"`).

#### Using a helper method
```html
<div data-bind="class.hidden=isNotActiveTab('profile')"></div>
```
On the right-hand side of the equal sign, you can call a method of your class. See the tab example above. Arguments are separated by comma, and currently the following types are accepted as arguments: single-quoted strings, booleans `true` and `false`, and numbers.

#### Multiple bindings
```html
<div data-bind="myContent; style.color=myColor"></div>
```
To bind multiple things on the same element, `data-bind` accepts a semicolon-separated list of bindings.

#### Binding without introducing an extra element

If you want to avoid introducing an extra box in the layout (e.g. when using things like CSS grid or flexbox), you can use the HTML [`slot`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) element: e.g. `<slot data-bind="mySignal"></slot>`. It's still an extra element, but CSS behaves like it isn't there.

### `data-on*`

There are only two variations:

```html
<button data-onclick="addTodo">+</button>
```
which calls the `addTodo` method on your class on click, and

```html
<button data-onclick="removeTodo(7)">+</button>
```
which calls the `removeTodo` method on your class, with `7` as the first argument. The same types are supported as arguments as in `data-bind` [method calls](#using-a-helper-method).

In both cases, the actual native [event](https://developer.mozilla.org/en-US/docs/Web/API/Event) is also supplied as an additional last argument.

#### Adding event listeners for less common events

To support events on HTML elements that are added to the DOM after custom element creation (e.g. as the result of a user interaction), Reactive Mastro adds one listener for the event names `click`, `change`, `input` and `submit` to the custom element and lets the event bubble up there. However, you can customize that list:

```js
customElements.define("my-counter", class extends ReactiveElement {
  constructor () {
    this.#eventNames.push("focus", "blur")
    super()
  }
})
```
