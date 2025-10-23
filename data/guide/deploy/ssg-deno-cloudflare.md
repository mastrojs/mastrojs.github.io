---
title: Build static site with Deno and deploy to Cloudflare
---

[← Other deployment options](/guide/cli-deploy-production/#deploy-static-site-with-ci%2Fcd)

To host your static site on Cloudflare, we need a [wrangler.json config](https://developers.cloudflare.com/workers/wrangler/configuration/#assets):

```json title=wrangler.json
{
  "name": "my-static-page",
  "compatibility_date": "2025-08-23",
  "assets": {
    "directory": "./generated"
  }
}
```

After adding that to your GitHub repo, go to the [Cloudflare Dashboard](https://dash.cloudflare.com), click **Create application**, choose **Import a repository**, and follow the instructions.

To create the `generated` folder, you can either build and deploy in Cloudflare, or in [GitHub Actions](https://docs.github.com/en/actions).

## Cloudflare build

### Build command

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh && /opt/buildhome/.deno/bin/deno task generate
```

### Deploy command

```sh
npx wrangler deploy
```

## GitHub Actions

Alternatively, add [your credentials](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/#supported-environment-variables) (`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`) to [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets), and add the following file to your GitHub repository:

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

      - name: Build static site
        run: deno task generate

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config wrangler.json
```



## Congratulations!

Pushing to GitHub should now deploy your static site to Cloudflare.
