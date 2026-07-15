---
title: Deploy to production
---

## Deploy static site

If you have a static site, you can deploy to [GitHub Pages](https://pages.github.com), [Netlify](https://www.netlify.com/), [Cloudflare](https://www.cloudflare.com/), [Bunny](https://bunny.net/), or any other CDN. You could even serve the files with a static file server like nginx.

Using a _Continuous Integration / Continuous Delivery_ (CI/CD) service, such as _GitHub Actions_, ensures a reproducible environment (i.e. that it not only works on your computer), and makes sure that you haven't forgotten to add any needed files to git. Basically, this is just running the following command on the CI/CD server instead of your laptop:

<div class="col-3">

- ```sh title=Deno
  deno task generate
  ```

- ```sh title=Node.js
  pnpm run generate
  ```

- ```sh title=Bun
  bun run generate
  ```
</div>

Depending on whether you use Deno or Node.js, and what your deploy target is, we may have exactly the right documentation for you. Otherwise you can probably adapt them to your use-case. If you run into problems, don't hesitate to [ask for help](/#join-the-community).

|                      | GitHub Pages | Cloudflare | Netlify |
|:---------------------|:---------------|:---------------|---------------------|
| **SSG with Deno**    | [docs][denoGh] | [docs][denoCf] | [docs][denoNetlify] |
| **SSG with Node.js** | [docs][nodeGh] | [docs][nodeCf] | [docs][nodeNetlify] |

[denoGh]: /docs/deploy/ssg-deno-github-pages/
[denoCf]: /docs/deploy/ssg-deno-cloudflare/
[denoNetlify]: /docs/deploy/ssg-deno-netlify/
[nodeGh]: /docs/deploy/ssg-node-github-pages/
[nodeCf]: /docs/deploy/ssg-node-cloudflare/
[nodeNetlify]: /docs/deploy/ssg-node-netlify/

## Deploy server

Static site generation is the best setup – if you can get away with it. But sometimes, you want to do things that are only possible by dynamically generating pages on-demand by [running a server](/guide/cli-install/).

GitHub Pages only offers static site hosting. To get a production server, use e.g. [Deno Deploy](https://deno.com/deploy), [Railway](https://railway.com/), [Render](https://render.com/), [Fly.io](https://fly.io/), [Bunny Edge Scripting](https://docs.bunny.net/docs/edge-scripting-github-action), or [Cloudlfare Worker](#cloudflare-workers). You can run Mastro on any server that can run Deno, Node.js or Bun – e.g. via Docker.

Either way, it's basically just running the following command on the server:

```sh title=Deno
deno run --allow-read --allow-net --allow-env server.ts
```

```sh title=Node.js
node server.ts
```

```sh title=Bun
bun server.ts
```

In production, be sure to run the above command, and not deno/pnpm/bun `run start`, which runs with the `--watch` flag that restarts the server on file changes – great for local development, but unnecessary in production.

|                         | [Deno Deploy][dd] | [Render][rd] |
|:------------------------|:-------------------|:-------------------|
| Server with **Deno**    | [docs][denoDeploy] | [docs][denoRender] |
| Server with **Node.js** | -                  | [docs][nodeRender] |
| Server with **Bun**     | -                  | [docs][bunRender] |

[dd]: https://deno.com/deploy/
[rd]: https://render.com/
[denoDeploy]: /docs/deploy/ssr-deno-deploy/
[denoRender]: /docs/deploy/ssr-deno-render/
[nodeRender]: /docs/deploy/ssr-node-render/
[bunRender]: /docs/deploy/ssr-bun-render/

We don't have specific docs for every combination of JavaScript runtime and hosting provider (yet), but you can adapt the above to your provider. If you run into problems, don't hesitate to [ask for help](/#join-the-community).

:::tip
### Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com/) come with their own JavaScript runtime called _workerd_. They don't support running on-demand code with Deno, Node.js or Bun.
To run your server code on-demand on the edge using Cloudflare, use the Mastro template for Cloudflare Workers. Either via the [template repo](https://github.com/mastrojs/template-basic-cloudflare) or:

```sh
pnpm create @mastrojs/mastro@0.1.6 --cloudflare
```
:::
