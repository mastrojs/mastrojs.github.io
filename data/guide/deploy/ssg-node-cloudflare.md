---
title: Build static site with Node.js and deploy to Cloudflare
---

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

To build the `generated` folder, we'll use the [GitHub Actions](https://docs.github.com/en/actions) CI/CD service and `pnpm` (although there are other options as well):

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
      - name: Install pnpm
        uses: pnpm/action-setup@v4
      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "pnpm"
      - name: Install dependencies
        run: pnpm install

      - name: Build static site
        run: pnpm run generate

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --config wrangler.json
```

After [creating your Cloudflare application](https://developers.cloudflare.com/workers/get-started/dashboard/), add [your credentials](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/#supported-environment-variables) (`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`) to [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).

Congratulations! Pushing to GitHub should now deploy your static site to Cloudflare.
