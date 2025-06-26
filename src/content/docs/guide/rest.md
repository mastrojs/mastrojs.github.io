---
title: Rest
template: splash
---

## Images

Now that you have your basic blog up and running on a live website, let's add some images.

Put the original image file, with as high resolution as possible, in `data/posts/2024-01-31-second-post-image-1.jpg`. Then add the following script to `scripts/images.js`, which will convert all your blog images to compressed, lower-resolution versions, so that your website loads quickly:

```js
import { transformImgFiles } from 'mastro'

await transformImgFiles('data/posts/*', 'routes/posts/*', { width: 1000 })
```

This will transform and resize all image files from the `posts/` folder to be 1000px wide, and write the output files to `routes/posts/`.

To make sure this also happens when you publish your static site, change the `build` script in `package.json` to:

    deno task mastro:run:images && deno task build

TODO:
- during development: should we watch the folder? run it on startup?
- alternatively: should the interface be a [transform](https://www.11ty.dev/docs/transforms/) instead of a script? then we could run it also [on-request in dev mode](https://www.11ty.dev/docs/plugins/image/#optimize-images-on-request).



Design space:
- where to place original image: `routes/myImage.server.jpg` or `data/myImage.jpg`
- url of transformed image: `myImage.width=300.webp`
- how `<img` HTML is created:
  - by post-processing generated HTML: e.g. transforming all images or only with certain class
  - by calling a `<Image` component
- which images are transformed:
  - eagerly (prerender): those matched in the source folder. but then how do you know the transform options? you need to have the user run a script.
  - lazily (on request): those referenced from the HTML: then for ssr, we would need a precompile script that finds all places in the source that uses the image, even if behind if condition. so you need to analyze source code.

but either way, we're only talking about build-time images. you cannot have end-user enter a url to an image in a CMS and then resize that image on-demand. that would be out-of-scope.

config that specifies a declarative mapping which we can use to pre-render all images in folder, or lookup on-request in dev mode:
  `transformImgs("data/posts/**/*.jpg", { blogportrait: {width: 400, srcset: ["2x"] } })`
input html: `<img class="blogportrait" src="myImage.jpg">`
output html: `<img class="blogportrait" width="150" src="myImage.hash.webp" ...`


## How to use third-party code

1. Link to external script. But better self-host, because browsers don't share cache between different origins anyway.
2. npm install: either serve every file as-is (but some packages have hundreds of files), or bundle each package as one file (and tree-shake it? but if we need to analyze which functions are called from our code, we can also tree-shake our own code. perhaps replace it with whitespace so that line-numbers stay the same?) but seems as soon as we have [module declarations](https://github.com/tc39/proposal-module-declarations), we should bundle to that anyway.

-> mastro just has no bundler/transpiler in dev mode (except typescript). thus no semantic changes, only performance optimizations.



## Dynamic interactivity with JavaScript in the browser

So far we have a completely static website, meaning it doesn't change no matter what the user does. Unless we website creators change it, the page will always be exactly the same.

Let's add some simple interactivity: When the user loads e.g. `http://localhost:3000/peter`, it should display `Hello peter!`

One way to achieve this is to add some JavaScript that runs in the browser. To make the JavaScript execute when the page is ready, we could either listen to the [`DOMContentLoaded` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event#examples), or here we just put the script tag at the end of the body tag:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My website</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>

    <h1 id="hello">Hello</h1>

    <script>
      // Assign the document's path to the variable `pagePath` (it will contain `/peter`):
      const pagePath = document.location.pathname

      // create a function that takes one argument called `path`, which we expect to be a string,
      // and assign that function to the variable `getName`:
      const getName = (path) => {
        // skips the first character (which will be the slash):
        const name = pagePath.slice(1)

        // add a space before, and a ! after the name,
        // and `return` that from the function:
        return ' ' + name + '!'
      }

      // call the function `getName` with `path` as its argument
      // and assign the returned value to the variable `name` (it will contain ` peter!`):
      const name = getName(path)

      // find the element we already have on the page and append the name to it:
      document.getElementById('hello').append(name)
    </script>
  </body>
</html>
```

**Note**: If that didn't make too much sense or you want to know all the details, I highly recommend reading the first 3 chapters of [Eloquent JavaScript](https://eloquentjavascript.net).

If you're more the experimental learner, open your browser's developer tools, switch to the `Console` tab and try out what happens when you put in some of the code from above. For example try `document.location.pathname` and hit `Enter`.


## HTML generated dynamically by JavaScript on the server

For some things, adding JavaScript that runs in the browser is a fine solution (think interactive widgets like a map). But compared to just displaying HTML, a lot more things have to go completely right for the user's browser to execute that bit of JavaScript without failing. And JavaScript in the browser always executes fairly late (only once the page has been sent over the network and the user's browser got around to executing it). If you reload the page, you can quickly see that the browser first shows `Hello` and only after a split-second updates to `Hello peter!`. Therefore, for lots of things, it's preferable to run the code that makes things dynamic already on our server, and then simply send different HTML to the user. Let's do that.

To match on the name part of the URL and make a dynamic server-generated page, we rename our `index.html` file in the `routes/` folder to `[name].js`. The `[...]` syntax acts as a wildcard. The file contains a single variable named `GET`, which is a function. We `export` the `GET` function in order for the server to call it.

```jsx
export const GET = (req) => {
  const url = new URL(req.url)
  const name = url.pathname.slice(1)

  return (
    <html>
      <head>
        <title>My website</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <h1>Hello {name}!</h1>
      </body>
    </html>
  )
}
```

If you place a `.server.js` or `.server.jsx` file in the `routes/` folder, and export a function like `GET` from it, then the mastro server will call that function when the server receives a HTTP GET request from the browser – which is what happens behind the scenes when you visit `http://localhost:3000/peter` with your browser – try it!
