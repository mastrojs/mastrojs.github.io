---
title: Deploy to production
---

In the previous chapter, we've seen how to run a development server locally on your laptop. But since your laptop is not always running and connected to the internet, you need a server in some data center to host your production website.
If you don't want to deploy your website to production (where other people on the internet can see it), you can also skip this chapter for now.

## Deploy static site with CI/CD

If you have a static site, you can deploy to [GitHub Pages](https://pages.github.com), [Netlify](https://www.netlify.com/), or any other CDN. You could even serve the files from a static file server like nginx.

Let's look at how you can generate your static site within a _Continuous Integration / Continuous Delivery_ (CI/CD) service. This ensures a reproducible environment (i.e. that it not only works on your computer), and makes sure that you haven't forgotten to add any needed files to git (which can happen easily). Basically, this is just running the following command on the CI/CD server instead of on your laptop.

<div class="col2">

```sh title=Deno
deno task generate
```

```sh title=Node.js
pnpm run generate
```
</div>

Depending on whether you use Deno or Node.js, and what your deploy target is, we may have docs covering exactly your use-case.

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

Since GitHub Pages only offers static site hosting, if you need to dynamically generate pages on-demand, you need a production server, as offered by [Deno Deploy](https://deno.com/deploy), [Fly.io](https://fly.io/), [Render](https://render.com/), or any server that can run Deno or Node.js, even via Docker.

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

Be sure to run one of those in production and not `deno/pnpm/bun run start` as those run with the `--watch` flag.

|                         | Deploy to [Deno Deploy][dd] | Deploy to [Render][rd] |
|:------------------------|:-------------------|:-------------------|
| Server with **Deno**    | [docs][denoDeploy] | [docs][denoRender] |
| Server with **Node.js** | -                  | [docs][nodeRender] |
| Server with **Bun**     | -                  | [docs][bunRender] |

[dd]: https://deno.com/deploy
[rd]: https://render.com/
[denoDeploy]: /guide/deploy/ssr-deno-deploy/
[denoRender]: /guide/deploy/ssr-deno-render/
[nodeRender]: /guide/deploy/ssr-node-render/
[bunRender]: /guide/deploy/ssr-bun-render/


In the next chapter, let's look at some fun things you can do with a server.
