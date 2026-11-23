---
title: Run Node.js server and deploy to Render
---

[← Other deployment options](/docs/deploy/#deploy-server)

To deploy your dynamically rendered Mastro app to Render using Node.js,
go to your [Render dashboard](https://dashboard.render.com/) and select **New > Web Service**, and connect with your GitHub repository.

Set the following settings:

#### Build command

```sh
pnpm install
```

Or if you [pregenerate assets](/guide/bundling-assets/#build-step):

```sh
pnpm install && pnpm run generate
```

#### Start command

```sh
node server.ts
```

Congratulations! Pushing to GitHub should now deploy your server to Render.
