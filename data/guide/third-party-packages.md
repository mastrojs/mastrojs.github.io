---
title: Third-party packages
---

For complex functionality that would take you a long time to write yourself, it can be useful to install packages from [NPM](https://www.npmjs.com/) or [JSR](https://jsr.io/). These are package repositories where people (i.e. third-parties) can share code for you to use.

However, be careful to take a bit of time to evaluate a package before adding it as a dependency to your project. Code quality and bundle size vary quite a lot among third-party packages. And you and your code will literally depend on that dependency not messing things up or slowing things down.

You can use the URL of any [ESM module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) as part of an import statement. However, if you'll use the library in more than one file, it's best to centralize it in an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap). Then, there's only one place to change the version number, when the time comes to update it.

However, keep in mind that in Mastro, [client-side JavaScript and server-side JavaScript](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#client-side-vs-server-side-javascript) are very much separated. They run in different contexts (the former in the browser, the latter in a server runtime like Deno or Node.js) and thus use different import maps.


## On the server

Let's look at an example. You might want to use the [`markdown-it` package from NPM](https://www.npmjs.com/package/markdown-it), instead of the [`@mastrojs/markdown` package](https://jsr.io/@mastrojs/markdown) to generate HTML from your markdown files on the server. You'd want to be able to import it with the `markdown-it` specifier in any server-side JavaScript file:

```js
import markdownIt from "markdown-it";
```

### Mastro VS Code extension

When generating a static site with the [Mastro VS Code for the Web extension](/guide/setup/), Mastro will look for an `import_map.json` file to resolve the `markdown-it` specifier. Using [esm.sh](https://esm.sh/):

```json title=import_map.json
{
  "imports": {
    "markdown-it": "https://esm.sh/markdown-it@14.1.0"
  }
}
```

### Deno

When generating a static site or running a server with Deno on the command-line, it will look for a `imports` field in the `deno.json` file to resolve the specifier:

```json title=deno.json
{
  "name": "...",
  "imports": {
    "markdown-it": "npm:markdown-it@14.1.0"
  }
}
```

This can also be added automatically by running:

```sh
deno add npm:markdown-it
```

### Node.js

When generating a static site or running a server with Node.js on the command-line, it will look for a `dependencies` field in the `package.json` file to resolve the specifier:

```json title=package.json
{
  "name": "...",
  "dependencies": {
    "markdown-it": "markdown-it@14.1.0"
  }
}
```

This can also be added automatically by running:

```sh
pnpm add markdown-it
```

which will not only change the `package.json` file, but also run `pnpm install`.


## On the client

It's important to remember that the above file (`import_map.json`, `deno.json` or `package.json`) will not be loaded into the browser, and neither will any packages it contains. This is good, because packages intended to be run on the server are often very big and it would slow down your website a lot if all your website visitors had to download them.
If you need third-party packages on the client, you should use a separate import map in your HTML.

Installing client-side dependencies with `pnpm install` or similar currently is not explicitly supported with Mastro. That's because most packages require a bundler to be efficiently served to the browser (loading hundreds of small files is slow – especially on mobile networks). While you can [setup a bundler with Mastro](/guide/bundling-assets/), it's a lot simpler to use pre-bundled versions. Either by loading them directly from a CDN, or by dowloading the files into your `routes/` folder and self-hosting them from there.

### CDN

If the library you want to add is publishing a CDN url (e.g. jsDelivr or UNPKG), use that. If they're only advertising an NPM (or JSR) package, you can use the [esm.sh](https://esm.sh/) CDN. To enable the bundler that's built into esm.sh, add `?bundle` at the end of the URL:

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


### Self-hosted

If you want to [self-host](https://blog.wesleyac.com/posts/why-not-javascript-cdn) your client-side dependencies instead of relying on a third-party CDN, download pre-bundled versions from a CDN or from NPM. Often, you can find bundled files in a `dist/` folder or similar in the _Code_ tab of the package on NPM. For the markdown-it example, this would be the `dist/markdown-it.min.js` file on [this page](https://www.npmjs.com/package/markdown-it?activeTab=code).

After downloading the file, add it somewhere in your Mastro project's `routes/` folder, e.g. `routes/lib/markdown-it/markdown-it.min.js`. You can choose the exact folder names and structure, but `lib` is a common name when vendoring dependencies. Then you can load it like:

```html
<!doctype html>
<html>
  <head>
    <script type="importmap">
    {
      "imports": {
        "markdown-it": "/lib/markdown-it/markdown-it.min.js"
      }
    }
    </script>
```

You'll see a [full example of a client-side importmap](/guide/interactivity-with-javascript-in-the-browser/#reactive-programming) in the next chapter.
