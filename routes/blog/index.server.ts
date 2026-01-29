import { html, htmlToResponse, unsafeInnerHtml } from "@mastrojs/mastro";
import { Layout } from "../../components/Layout.ts";
import { Newsletter } from "../../components/Newsletter.ts";
import { fmtIsoDate } from "../../helpers/date.ts";
import { readBlogFiles } from "../../helpers/markdown.ts";

export const GET = async () => {
  const posts = await readBlogFiles();
  posts.sort((a, b) => a.meta.date < b.meta.date ? 1 : -1);
  return htmlToResponse(
    Layout({
      title: "Blog | Mastro",
      ogImage: "https://mastrojs.github.io/blog/og.png",
      children: html`
        <main>
          <h1>Blog</h1>
          ${posts.map(({ meta, path }) => html`
            <p>
              ${fmtIsoDate(meta.date)}<br>
              <a href=${path}>
                ${meta.titleIsHtml ? unsafeInnerHtml(meta.title) : meta.title}
              </a>
            </p>
            `)}
          ${Newsletter()}
        </main>
        <footer>
        </footer>
        `,
    })
  );
}
