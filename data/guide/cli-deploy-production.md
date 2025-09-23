---
title: Deploy to production
---

In the previous chapter, we've seen how to run a development server locally on your laptop. But since your laptop is not always running and connected to the internet, you need a server in some data center to host your production website.

If you don't want to deploy your website to production just now, you can also skip this chapter for now.

## Deploy static site with CI/CD

If you have a static site, you can deploy to [GitHub Pages](https://pages.github.com), [Netlify](https://www.netlify.com/), or any other CDN, or run a static file server like nginx.

Now that you're familiar with Deno on the command line, let's look at how instead of generating your static site on your laptop, you can generate it within a _Continuous Integration / Continuous Delivery_ (CI/CD) service. This ensures a reproducible environment, and makes sure that you haven't forgotten to commit any files to git. Basically, this is just running the following command on the CI/CD server:

```sh title=Terminal
deno task generate
```

### GitHub Pages

To deploy your static site to GitHub Pages using the [GitHub Actions](https://docs.github.com/en/actions) CI/CD service, add the following file to your GitHub repository:

```yaml title=.github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v4
      - name: Install Deno
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - name: Build step
        run: "deno task generate"
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: generated

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then configure [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow):

1. On GitHub, navigate to the **page of the repository**: `https://github.com/your-user-name/your-repository-name/`
2. Click the **Settings** tab on the top right (possibly hiding in a `...` menu).
3. In the **Code and automation** section of the left sidebar, click **Pages**.
4. Under **Source**, make sure that **GitHub Actions** is selected.

Congratulations! Each time you push a change to your code to GitHub, it should now be auto-deployed to GitHub Pages. Point your browser to `https://your-user-name.github.io/your-repository-name/` to see your live website.

### Cloudflare Workers

To host your static site on Cloudflare instead of GitHub Pages, we need a [wrangler.json config](https://developers.cloudflare.com/workers/wrangler/configuration/#assets):

```json title=wrangler.json
{
  "name": "my-static-page",
  "compatibility_date": "2025-08-23",
  "assets": {
    "directory": "./generated"
  }
}
```

To build the `generated` folder, we'll still use GitHub Actions:

```yaml title=.github/workflows/deploy.yml
name: Deploy Site

on:
  push:
    branches: [ main ]

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install Deno
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: Build package
        run: deno task make

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config wrangler.json
```

After [creating your Cloudflare application](https://developers.cloudflare.com/workers/get-started/dashboard/), add [your credentials](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/#supported-environment-variables) (`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`) to [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).

Congratulations! Pushing to GitHub should now deploy your static site to Cloudflare.


## Deploy server to production

Since static sites are completely pre-generated, they're usually faster and cheaper to host than running a server. However, as we'll see in the next couple of chapters, there are some things that you cannot do with a static site.

Since GitHub Pages only offers static site hosting, if you need to dynamically generate pages on-demand, you need a production server, as offered by [Deno Deploy](https://deno.com/deploy), [Fly.io](https://fly.io/), [Render](https://render.com/), [Vercel](https://vercel.com/), or any server that can run Deno, e.g. via Docker. Basically it's just running the following command on their server:

```sh title=Terminal
deno run --allow-read --allow-net --allow-env server.ts
```

To use **Deno Deploy**, [join Deno Deploy<sup>EA</sup>](https://docs.deno.com/deploy/early-access/) (Early Access), and set up a [new app](https://app.deno.com/mastrojs/~/new) with the following build configuration:

- Framework preset: No Preset
- Install command: `deno install`
- Build command: blank
- Dynamic App -> Entrypoint: `server.ts`

In the next chapter, let's look at some fun things you can do with a server.
