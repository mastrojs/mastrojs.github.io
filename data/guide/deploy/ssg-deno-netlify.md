---
title: Build static site with Deno and deploy to Netlify
---

[← Other deployment options](/guide/cli-deploy-production/#deploy-static-site-with-ci%2Fcd)

Go to your Netlify dashboard and select **Add new site**, then choose **Import an existing project** and follow the instruction to connect with your GitHub repository.

Set the following **Publish settings**:

#### Build command

Since Netlify currently only has [Deno v1 installed](https://docs.netlify.com/build/configure-builds/available-software-at-build-time/), we install a newer version:

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh && /opt/buildhome/.deno/bin/deno task generate
```

#### Publish directory

```sh
generated
```

Congratulations! Pushing to GitHub should now deploy your static site to Netlify.
