---
title: Run Bun server and deploy to Render
---

[← Other deployment options](/docs/deploy/#deploy-server)

To deploy your dynamically rendered Mastro app to Render using Bun,
go to your [Render dashboard](https://dashboard.render.com/) and select **New > Web Service**, and connect with your GitHub repository.

Set the following settings:

#### Build command

```sh
bun install
```

Or if you [pregenerate assets](/guide/bundling-assets/#build-step):

```sh
bun install && bun run generate
```

#### Start command

```sh
bun server.ts
```

Congratulations! Pushing to GitHub should now deploy your server to Render.
