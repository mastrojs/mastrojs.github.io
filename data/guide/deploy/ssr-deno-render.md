---
title: Run Node.js server and deploy to Render
---

[← Other deployment options](/guide/cli-deploy-production/#deploy-server-to-production)

While Render doesn't come with Deno preinstalled, we can install it in the build command.

To deploy your dynamically rendered Mastro app to Render, go to your [Render dashboard](https://dashboard.render.com/) and select **New > Web Service**, and connect with your GitHub repository.

Set the following settings:

#### Build command

```sh
curl -fsSL https://deno.land/install.sh | sh
```

#### Start command

```sh
/opt/render/project/.deno/bin/deno run --allow-read --allow-net --allow-env server.ts
```

Congratulations! Pushing to GitHub should now deploy your server to Render.
