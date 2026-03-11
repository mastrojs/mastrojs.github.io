---
title: Third-party packages
---

For complex functionality that would take you a long time to write yourself, it can be useful to install packages from [NPM](https://www.npmjs.com/) or [JSR](https://jsr.io/). These are package repositories where people share code for you to use.
However, take a bit of time to evaluate a package before adding it as a dependency to your project. Code quality, bundle size, security practices, and long-term maintenance outlook varies a lot between different third-party packages.

Since it's run in very different environments, [client-side and server-side JavaScript](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#client-side-vs-server-side-javascript) is separated on purpose in Mastro. The former needs to be downloaded to the browser of your users, the latter runs in a runtime like Deno or Node.js, which you control. Let's look at how you add packages for each of them.


## On the server

You might want to use the [`markdown-it` package from NPM](https://www.npmjs.com/package/markdown-it), instead of the [`@mastrojs/markdown` package](https://jsr.io/@mastrojs/markdown) to generate HTML from your markdown files on the server.

To install the package, use your package manager as follows:

<section class="tab-group">
  <header>
    <label><input type="radio" name="install" class="tab1" checked>Deno</label>
    <label><input type="radio" name="install" class="tab2">Node.js</label>
    <label><input type="radio" name="install" class="tab3">Bun</label>
    <label><input type="radio" name="install" class="tab4">VSCode extension</label>
  </header>

  <div tabindex=0 id="content1">

```sh
deno add npm:markdown-it
```

which will add this line to your `deno.json` file:

```json title=deno.json ins={4}
{
  "name": "...",
  "imports": {
    "markdown-it": "npm:markdown-it@14.1.0"
  }
}
```

  </div>
  <div tabindex=0 id="content2">

```sh
pnpm add markdown-it
```

which will not only change the `package.json` file, but also run `pnpm install`.

```json title=package.json ins={4}
{
  "name": "...",
  "dependencies": {
    "markdown-it": "markdown-it@14.1.0"
  }
}
```

  </div>
  <div tabindex=0 id="content3">

```sh
bun add markdown-it
```

which will not only change the `package.json` file, but also run `bun install`.

```json title=package.json ins={4}
{
  "name": "...",
  "dependencies": {
    "markdown-it": "markdown-it@14.1.0"
  }
}
```
  </div>
  <div tabindex=0 id="content4">

When generating a static site with the [Mastro VS Code for the Web extension](/guide/setup/), Mastro will look for an `import_map.json` file to resolve the `markdown-it` specifier. Using [esm.sh](https://esm.sh/):

```json title=import_map.json
{
  "imports": {
    "markdown-it": "https://esm.sh/markdown-it@14.1.0"
  }
}
```

  </div>
</div>

Then you'll be able to import the package in any server-side JavaScript file:

```js
import markdownIt from "markdown-it";
```

## On the client

It's important to remember that the above file (`deno.json` or `package.json`) will not be loaded into the browser – and unless you use a bundler, neither will any packages it contains. This is a good, because packages intended to be run on the server are often very big and would slow down your website if all your website visitors had to download them.

### Bundling

We'll look at [setting up a bundler with Mastro later](/guide/bundling-assets/). But to get started, it's easier to use pre-bundled versions – either by using a CDN or self-hosted.

### CDN

If the library you want to add is pre-bundling and published to a CDN (e.g. jsDelivr or UNPKG), use that. If they're only advertising an NPM (or JSR) package, you can use the [esm.sh](https://esm.sh/) CDN. To enable the bundler that's built into esm.sh, add `?bundle` at the end of the URL:

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

If you want to [self-host](https://blog.wesleyac.com/posts/why-not-javascript-cdn) your client-side dependencies instead of relying on a third-party CDN, you can download pre-bundled versions from a CDN or from NPM. Often, you can find bundled files in a `dist/` folder or similar in the _Code_ tab of the package on NPM. For the markdown-it example, this would be the `dist/markdown-it.min.js` file on [this page](https://www.npmjs.com/package/markdown-it?activeTab=code).

After downloading the file, add it somewhere in your Mastro project's `routes/` folder, e.g. `routes/vendor/markdown-it/markdown-it.min.js`. You can choose the exact folder names and structure, but `vendor` is a common name when "vendoring" – i.e. copying another project's code into your project. Then you can load it like:

```html
<!doctype html>
<html>
  <head>
    <script type="importmap">
    {
      "imports": {
        "markdown-it": "/vendor/markdown-it/markdown-it.min.js"
      }
    }
    </script>
```

### Import maps

In Deno and the browser you could also use the URL of any [ESM module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) as part of an import statement. However, if you'll use the library in more than one file, it's best to centralize it in an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) – like demonstrated in the CDN and self-hosted examples above. Then, there's only one place to change the version number, when the time comes to update it.

You'll see a [full example of a client-side importmap](/guide/interactivity-with-javascript-in-the-browser/#reactive-programming) in the next chapter.
