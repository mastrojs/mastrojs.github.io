
---
title: Interactivity with JavaScript in the browser
template: splash
---

In previous chapters, you've seen how to use JavaScript on the server to dynamically generate multiple pages of HTML. For most simple websites, that's all you need. If you want it to look fancy, invest in learning more about design and CSS.

However, sometimes you want to add more interactivity. If you have a server running, you can get quite far with HTML forms (which we'll look at in the next chapter), and then sending different HTML to a user depending on what they submitted, or depending on what's currently in the database of the server.

But that's not an option for a statically generated website. And for certain sorts of interactions, you don't want it to go through a page navigation (e.g. submitting a form and having the browser load the result page). Instead, you want the change to be immediate, and affect the page you're currently on without reloading it, to keep your scroll and cursor positions etc. That's when you need to use client-side JavaScript – i.e. JavaScript running in the user's browser. (See [Client-side and server-side JavaScript](/guide/javascript/#client-side-and-server-side-javascript) in the chapter introducing JavaScript.) A common example is to build a simple to-do list app.


## A minimalistic to-do list app

 If you want to reuse the `Layout` component like in previous chapters, create a new route (e.g. `routes/todo-list.server.js`). Or alternatively create a new HTML file:

```html title=routes/todo-list.html
<!doctype html>
<title>My To-Do list</title>

<form>
  <input placeholder="Enter new to-do here">
  <button>+</button>
</form>

<ul id="todos">
</ul>

<style>
  body {
    font-family: sans-serif;
  }
</style>

<script type="module">
  const input = document.querySelector("form > input");
  const todos = document.querySelector("#todos");
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const li = document.createElement("li");
    li.innerHTML = '<input type="checkbox"> ';
    li.append(input.value);
    todos.prepend(li);
    input.value = "";
  });
</script>
```

Check out the minimalistic to-do list in the Mastro preview pane by navigating to `/todo-list` and add a few to-dos.

In HTML5, the `head` and `body` tags can be omitted and will be created by the browser. Check it out in the elements inspector in your browser's dev tools!

If you have relatively little CSS and JavaScript, you can put them directly in the HTML, like above. Otherwise it might make more sense to put them in a separate file and load them with:

```html
<link rel="stylesheet" href="/styles.css">
<script type="module" src="/script.js"></script>
```

The HTML elements on the page are made availlable to JavaScript as the DOM (document object model). For example, the `document.querySelector` method returns the first element that matches the specified CSS selector. Above, we use `document.querySelector("#todos")` to select the element with `id="todos"`. You can try writing that in the JavaScript console of your browser's dev tools and see what it returns. Using an `id` is a common technique to mark up an element on a page for JavaScript to find. Be aware however that there can be only one element on a page with any given `id`. If you want to mark up multiple elements, you should use `class="myClass` and look for them with `document.querySelectorAll(.myClass)`, which returns a list of all matched elements.

Next we pass a callback function to the `addEventListener` method. Our function gets called when the form is submitted – i.e. when the user enters some text and hits enter or clicks a button inside the form. Our function gets passed an `event` object, which we use to prevent the default action of a form submission – i.e. we prevent that the form is submitted to a server and the browser navigates away.

Instead, we handle it in the client by creating a new list item element `li` and set its HTML contents to a checkbox using `innerHTML`. The `append()` method adds another element or some text at the end of an element. In our case, we append the `input` element's text value to the list item we already have.

Be aware to never use `innerHTML` on untrusted input. You can try changing the code to just `li.innerHTML = '<input type="checkbox"> ' + input.value;` and then enter some HTML text into the text field of our app as a user. It's inserted as HTML, breaking our page! Definitely not what we want. On the other hand, `append()` escapes the string properly.

Then, using `prepend()`, we add our list item to the top of the `<ul id="todos">` element. And finally, we reset the `input`'s value to an empty string (`""`), so it's ready for the next to-do.

Feel free to change the code or put a few `console.log()` statements in it to see what does what.


## Accessible interactivity

Technically, you can attach event listeners to all kinds of HTML elements. But in order for screen readers, or keyboard-only users etc, to discover interactive elements, it's important to use elements like `<button>`, `<input>` or `<form>`. Don't make divs or spans interactive! And don't create links without an `href`: if you don't want a link click to trigger a page navigation, you most certainly should use a `<button>` instead. You can always use CSS to make your `<button class="link">` look like a link.

Using meaningful HTML elements – a practice known as writing _semantic HTML_ – is enough to make simple websites accessible. But more complicated, interactive, parts of a web page may require additional annotations to ensure screen readers understand what's going on. That's what ARIA attributes are for. I can highly recommend reading [What I Wish Someone Told Me When I Was Getting Into ARIA](https://www.smashingmagazine.com/2025/06/what-i-wish-someone-told-me-aria/).


## Filtering the to-do list

Now, let's add a dropdown where you can choose to either show all to-dos (like currently), or only those that are not checked.

This can be accomplished in two ways. First the easy way: we add an event listener that gets called when the user changes the dropdown (aka `select` element). Depending on the value of `select.value`, we add or remove the `only-undone` class on the `ul`. Finally, if the `only-undone` class is there, we hide (i.e. `display: none;`) every `li` element that [`has`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) an `input` that's `:checked`.

```html title=routes/todo-list.html ins={5-10, 23-25, 31-40}
<!doctype html>
<title>My To-Do list</title>

<form id="form">
  <p>
    <select>
      <option value="all">All to-dos</option>
      <option value="undone">Only undone to-dos</option>
    </select>
  </p>

  <input placeholder="Add to-do here">
  <button>+</button>
</form>

<ul id="todos">
</ul>

<style>
  body {
    font-family: sans-serif;
  }
  .only-undone > li:has(input:checked) {
    display: none;
  }
</style>

<script type="module">
  const input = document.querySelector("form > input");
  const todos = document.querySelector("#todos");
  const select = document.querySelector("select");

  select.addEventListener("change", () => {
    if (select.value === "undone") {
      todos.classList.add("only-undone");
    } else {
      todos.classList.remove("only-undone");
    }
  })

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const li = document.createElement("li");
    li.innerHTML = '<input type="checkbox"> ';
    li.append(input.value);
    todos.prepend(li);
    input.value = "";
  });
</script>
```

Check it out in your browser's dev tools elements inspector. Notice how the elements with `display: none;` are greyed out, but still there in the DOM tree?


## State

That brings us to the second approach to filtering the to-do list: we could instead remove the elements from the DOM that we currently don't want to show. But then how do we get them back if the user switches the dropdown back to "All to-dos"? We would need to store them in a JavaScript variable, perhaps as an array.

But now we have two places where we store our to-dos: in the DOM, and in the JavaScript variable. This may not sound so bad at first, but developers all over the world have learned the hard way that this is a recipe for pain and bugs. To make sure the two are always in sync, whenever we add, remove, or change a to-do, we would need to remember to do so in two places. Add a few more mutable elements to the app, and you have an expontentially rising number of states to consider.

Information of previous user interactions or events, that still hangs around, is known as the _state_ of the program. It's the source of countless bugs, and the reason why turning a machine off and on again, thereby resetting its state, fixes more problems that we'd like to believe. When programming an interactive app, state is unavoidable. A user changes a dropdown – the state of the program is changed. However, what we can choose, is how we model our state. And duplicating it (e.g. once in the DOM and once in a JavaScript variable), is generally a bad idea.


## Reactive programming

The solution to this problem that React.js popularized is that you separate the state out from the rest of the program in a special kind of variable. You then write a so-called `render` function that takes the state as input, and returns what the HTML/DOM should look like. When a user changes a dropdown (or another event happens), you do _not_ update the DOM directly. Instead, you update the state. And on each state change, the framework automatically reruns your render function and updates the DOM. That way, the state and DOM are guaranteed to always be in sync. For a longer introduction to this approach of state management, see for example [Solid's docs](https://docs.solidjs.com/guides/state-management) (a more modern alternative to React).

Mastro comes with its own minimal take on a client-side rendering library: [Reactive Mastro](https://github.com/mastrojs/mastro/tree/main/src/reactive). Like many other reactive libraries (but unlike React), it uses _signals_ to hold state.

To avoid having to add ids or classes, and then look for the elements with `querySelector`, we use [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) – a part of the [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) suite of technologies built into browsers.

The initial to-do list app from above, rewritten with Reactive Mastro looks as follows:

```html title=routes/todo-list.html
<!doctype html>
<title>My To-Do list</title>
<script type="importmap">
  {
    "imports": {
      "mastro/reactive": "https://esm.sh/jsr/@mastrojs/mastro@0.0.3/reactive?bundle"
    }
  }
</script>

<todo-list>
  <form data-onsubmit="addTodo">
    <input
      placeholder="Enter new to-do here"
      data-bind="value=newTitle"
      data-oninput="updateNewTitle"
      >
    <button>+</button>
  </form>
  <ul data-bind="renderedTodos">
  </ul>
</todo-list>

<script type="module">
  import { computed, html, ReactiveElement, signal } from "mastro/reactive";

  customElements.define("todo-list", class extends ReactiveElement {
    newTitle = signal("");
    todos = signal([]);

    renderedTodos = computed(() =>
      this.todos().map((todo, i) => html`
        <li>
          <input
            type="checkbox"
            ${todo.done ? "checked" : ""}
            data-onchange='toggleTodo(${i})'
            >
          ${todo.title}
        </li>
      `)
    );

    toggleTodo (i, e) {
      const todos = [...this.todos()];
      todos[i].done = e.target.checked;
      this.todos.set(todos);
    }

    updateNewTitle (e) {
      this.newTitle.set(e.target.value);
    }

    addTodo (e) {
      e.preventDefault();
      if (this.newTitle()) {
        this.todos.set([
          { title: this.newTitle(), done: false },
          ...this.todos(),
        ]);
        this.newTitle.set("");
      }
    }
  });
</script>
```

At first, this looks more complex. And for simple cases that's true. There, you might be better off just using plain JavaScript without any library – especially when coupled with a few nifty lines of CSS. But as your app grows, the initial increase in complexity is quickly outweighed by the structure this approach brings; using signals to store the single source of truth, and allowing you to not repeatedly write `document.createElement()`, `.append()`, `.addEventListener()`, etc.

The first thing you might notice is the `<script type="importmap">`. That [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) allows you to write `import { ... } from "mastro/reactive"` in your JavaScript modules instead of the full URL. And when it's time to update the URL (perhaps because you want to update to a new version of the library), you just need to do so in one place.

`customElements.define('todo-list', myClass)` registers the `<todo-list>` custom HTML element (the name must start with a lowercase letter and must contain a hyphen), which allows you to use it with `<todo-list></todo-list>` wherever in your HTML.

The `customElements.define` method requires us to supply it with a [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). This is a common concept in _object-oriented programming_, a programming paradigm usually contrasted with _functional programming_ (which we've been losely adhering to in this guide so far). However, you don't need to understand its intricacies to use Reactive Mastro. Just note that the `newTitle`, `todos` and `renderedTodos` variables are declared at the top of the class, and without `const`. That's because they are _fields_ of the class, and accessible with e.g. `this.newTitle` within methods of the class. `toggleTodo`, `updateNewTitle`, and `addTodo` are methods of the class. Methods are functions that are attached to an object or class.

Our fields are all signals. A signal `todos` is read out with `todos()` (a function call), and changed with `todos.set(newArray)`. The `...array` [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) creates a new array, which is necessary for the signal to be updated. We initialize the `newTitle`, which represents what's currently in the text `input`, with an empty string. The `todos` is initialized with an empty array. And `renderedTodos` is set to a `computed` value, which always reacts to changes to any of the signals used within it (like `this.todos()`), returning an array of `html` strings – one for each todo.

Finally, our class `extends` the `ReactiveElement` class, which we imported from `mastro/reactive`. This allows us to

- use the `data-bind` attribute in our HTML to bind fields to the DOM elements, so that they are automatically updated whenever the signal changes, and
- use `data-on*` attributes (e.g. `data-onsubmit`) to cause our methods to be called on events (this also uses `addEventListener`s behind the scenes).


## Filtering the to-do list reactively

Once you've gotten familiar with the way Reactive Mastro works, adding the dropdown to filter out the done to-dos, and remove them fron the DOM, is pretty straightforward:

```html title=routes/todo-list.html ins={13-18,35,40-42,64-67} del={39}
<!doctype html>
<title>My To-Do list</title>
<script type="importmap">
  {
    "imports": {
      "mastro/reactive": "https://esm.sh/mastro@0.0.6/reactive?bundle"
    }
  }
</script>

<todo-list>
  <form data-onsubmit="addTodo">
    <p>
      <select data-onchange="updateDropdown" autocomplete="off">
        <option value="all">All to-dos</option>
        <option value="undone">Only undone to-dos</option>
      </select>
    </p>
    <input
      placeholder="Enter new to-do here"
      data-bind="value=newTitle"
      data-oninput="updateNewTitle"
      >
    <button>+</button>
  </form>
  <ul data-bind="renderedTodos">
  </ul>
</todo-list>

<script type="module">
  import { computed, html, ReactiveElement, signal } from "mastro/reactive";

  customElements.define("todo-list", class extends ReactiveElement {
    newTitle = signal("");
    dropdown = signal("all");
    todos = signal([]);

    renderedTodos = computed(() =>
      this.todos().map((todo, i) => html`
      this.todos()
        .filter((todo) => this.dropdown() === "all" || !todo.done)
        .map((todo, i) => html`
        <li>
          <input
            type="checkbox"
            ${todo.done ? "checked" : ""}
            data-onchange='toggleTodo(${i})'
            >
          ${todo.title}
        </li>
      `)
    );

    toggleTodo (i, e) {
      const todos = [...this.todos()];
      todos[i].done = e.target.checked;
      this.todos.set(todos);
    }

    updateNewTitle (e) {
      this.newTitle.set(e.target.value);
    }

    updateDropdown (e) {
      this.dropdown.set(e.target.value);
    }

    addTodo (e) {
      e.preventDefault();
      if (this.newTitle()) {
        this.todos.set([
          { title: this.newTitle(), done: false },
          ...this.todos(),
        ]);
        this.newTitle.set("");
      }
    }
  });
</script>
```


## Saving the to-do list

There is still a major flaw in the to-do list app. When the user reloads the page, all the to-dos are gone! We need to save them somewhere.

The most durable place would probably be a server with a database, but that would require us to run those, and the user to create an account and log in. The next best thing is to store the to-dos in the user's browser using [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#examples). To do that, replace the `todos` signal with a newly defined `localSignal`. Change the start of the `script` element as follows:

```js ins={3-16, 21} del={20}
  import { computed, html, ReactiveElement, signal } from "mastro/reactive";

  const localSignal = (initialVal, key) => {
    try {
      initialVal = JSON.parse(localStorage[key])
    } catch {
    }
    const s = signal(initialVal)
    const local = () => s()
    local.set = (newVal) => {
      s.set(newVal)
      localStorage[key] = JSON.stringify(newVal)
    }
    return local
  }

  customElements.define("todo-list", class extends ReactiveElement {
    newTitle = signal("");
    dropdown = signal("all");
    todos = signal([]);
    todos = localSignal([]);
```

This is the final chapter of the Mastro Guide to static site generation. However, you can continue with the [Reactive Mastro docs](/reactive/), or continue to the addendum about servers, URLs, HTTP, HTML forms, and REST APIs.
