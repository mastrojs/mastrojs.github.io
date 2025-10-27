---
title: Run Node.js server and deploy to Render
---

[← Other deployment options](/guide/deploy/#deploy-server-to-production)

Be sure to [set a Node.js version](https://render.com/docs/node-version) in a format Render.com understands and set it to Node >=v24.

To deploy your dynamically rendered Mastro app to Render using Node.js,
go to your [Render dashboard](https://dashboard.render.com/) and select **New > Web Service**, and connect with your GitHub repository.

Set the following settings:

#### Build command

```sh
pnpm install
```

#### Start command

```sh
node server.ts
```

Congratulations! Pushing to GitHub should now deploy your server to Render.
