---
title: Build static site with Node.js and deploy to GitHub Pages
---

[← Other deployment options](/guide/deploy/#deploy-static-site-with-ci%2Fcd)

To deploy your static site to GitHub Pages using the [GitHub Actions](https://docs.github.com/en/actions) CI/CD service, add the following file to your GitHub repository. This uses Node.js and `pnpm`.

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
