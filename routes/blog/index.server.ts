import { html, htmlToResponse } from "@mastrojs/mastro";
import { Layout } from "../../components/Layout.ts";
import { fmtIsoDate } from "../../helpers/date.ts";
import { readMdFiles } from "../../helpers/markdown.ts";

export const GET = async () => {
  const posts = await readMdFiles();
  posts.sort((a, b) => a.meta.date < b.meta.date ? 1 : -1);
  return htmlToResponse(
    Layout({
      title: "Blog | Mastro",
      children: html`
        <main>
          <h1>Blog</h1>
          ${posts.map((post) => html`
            <p>
              ${fmtIsoDate(post.meta.date)}<br>
              <a href=${post.path}>${post.meta.title}</a>
            </p>
            `)}
        </main>
        `,
    })
  );
}
