---
title: Build static site with Node.js and deploy to Netlify
---

[← Other deployment options](/guide/cli-deploy-production/#deploy-static-site-with-ci%2Fcd)

Go to your Netlify dashboard and select **Add new site**, then choose **Import an existing project** and follow the instruction to connect with your GitHub repository.

Set the following **Publish settings**:

#### Build command

```sh
pnpm run generate
```

#### Publish directory

```sh
generated
```

Congratulations! Pushing to GitHub should now deploy your static site to Netlify.
