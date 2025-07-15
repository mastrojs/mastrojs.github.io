---
title: A static blog from markdown files
---

In the [previous chapter](/guide/server-side-components/), you set everything up to easily add multiple pages to your website, and added a second page with the route `/news/`. Now it's time to add some news to that page.

One of the simplest ways to create a blog is to create a markdown file for each blog post. [Markdown](https://commonmark.org/help/) is just a simpler syntax for the most commonly used HTML elements when writing body text. It's fairly widespread nowadays, used in plain text note-taking apps, or to input text into GitHub or StackOverflow.

Since the markdown files themselves should not be published as part of the website, don't add them to the `routes/` folder. Instead, create a new folder called `data/` (this is just a convention). Inside that, add another folder called `posts/`, and inside that the markdown file:

```md title=data/posts/2024-01-30-hello-world.md
---
title: Hello World
date: 2024-01-30
---

Markdown is just a simpler syntax for the most commonly used HTML
elements when writing body text.

A blank line marks a new paragraph (HTML `<p>`),
and a line starting with `##` is a HTML `<h2>`:

## Lists

An example of an unordered list:

- item one
- item two

And an ordered list:

1. item one
2. item two


## More info

For more information about Markdown, see [CommonMark](https://commonmark.org).
```

Now create a second blog post:

```md title=data/posts/2024-01-31-second-post.md
---
title: Second Post
date: 2024-01-31
---

This is our second blog post.
```

## The index page

Instead of changing our `routes/news.server.js` file in-place, first move it to a new folder `routes/news/` and rename it to `index.server.js`. This doesn't change anything, but we'll need the folder later for the detail pages anyway.

To make the page list all your blog posts, change it to:

```js title=routes/news/index.server.js
import { html, htmlToResponse, readMarkdownFiles } from "mastro";
import { Layout } from "../../components/Layout.js";

export const GET = async () => {
  const posts = await readMarkdownFiles("data/posts/*.md");
  return htmlToResponse(
    Layout({
      title: "News",
      children: posts.map((post) =>
        html`
          <p>
            <a href="${"/news" + post.path.slice(11, -3)}/">
              ${post.meta.title}
            </a>
          </p>
        `
      ),
    }),
  );
};
```

Note the `../../` when importing the `Layout` component, while previously it was just `../`. That's because this file is in the `news/` folder, so you need to go one level further up than before to get to the `components/` folder.

The code imports the `readMarkdownFiles` function from mastro. Because that function requests the files from the computer's harddisk (which might take some time), we need to `await` it. This in turn forces us to mark up our `GET` function as `async` (short for [asynchronous](https://eloquentjavascript.net/11_async.html)).

Since `posts` is an array, we can use its `.map()` method to loop over it and get each `post`. `post.path.slice(11, -3)` [slices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) off the first eleven and the last three character from the `post.path` string: in our case it removes the leading `/data/posts` and the trailing `.md` from the filename.

Have a look at `/news/` in the Mastro preview pane. Clicking one of the links will lead you to a page saying "404, page not found". That's because those pages don't exist yet.


## Detail pages

Now to the page that shows an individual blog post – often called a detail page. (Having an _index page_ linking to _detail pages_ is a very common pattern on websites: whether it's a blog, a newspaper or newsfeed, or a shop.)

Create the detail pages for the individual blog posts by creating the file `routes/news/[slug].server.js`.

The `[slug]` is a parameter. When your server receives an HTTP request for `/news/2024-01-30-hello-world`, the request will be routed to the `routes/news/[slug].server.js` file. A collection of URLs that are handled the same way are called a route. In Mastro, placing a file in the `routes/` folder creates a route. Finally, you could have named it whatever you want, but `slug` is a common name for the part of a URL that identifies a specific page.

To read out the `slug` parameter, we use the `req` object (a standard JavaScript [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object) that our `GET` function receives, read out the URL as a string with `req.url`, and pass that to the `getParams` helper function, which returns an object with all parameters.

```js title=routes/news/[slug].server.js
import { getParams, htmlToResponse, readMarkdownFile } from "mastro";
import { Layout } from "../../components/Layout.js";

export const GET = async (req) => {
  const { slug } = getParams(req.url);
  const post = await readMarkdownFile(`data/posts/${slug}.md`);
  return htmlToResponse(
    Layout({
      title: post.meta.title,
      children: post.content,
    })
  );
}
```

To extract the `slug` parameter, we used [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring). Equivalently, we could also have written:

```js
const slug = getParams(req.url).slug;
```

To read the markdown file from disk and convert the markdown to HTML, we use the `readMarkdownFile` function (which is an `async` function and therefore we need to `await` it).

Test following the links in the Mastro preview pane now. Congratulations, you have a working blog!

## Debugging with `console.log`

Usually when programming, thinks go wrong at some point. It's fairly uncommon for a programmer to write out a program and get exactly what they wanted the first time they run it. Perhaps you get a syntax error and the program doesn't even start running. Or perhaps the JavaScript syntax was correct, but the program crashes later on, or at least doesn't do what you wanted it to. In this second case, it can be useful to add `console.log()` statements in various places of your code and see what it prints into your browser's JavaScript console (what you used in a [previous chapter](/guide/javascript/#getting-your-feet-wet-with-javascript)). Give it a try:

```js title=routes/news/[slug].server.js ins={6}
import { getParams, htmlToResponse, readMarkdownFile } from "mastro";
import { Layout } from "../../components/Layout.js";

export const GET = async (req) => {
  const { slug } = getParams(req.url);
  console.log('the slug variable holds the value', slug)
  const post = await readMarkdownFile(`data/posts/${slug}.md`);
  return htmlToResponse(
    Layout({
      title: post.meta.title,
      children: post.content,
    })
  );
}
```

After opening your browser's JavaScript console and clearing what's already printed out there with the button labelled `🚫`, open the page in the Mastro preview pane.


## Generating pages with route parameters

Try generating all your HTML files: click the **Generate** button in the top-right corner of the Mastro preview pane.

It will generate the pages without parameters. But notice the error telling you that "/routes/news/[slug].server.js should export a function named getStaticPaths".

That's because Mastro cannot guess the paths for all the pages that we want to generate. In the preview (or on a running server) this works because the information is provided directly in the URL. But if we want to statically generate all the pages ahead of time, we need to tell Astro the paths of all our pages with route parameters. We do that by exporting a function called `getStaticPaths`, that returns an array of strings when called.

```js title=routes/news/[slug].server.js ins={1,15-18}
import { getParams, htmlToResponse, readDir, readMarkdownFile } from "mastro";
import { Layout } from '../../components/Layout.js';

export const GET = async (req) => {
  const { slug } = getParams(req.url);
  const post = await readMarkdownFile(`data/posts/${slug}.md`);
  return htmlToResponse(
    Layout({
      title: post.meta.title,
      children: post.content,
    })
  );
}

export const getStaticPaths = async () => {
  const posts = await readDir("data/posts/");
  return posts.map(p => "/news/" + p.slice(0, -3) + "/");
}
```

For accessing the file system, `mastro` exports a few functions that work both in the VSCode environment, and when using Deno: `readDir`, `findFiles`, `readTextFile`, `readMarkdownFile`, and `readMarkdownFiles` (see [Mastro's API docs](https://jsr.io/@mastrojs/mastro/doc)).

Now click **Generate** again. Then don't forget to [save your changes in the _Source Control_ tab](/guide/publish-website/#save-changes-and-publish-to-the-web).

Congratulations to your live blog!

:::tip[How can others write content?]
You may want other people, that don’t know HTML, to contribute content to your website. For a static site, you have basically three options:

- If they’re comfortable with markdown, they can edit the `.md` files directly on GitHub with its built-in [text editor](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files), that has also a basic markdown preview.
- If they prefer a more traditional, but still basic [CMS](https://en.wikipedia.org/wiki/Content_management_system), you can add a Git-based CMS like [Decap CMS](https://decapcms.org/) to your site, which lets them edit the `.md` files with a [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editor.
- Finally, instead of storing your website’s content as markdown files directly in the repository together with your code, you can use a fully-fledged headless CMS like [Strapi](https://strapi.io/) or [Sanity](https://www.sanity.io/). You then need to change your code to fetch the content from the CMS API instead of from the `.md` files.
:::
