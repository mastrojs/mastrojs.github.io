---
title: Run Deno server and deploy to Deno Deploy
---

[← Other deployment options](/guide/deploy/#deploy-server-to-production)

To deploy your dynamically rendered Mastro app to [Deno Deploy](https://docs.deno.com/deploy/) (not Deploy Classic), set up a [new app](https://app.deno.com/) with the following build configuration.

#### Framework preset

Select "No Preset"

#### Install command

```sh
deno install
```

#### Build command:

Leave blank.

#### Dynamic App -> Entrypoint

```sh
server.ts
```

Congratulations! Pushing to GitHub should now deploy your static site to Deno Deploy.
