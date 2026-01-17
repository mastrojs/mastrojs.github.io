---
title: Deploy to production
---

In the previous chapter, we've seen how to run a development server locally on your laptop. But since your laptop is not always running and connected to the internet, you need a server in some data center to host your production website.
If you don't want to deploy your website to production (where other people on the internet can see it), you can also skip this chapter for now.

## Deploy static site with CI/CD

If you have a static site, you can deploy to [GitHub Pages](https://pages.github.com), [Netlify](https://www.netlify.com/), [Cloudflare](https://www.cloudflare.com/), [Bunny](https://bunny.net/), or any other CDN. You could even serve the files from a static file server like nginx.

Let's look at how you can generate your static site within a _Continuous Integration / Continuous Delivery_ (CI/CD) service. This ensures a reproducible environment (i.e. that it not only works on your computer), and makes sure that you haven't forgotten to add any needed files to git (which can happen easily). Basically, this is just running the following command on the CI/CD server instead of on your laptop.

<div class="col3">

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

Depending on whether you use Deno or Node.js, and what your deploy target is, we may have exactly the right documentation for you. Otherwise you can probably adapt them to your use-case. If you run into problems, don't hesitate to ask on [Mastro Discussions](https://github.com/mastrojs/mastro/discussions/).

|                      | Deploy to<br>GitHub Pages | Deploy to<br>Cloudflare | Deploy to <br>Netlify |
|:---------------------|:---------------|:---------------|---------------------|
| SSG with **Deno**    | [docs][denoGh] | [docs][denoCf] | [docs][denoNetlify] |
| SSG with **Node.js** | [docs][nodeGh] | [docs][nodeCf] | [docs][nodeNetlify] |

[denoGh]: /guide/deploy/ssg-deno-github-pages/
[denoCf]: /guide/deploy/ssg-deno-cloudflare/
[denoNetlify]: /guide/deploy/ssg-deno-netlify/
[nodeGh]: /guide/deploy/ssg-node-github-pages/
[nodeCf]: /guide/deploy/ssg-node-cloudflare/
[nodeNetlify]: /guide/deploy/ssg-node-netlify/

## Deploy server to production

Since static sites are completely pre-generated, they're usually faster and cheaper to host than running a server. However, as we'll see in the next couple of chapters, there are some things that you cannot do with a static site.

Since GitHub Pages only offers static site hosting, if you need to dynamically generate pages on-demand, you need a production server, as offered e.g. by [Deno Deploy](https://deno.com/deploy), [Fly.io](https://fly.io/), [Render](https://render.com/), [Bunny Edge Scripting](https://docs.bunny.net/docs/edge-scripting-github-action), or [Cloudlfare Worker](#cloudflare-workers). You can run Mastro on any server that can run Deno, Node.js or Bun – even if it's via Docker.

Basically it's just running the following command on their server:

```sh title=Deno
deno run --allow-read --allow-net --allow-env server.ts
```

```sh title=Node.js
node server.ts
```

```sh title=Bun
bun server.ts
```

Be sure to run one of those in production and not deno/pnpm/bun `run start`, as those run with the `--watch` flag that restarts the server on file changes – great for local development, but unnecessary in production.

:::tip
### Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com/) come with their own JavaScript runtime called _workerd_. They don't support running on-demand code with Deno, Node.js or Bun.
To run your server code on-demand on the edge using Cloudflare, use the Mastro template for Cloudflare Workers. Either via the [template repo](https://github.com/mastrojs/template-basic-cloudflare) or:

```sh
pnpm create @mastrojs/mastro@0.0.9 --cloudflare
```
:::

We don't have specific docs for every combination of JavaScript runtime and hosting provider, but here are some starting points. If you run into a problem, don't hesitate to ask on [Mastro Discussions](https://github.com/mastrojs/mastro/discussions/).

|                         | Deploy to [Deno Deploy][dd] | Deploy to [Render][rd] |
|:------------------------|:-------------------|:-------------------|
| Server with **Deno**    | [docs][denoDeploy] | [docs][denoRender] |
| Server with **Node.js** | -                  | [docs][nodeRender] |
| Server with **Bun**     | -                  | [docs][bunRender] |

[dd]: https://deno.com/deploy/
[rd]: https://render.com/
[denoDeploy]: /guide/deploy/ssr-deno-deploy/
[denoRender]: /guide/deploy/ssr-deno-render/
[nodeRender]: /guide/deploy/ssr-node-render/
[bunRender]: /guide/deploy/ssr-bun-render/


In the next chapter, let's look at some fun things you can do with a server.
