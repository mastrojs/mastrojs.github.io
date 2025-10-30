---
title: Mastro server-side compo­nents and routing
---

In this chapter, we'll be using a bit of server-side JavaScript to create a second page for your website.

Usually, you'll want all pages of the website to have the same header and footer. While you _could_ add the same `<header>` and `<footer>` tags in every file for every page, this approach becomes more tedious the more pages you add. And when you change the header or footer in one file, it's easy to forget to change all the other files. The solution is to move the header and footer to their own reusable _components_, and include those where you need them.

If you've been following the guide, you will already have a single `routes/index.html` file with `<header>`, `<main>` and `<footer>` elements, which we'll move to new locations. If not, you can simply create things as we go along. But make sure you've either:

- set up GitHub and VS Code in your browser, as described in the [beginning of this guide](/guide/setup/) (recommended if you're not familiar with the command line), or
- [started a new project](/guide/cli-install/#setup-local-development-server) on the command line.


## Components

1. If it doesn't exist yet, [create](/guide/html/#your-first-website) a new folder named `components` in the root of your project (i.e. not inside, but on the same level as the `routes` folder).

2. Move the `<header>` and its contents to a new file `components/Header.js` and wrap it in a bit of JavaScript:

```js title=components/Header.js
import { html } from "@mastrojs/mastro";

export const Header = () =>
  html`
    <header>
      <div>My awesome website</div>
    </header>
  `;
```

There are a few things going on here:

1. The first line imports the `html` variable from the `mastro` package.
2. The third line exports a variable with the name `Header`. You need to `export` variables, if you want to import and use them in other files.
3. A component in Mastro is just a function. However, its name is capitalized by convention (`Header` is the name of your component above).
4. The functions returns a string (everything between the two backticks). But not just any string: we're using the `html` tagged template (that we imported on the first line) to escape things properly.

Analogous to `Header.js`, create a second file:

```js title=components/Footer.js
import { html } from "@mastrojs/mastro";

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


## Routing and page handlers

Files in the `routes/` folder are sent out unmodified to your website's visitors – except for files ending in `.server.js` (and if you're using Mastro on the terminal, also `.server.ts` and `.client.ts` TypeScript files).

The `.server.js` files should contain JavaScript functions that handle the generation of the page in question – these functions are often called _page handlers_.

When a visitor requests a page of your website, the right file needs to be found. This process is known as _routing_. Once the route is found, the code in the handler is run, and the resulting page is sent to your website's visitor.

Different hosting providers and site generators often serve the same file under [slightly different urls](https://github.com/slorber/trailing-slash-guide/#trailing-slash-guide). In Mastro, the URL for a file does not end with a slash, while the URL for a folder does end with a slash. Since a folder itself cannot contain any code, an `index.html` or `index.server.js` file is used to represent the containing folder.

| File in `routes/`           | URL          |
|:----------------------------|:-------------|
| `file.html`                 | `/file.html` |
| `folder/index.html`         | `/folder/`   |
| `file.server.js`            | `/file`      |
| `folder/index.server.js`    | `/folder/`   |
| `folder/(folder).server.js` | `/folder/`   |

Since having lots of files called `index.server.js` would get confusing quickly, you can also name it `(folder).server.js`, where `folder` is the name of the containing folder.

Rename the `routes/index.html` file to `routes/index.server.js` (or create it if you don't have one yet) and make its contents:

```js title=routes/index.server.js ins={1-7,14,21,24-25}
import { html, htmlToResponse } from "@mastrojs/mastro";
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


## A Layout component

Now you're almost ready to create that second page. Just one more thing to move to its own component file, because we want to reuse it: the skeleton of the page, often called `Layout`. Create a new file:

```js title=components/Layout.js
import { html } from "@mastrojs/mastro";
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
import { html, htmlToResponse } from "@mastrojs/mastro";
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

Now finally all that work pays off: add that second page by creating a new file in a new folder:

```js title=routes/news/index.server.js
import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../../components/Layout.js";

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

Note the `../../` when importing the `Layout` component, while previously it was just `../`. That's because this file is in the `news/` folder, so you need to go one level further up than before to get to the `components/` folder.

To test whether that page works, enter `/news/` in the address bar of the Mastro preview pane and hit enter. Whenever you change anything in `components/Layout.js`, both pages will be updated!

If you haven't set up GitHub Pages for your repo yet, follow [publish your website](/guide/publish-website/). Either way, don't forget to regenerate the site by clicking the **Generate** button in the Mastro preview pane, then [save and publish your changes in the _Source Control_ tab](/guide/publish-website/#save-changes-and-publish-to-the-web).
