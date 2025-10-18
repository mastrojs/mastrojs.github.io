---
title: Deploy to production
---

In the previous chapter, we've seen how to run a development server locally on your laptop. But since your laptop is not always running and connected to the internet, you need a server in some data center to host your production website.
If you don't want to deploy your website to production (where other people on the internet can see it), you can also skip this chapter for now.

## Deploy static site with CI/CD

If you have a static site, you can deploy to [GitHub Pages](https://pages.github.com), [Netlify](https://www.netlify.com/), or any other CDN. You could even serve the files from a static file server like nginx.

Let's look at how you can generate your static site within a _Continuous Integration / Continuous Delivery_ (CI/CD) service. This ensures a reproducible environment (i.e. that it not only works on your computer), and makes sure that you haven't forgotten to add any needed files to git (which can happen easily). Basically, this is just running the following command on the CI/CD server instead of on your laptop.

```sh title=Deno
deno task generate
```

```sh title=Node.js
pnpm run generate
```

Depending on whether you use Deno or Node.js, and what your deploy target is, we may have docs covering exactly your use-case.

|                      | Deploy to<br>GitHub Pages | Deploy to<br>Cloudflare |
|:---------------------|:--------------------------|:------------------------|
| SSG with **Deno**    | [docs][denoGh]            | [docs][denoCf]          |
| SSG with **Node.js** | [docs][nodeGh]            | [docs][nodeCf]          |

[denoGh]: /guide/deploy/ssg-deno-github-pages/
[denoCf]: /guide/deploy/ssg-deno-cloudflare/
[nodeGh]: /guide/deploy/ssg-node-github-pages/
[nodeCf]: /guide/deploy/ssg-node-cloudflare/

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

One option is to use **Deno Deploy**. To do so, [join Deno Deploy<sup>EA</sup>](https://docs.deno.com/deploy/early-access/) (Early Access), and set up a [new app](https://app.deno.com/) with the following build configuration:

- Framework preset: No Preset
- Install command: `deno install`
- Build command: blank
- Dynamic App -> Entrypoint: `server.ts`

In the next chapter, let's look at some fun things you can do with a server.
