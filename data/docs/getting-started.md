---
title: Getting started
---


You can [**run Mastro in your browser**](https://vscode.dev/github/mastrojs/template-basic) or install it locally [with a terminal](/guide/cli-install/#setup-local-development-server):


<section class="tab-group">
  <header>
    <label><input type="radio" name="install" class="tab1" checked>Deno</label>
    <label><input type="radio" name="install" class="tab2">Node.js</label>
    <label><input type="radio" name="install" class="tab3">Bun</label>
    <label><input type="radio" name="install" class="tab4">Workers</label>
  </header>

  <div tabindex=0 id="content1">

  [Install Deno](https://docs.deno.com/runtime/getting_started/installation/) and copy and paste into your terminal:

  ```sh
  deno run -A npm:@mastrojs/create-mastro@0.1.6
  ```
  </div>
  <div tabindex=0 id="content2">

  [Install pnpm](https://pnpm.io/installation#using-a-standalone-script) (although `npm` and `yarn` [also work](https://jsr.io/docs/npm-compatibility)). Then install Node.js (if you haven't already) with `pnpm runtime set node lts -g`, then:

  ```sh
  pnpm create @mastrojs/mastro@0.1.6
  ```
  </div>
  <div tabindex=0 id="content3">

  Copy and paste into your terminal:

  ```sh
  bun create @mastrojs/mastro@0.1.6
  ```
  </div>
  <div tabindex=0 id="content4">
  Use Deno, Node.js, or Bun to generate a static site for any CDN (Cloudflare or not).

  However, to run code [on-demand](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/) in a [Cloudflare Worker](https://workers.cloudflare.com/):

  ```sh
  pnpm create @mastrojs/mastro@0.1.6 --cloudflare
  ```

  Finally, Mastro can also run code on-demand inside a [Service Worker in the user's browser](/blog/2026-03-09-whatever-happened-to-js-service-workers/).
  </div>
</section>
