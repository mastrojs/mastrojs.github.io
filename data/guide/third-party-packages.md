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


### Vendoring

Finally, instead of using esm.sh, NPM or JSR, you can of course also download the files and add them to your project, this is often done in a folder called `/libs/` or `/vendor/` (or e.g. `/routes/libs/` for client dependencies). However, this makes it a bit harder to update them compared to the other options.


## On the client

It's important to remember that the above file (`import_map.json`, `deno.json` or `package.json`) will not be loaded into the browser, and neither will any packages it contains. This is good, because packages intended to be run on the server are often very big and it would slow down your website a lot if all your website visitors had to download them.

If you need third-party packages on the client, you should use a separate import map in your HTML:

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

Note that for the client-side, we added `?bundle` at the end of the URL. That's a feature of [esm.sh](https://esm.sh/), which instructs it to bundle all the files in that package together into one file. This loads much faster than dozens of individuals files – especially on slow networks like on mobile phones.

You'll see a [full example of a client-side importmap](/guide/interactivity-with-javascript-in-the-browser/#reactive-programming) in the next chapter.
