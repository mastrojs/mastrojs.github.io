import fs from "node:fs/promises";
import { createOrUpdateStandardSite, type Publication, type Document } from "@mastrojs/atproto";
import { readBlogFiles } from "../markdown.ts";

const identifier = "mastrojs.bsky.social";
const password = process.env.ATPROTO_PASSWORD;
const pubUrl = new URL("https://mastrojs.github.io/blog/");

const publication: Publication = {
  url: pubUrl,
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
const docs: Document[] = posts.map((p) => ({
  title: p.meta.title,
  publishedAt: new Date(p.meta.date),
  url: new URL(p.path, pubUrl),
}));

await createOrUpdateStandardSite({ identifier, password }, publication, docs);
