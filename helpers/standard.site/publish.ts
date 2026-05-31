import fs from "node:fs/promises";
import { createOrUpdateStandardSite, CredentialSession, type Publication } from "@mastrojs/atproto";
import { readBlogFiles } from "../markdown.ts";

const identifier = "mastrojs.bsky.social";

const password = process.env.ATPROTO_PASSWORD;
if (!password) {
  console.error(`
No password found!

Get one from https://bsky.app/settings/app-passwords and locally run like:
ATPROTO_PASSWORD=xxxx-xxxx-xxxx-xxxx deno task publishToAtmosphere
In your CI/CD pipeline, add it to its secret manager instead.
`);
  process.exit(1);
}

const publication: Publication = {
  url: new URL("https://mastrojs.github.io/blog/"),
  name: "Mastro Blog",
  description:
    "Posts about the web and Mastro – the simplest web framework and site generator yet.",
  icon: { // Square image to identify the publication. Should be at least 256x256
    blob: await fs.readFile("helpers/standard.site/icon.png"),
    mimeType: "image/png",
  },
  basicTheme: {
    background: { r: 255, g: 255, b: 255 },
    foreground: { r: 23, g: 24, b: 28 },
    accent: { r: 32, g: 32, b: 215 },
    accentForeground: { r: 255, g: 255, b: 255 },
  },
};

const posts = await readBlogFiles();
const docs = posts.map((p) => ({
  title: p.meta.title!,
  publishedAt: new Date(p.meta.date!),
  path: p.path.slice(6),
}));

const session = new CredentialSession(new URL("https://bsky.social"));
await session.login({ identifier, password });

await createOrUpdateStandardSite(session, publication, docs);
