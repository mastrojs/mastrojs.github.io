---
title: Introducing JavaScript
---

Now that you got a taste of HTML and CSS, let's talk about JavaScript. It's the third language that the browser understands. One of the easiest ways to get your feet wet with JavaScript, is in your browser's console.

Open your [browser's developer tools](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools#how_to_open_the_devtools_in_your_browser) again. (Ideally on your published web page, but anywhere will do). But this time, switch to the tab named **Console**.

![](https://developer.chrome.com/static/docs/devtools/console/javascript/image/the-console-99991743a015_2880.png)

This is an interactive JavaScript console, which means that you can type in JavaScript, hit `enter`, and it will calculate the result. Try adding two numbers by typing:

```js title=Console
1 + 2
```

After hitting `enter`, a new line will be shown with the result: `3`.

A piece of text, that a program works with, is called a _string_. In JavaScript, strings are usually wrapped in either single quotes or double quotes. Type:

```js title=Console
'1' + "2 cats"
```

and hit `enter`. It returns `"12 cats"` (this time with quotes). That's because when working on strings (as opposed to numbers), the `+` operator concatenates them together.

If you want your program to remember something for later, assign it to a variable. Create the variable `myName` and assign it the string `"Peter"` by typing:

```js title=Console
const myName = "Peter";
```

The semicolon at the end is customary to mark the end of a statement. Statements (as opposed to expressions) will not directly give a result – that's why it prints a line saying `undefined`.

A third way to write a string is to wrap it in backticks. This allows you to put variables (and other expressions) in it using `${ }`:

```js title=Console
`I am ${myName} and ${3 * 10} years old`
```

## Functions

If you want to execute the same kind of computation multiple times, you need a function. One way to write a function that returns the string `"Hello World"`, and assign that function to the variable `hello` is:

```js title=Console
const hello = () => "Hello World";
```

Again, assignments always return `undefined`. But now you can call the function:

```js title=Console
hello()
```

which will return the string `"Hello World"`.

To make it a bit more useful, we can write a new function that takes an argument, which you can name as you wish. Let's call our argument `name`:

```js title=Console
const helloName = (name) => `Hello ${name}`;
```

You can call it like:

```js title=Console
helloName("Peter")
```


## Objects and arrays

Finally, let's give you a sneak peak on JavaScript objects (which hold key-value pairs):

```js title=Console
const person = { firstName: "Arthur", lastName: "Dent", age: 42 };
`${person.firstName} ${person.lastName} is ${person.age} years old.`
```

And arrays, which act like lists:

```js title=Console
const shoppingList = ["bread", "milk", "butter"];
const rememberFn = (item) => `Remember the ${item}!`;
shoppingList.map(rememberFn)
```

`.map()` calls the method `map` on the `shoppingList`. A method is a function attached to an object. All arrays come with a `map` method. When you call it, you need to give it a special kind of argument: a function.

Feel free to toy around a bit more in the JavaScript console. You can always reload the page to reset everything, meaning you'll lose all your variables.


## The power of programming

The good news is that with JavaScript – like with any general-purpose programming language – you can create arbitrarily complex programs. That's also the bad news. Either way, this crash course should be enough for you to read and write some basic JavaScript.

:::tip
## Want to learn more JavaScript?

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) also has good documentation on JavaScript. But especially if you're new to programming in general, I can highly recommend the book [Eloquent JavaScript](https://eloquentjavascript.net/), which is free to read online.
:::
