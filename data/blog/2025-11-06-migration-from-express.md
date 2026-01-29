---
title: How to incrementally migrate from Express to the standard Request/Response API
date: 2025-11-06
author: Mauro Bieg
---

You want to migrate to [the modern way to write JavaScript servers](https://marvinh.dev/blog/modern-way-to-write-javascript-servers/), which is [supported across JavaScript runtimes](https://blog.val.town/blog/the-api-we-forgot-to-name/). `Deno.serve`, `Bun.serve`, Cloudflare Workers etc. – they all use the same standards-based [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)/[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) API for route handlers:

```ts title=new-server.ts
export const handler = (req: Request) => {
  return new Response(`Hello ${req.url}`);
}
```

But how do you incrementally migrate from your existing Express app? Simple: start by adding your new server handlers to your existing Express server using the `node-fetch-server` conversion wrapper:

```ts title=index.ts
import { createRequestListener } from "@remix-run/node-fetch-server";
import express from "express";

import { handler } from "./new-server.ts";

const app = express();

// here go legacy express routes you haven't migrated yet

app.all("*rest", async (req, res) => {
  const listener = createRequestListener(handler);
  return listener(req, res);
})

app.listen(3000);
```

This allows you to incrementally move over each route from the express way of doing things to the new Request/Response API. Crucially, it allows you to have both old and new route running in the same server in production, so you don't have to stop everything and your team can continue to ship new features and bug fixes during the migration.

Finally, when all routes are migrated, you can remove Express from your codebase. For example, using Deno:

```ts title=index.ts
import { handler } from "./new-server.ts";

Deno.serve(handler);
```


## Migrating to Mastro

If you're migrating to the [Mastro framework](/), you would replace `new-server.ts` in the above examples with importing the Mastro server. During the migration:

```ts title=index.ts
import mastro from "@mastrojs/mastro/server";
import { createRequestListener } from "@remix-run/node-fetch-server";
import express from "express";

const app = express();

// here go legacy express routes you haven't migrated yet

app.all("*rest", async (req, res) => {
  const listener = createRequestListener(mastro.fetch);
  return listener(req, res);
})

app.listen(3000);
```

And then when you've removed Express but are still on Node.js:

```ts title=index.ts
import mastro from "@mastrojs/mastro/server";
import { createRequestListener } from "@remix-run/node-fetch-server";
import * as http from "node:http";

const server = http.createServer(createRequestListener(mastro.fetch));
server.listen(3000);
```

Or when you've migrated to Deno:

```ts
import mastro from "@mastrojs/mastro/server";

Deno.serve(mastro.fetch);
```

Congratulations and welcome to the future!
