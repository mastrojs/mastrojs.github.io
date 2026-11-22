---
title: Deploy to production
---

## Deploy static site

If you have a static site, you can deploy to [GitHub Pages](https://pages.github.com), [Netlify](https://www.netlify.com/), [Cloudflare](https://www.cloudflare.com/), [Bunny](https://bunny.net/), or any other CDN. You could even serve the files with a static file server like nginx.

Using a _Continuous Integration / Continuous Delivery_ (CI/CD) service, such as _GitHub Actions_, ensures a reproducible environment (i.e. that it not only works on your computer), and makes sure that you haven't forgotten to add any needed files to git. Basically, this is just running the following command on the CI/CD server instead of your laptop:

```sh
pnpm run generate
```

Depending on what your deploy target is, we may have exactly the right documentation for you. Otherwise you can probably adapt it to your use-case. If you run into problems, don't hesitate to [ask for help](/#join-the-community).

- [Mastro SSG on **GitHub Pages**](/docs/deploy/ssg-node-github-pages/)
- [Mastro SSG on **Cloudflare**](/docs/deploy/ssg-node-cloudflare/)
- [Mastro SSG on **Netlify**](/docs/deploy/ssg-node-netlify/)

## Deploy server

Static site generation is the fastest and simplest setup – if you can get away with it. But sometimes, you want to do things that are only possible by dynamically generating pages on-demand by [running a server](/guide/cli-install/).

GitHub Pages only offers static site hosting. To get a production server, use e.g. [Railway](https://railway.com/), [Render](https://render.com/), [Fly.io](https://fly.io/), [Bunny Edge Scripting](https://docs.bunny.net/docs/edge-scripting-github-action), or [Cloudlfare Worker](#cloudflare-workers). You can run Mastro on any server that can run Node.js or Bun – e.g. via Docker.

Either way, it's basically just running the following command on the server:

```sh
node server.ts
```

In production, be sure to run the above command, and not `pnpm run start`, which runs with the `--watch` flag that restarts the server on file changes – great for local development, but unnecessary in production.

- [Mastro server with **Node.js on Render**](/docs/deploy/ssr-node-render/)
- [Mastro server with **Bun on Render**](/docs/deploy/ssr-bun-render/)

I you're not on Render, you can adapt the above guide to your provider. (Pull requests welcome for more guides!) If you run into problems, don't hesitate to [ask for help](/#join-the-community).

:::tip
### Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com/) come with their own JavaScript runtime called _workerd_. They don't support running on-demand code with Node.js.
To run your server code on-demand on the edge using Cloudflare, use the Mastro template for Cloudflare Workers:

```sh
pnpm create @mastrojs/mastro@0.1.6 --cloudflare
```
:::
