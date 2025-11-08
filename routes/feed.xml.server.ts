import { atomResponse } from "@mastrojs/feed";
import { readBlogFiles } from "../helpers/markdown.ts";

const baseUrl = "https://mastrojs.github.io/";

export const GET = async () => {
  const posts = await readBlogFiles();
  return atomResponse({
    title: "Mastro",
    subtitle: "Updates about the web framework and static site generator, as well as the Mastro Guide.",
    id: new URL(baseUrl),
    linkSelf: new URL("/feed.xml", baseUrl),
    linkWebsite: new URL("/blog/", baseUrl),
    updated: new Date(posts[0].meta.date + "T12:00:00Z"),
    entries: posts.map((post) => {
      const url = new URL(post.path, baseUrl);
      return {
        id: url,
        link: url,
        updated: new Date(post.meta.date + "T12:00:00Z"),
        author: { name: post.meta.author },
        title: post.meta.title,
        content: post.content,
      }
    }),
  });
}
