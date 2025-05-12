---
title: A static blog from markdown files
template: splash
---

In the previous chapter, you set everything up to easily add multiple pages, and added a second page with the route `/news`.

Now it's time to add some news to that page. One of the simplest ways to create a blog is to create a markdown file for each blog post. Since the markdown files themselves are not part of the published website, we don't add them to the `routes/` folder. Instead, create a new folder called `data/` (this is just a convention), inside that another folder called `posts/`, and inside that the markdown file:

```md title=data/posts/2024-01-30-hello-world.md
---
title: Hello World
date: 2024-01-30
---

Markdown is just a simpler syntax for the most commonly used HTML
elements when writing text.

A blank line marks a new paragraph (HTML `<p>`), and a line starting with `##` is a HTML `<h2>`:

## Lists

For example unordered lists:

- item one
- item two

Or ordered lists:

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

To list all your blog posts, change `routes/news.server.js` to:

```js title=routes/news.server.js
import { html } from 'mastro/html.js';
import { readMarkdownFiles } from 'mastro/markdown.js';
import { htmlToResponse } from 'mastro/routes.js';
import { Layout } from '../components/Layout.js';

export const GET = async () => {
  const posts = await readMarkdownFiles('data/posts/*.md');
  return htmlToResponse(
    Layout({
      title: 'News',
      children: posts.map(post =>
        html`<p><a href=${post.path}>${post.meta.title}</a></p>`
      )
    })
  );
}
```

Note the use of the `readMarkdownFile` function that we imported from mastro. Because it needs to read the files from disk, it's an `async` function. That's why we need to `await` it, which in turn forces us to mark up our `GET` function as `async` as well.

Have a look at `/news` in the Mastro preview pane. Clicking one of the links will lead you to a page saying "404, page not found". That's because those pages don't exist yet. Create them by creating the file `routes/news/[slug].server.js`.

The `[slug]` is a parameter. When your server receives a request for `/news/2024-01-30-hello-world`, the request will be routed to the `news/[slug].server.js` page and the `context.params.slug` variable will hold the value `2024-01-30-hello-world`.

```js title=routey/news/[slug].server.js
import { html } from 'mastro/html.js';
import { readMarkdownFile } from 'mastro/markdown.js';
import { htmlToResponse } from 'mastro/routes.js';
import { Layout } from '../components/Layout.js';

export const GET = async (req, context) => {
  const post = await readMarkdownFile('data/posts/' + context.params.slug + '.md')
  return htmlToResponse(
    Layout({
      title: post.meta.title,
      children: post.body,
    })
  );
}
```

Test following the links in the Mastro preview pane now. Congratulations, you have a working blog!


## Generating parametrized pages

To pre-generate all your html files, run `deno task build`. It will tell you that it generated the `out/index.html` page, but that `routes/news/[slug].server.js` is missing a `staticParams` field. That's because mastro can't magically guess all the blog post urls that we want to generate.

To let it know, we import and use the `htmlRoute` function, which takes two arguments:

1. a configuration object (with the slugs to put into the paths to pre-generate), and
2. the function which we already had previously.

Change `routes/news/[slug].server.js` to:

```js title=routey/news/[slug].server.js
import { htmlRoute, readMdFile, readMdFiles } from 'mastro'
import { Layout } from '../components/Layout.js'

export const GET = htmlRoute(
  {
    staticParams:  await readMarkdownFile('data/posts/*.md').then(post => ({ slug: post.slug }))
  },
  async (req, params) => {
    const post = await readMarkdownFile('data/posts/' + params.slug + '.md')
    const { title } = post.data
    return (
      <Layout title={title}>
        <h1>{title}</h1>
        {post.body}
      </Layout>
    )
  }
)
```
