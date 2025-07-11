
---
title: Generate multiple pages with shared components
---

Now that you know the basics of JavaScript, let's create a second page for the website you created in the [chapter about HTML](/guide/html/). You use a bit of server-side JavaScript to create shared components, which contain the HTML that's the same for both pages.


## A second page

So far your website still consists of only a single page, and only two files: `routes/index.html` and `routes/styles.css`. Add a second page by creating a new file: `routes/news.html`. You _could_ add the same `<header>` and `<footer>` tags all over again in this second file. But the more pages you add, the more tedious this approach becomes. And when you modify the header or footer in one file, it's easy to forget changing all other files. The solution is to move the header and footer to their own reusable _components_.

### Server-side components

1. [Create a new folder](/guide/html/#your-first-website) `components` in the root of your project (i.e. not inside, but on the same level as the `routes` folder).

2. Move the `<header>` and its contents to a new file `components/Header.js` and wrap it in a bit of JavaScript:

```js title=components/Header.js
import { html } from "mastro";

export const Header = () =>
  html`
    <header>
      <div>My awesome website</div>
    </header>
  `;
```

There are a few things going on here:

1. The first line imports the `html` variable from the `mastro` package.
2. The next part assigns a new function to the variable `Hello` and exports it. You need to `export` variables, if you want to use them in other files.
3. A component in Mastro is just a function. However, its name is capitalized by convention (`Header` is the name of your component above).
4. The functions returns a string (everything between the two backticks). But not just any string. We're using the `html` tagged template (that we imported on the first line) to escape things properly.

Analogous to `Header.js`, create a second file:

```js title=components/Footer.js
import { html } from "mastro";

export const Footer = () =>
  html`
    <footer>
      <div>
        Check us out
        <a href="https://github.com/mastrojs/mastro">on GitHub</a>.
        © ${new Date().getFullYear()}
      <div>
    </footer>
  `;
```

Notice the use of the `${ }` syntax inside the template literal to place the result of arbitrary JavaScript expressions right there.

Now, to `import` the two functions we just created, you first need to convert the home page from a HTML file to a JavaScript file.

### JavaScript page handlers

All files in the `routes/` folder are sent out unmodified to your website's visitors – except for JavaScript files ending in `.server.js` or `.server.ts`. The code in these files is run and the result is sent to your website's visitors.

Rename the `routes/index.html` file to `routes/index.server.js` and change its contents to:

```js title=routes/index.server.js ins={1-7,14,21,24-25}
import { html, htmlToResponse } from "mastro";
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

export const GET = () =>
  htmlToResponse(
    html`
      <html>
        <head>
          <title>My website</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          ${Header()}

          <main>
            <h1>What is Structured content?</h1>
            ...
          </main>

          ${Footer()}
        </body>
      </html>
    `
  );
```

First, we import two functions from Mastro, and the two components you just wrote.

Then we create a new function called `GET`, and `export` it. While you can call components whatever you want, the function you `export` from a `routes/*.server.js` file needs to be named `GET`. Otherwise it's not called when your server receives a HTTP `GET` request from the browser for that page.

All the above `GET` function does is to call the `htmlToResponse` function with one very long argument: the `html` tagged template string with all your HTML: notice the opening backtick in the beginning, and the closing backtick on the second last line? The `htmlToResponse` turns your HTML string into a JavaScript `Response` object, which represents an HTTP response. When the browser makes an HTTP request to your web server (or GitHub Pages in this case), the server replies with that HTTP response.

Finally, `Header()` calls the `Header` function, and the result of that is placed with the `${ }` syntax.

Load the page in the Mastro preview to see whether it still works!


### A Layout component

Now you're almost ready to create that second page. Just one more thing to move to its own component file, because we want to reuse it: the skeleton of the page, often called `Layout`. Create a new file:

```js title=components/Layout.js
import { html } from "mastro";
import { Header } from "./Header.js";
import { Footer } from "./Footer.js";

export const Layout = (props) =>
  html`
    <html>
      <head>
        <title>${props.title}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        ${Header()}

        <main>
          ${props.children}
        </main>

        ${Footer()}
      </body>
    </html>
  `;
```

The above component is still just a function, but a function that takes one argument: the `props` object (short for properties).

Now you can reduce your `routes/index.server.js` file to:

```js title=routes/index.server.js
import { html, htmlToResponse } from "mastro";
import { Layout } from "../components/Layout.js";

export const GET = () =>
  htmlToResponse(
    Layout({
      title: 'Home',
      children: html`
        <h1>What is Structured content?</h1>
        ...
        `
    })
  );
```

Note how we pass an object of the form `{ title, children }` as an argument to the `Layout` function when calling it. That's the `props` object.

Now finally all that work pays off: add that second page by creating a new file:

```js title=routes/news.server.js
import { html, htmlToResponse } from "mastro";
import { Layout } from "../components/Layout.js";

export const GET = () =>
  htmlToResponse(
    Layout({
      title: 'News',
      children: html`
        <p>Once we have news, we'll let you know here.</p>
        `
    })
  );
```

To test whether that page works, enter `/news/` in the address bar of the Mastro preview pane and hit enter. Whenever you change anything in `components/Layout.js`, both pages will be updated!

If you haven't set up GitHub Pages for your repo yet, follow [publish your website](/guide/html/#publish-your-website). Either way, don't forget to regenerate the site by clicking the **Generate** button in the Mastro preview pane, then [save and publish your changes in the _Source Control_ tab](/guide/html/#save-changes-and-publish-to-the-web).
