---
title: Third-party packages
---

For complex functionality that would take you a long time to write yourself, it can be useful to install packages from [NPM](https://www.npmjs.com/) or [JSR](https://jsr.io/). These are package repositories where people (i.e. third-parties) can share code for you to use.

However, be careful to take a bit of time to evaluate a package before adding it as a dependency to your project. Code quality and bundle size vary quite a lot among third-party packages. And you and your code will literally depend on that dependency not messing things up or slowing things down.

You can use the URL of any [ESM module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) as part of an import statement. However, if you'll use the library in lots of files, it's best to centralize it in an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap). Then, there's only one place to change the version number, when the time comes to update it.


## On the server

When generating the static site, Mastro will look for an `import_map.json` (or alternatively `deno.json`) file.

For example, you might want to use the [markdown-it package from npm](https://www.npmjs.com/package/markdown-it), instead of the `markdownToHtml` function that `mastro` exports (which uses [micromark](https://github.com/micromark/micromark#github-flavored-markdown-gfm) under the hood). Using [esm.sh](https://esm.sh/):

```json title=import_map.json
{
  "imports": {
    "markdown-it": "https://esm.sh/markdown-it@14.1.0"
  }
}
```

Then, we can use it in any server-side JavaScript file like:

```js
import markdownIt from "markdown-it";
```

Instead of using esm.sh, you can of course also download the files and add them to your project, this is often done in a folder called `/libs/` or `/vendor/` (or e.g. `/routes/libs/` for client dependencies). Then you strictly speaking don't even need the import map.


## On the client

It's important to remember that the `import_map.json` file will not automatically be loaded into the browser, and neither will any packages it contains, which would be wasteful. If you need third-party packages on the client, you should use a separate import map in your HTML:

```html
<!doctype html>
<html>
  <head>
    <script type="importmap">
    {
      "imports": {
        "markdown-it": "https://esm.sh/markdown-it@14.1.0?bundle"
      }
    }
    </script>
```

Note that we this time added `?bundle` at the end of the URL. That's a feature of `esm.sh`, which instructs it to bundle all the files in that package together into one file. This loads much faster than dozens of individuals files – especially on slow networks like on mobile phones.

You'll see a [full example of a client-side importmap](/guide/interactivity-with-javascript-in-the-browser/#reactive-programming) in the next chapter.
