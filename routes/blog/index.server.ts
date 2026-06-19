import { html, htmlToResponse, unsafeInnerHtml } from "@mastrojs/mastro";
import { Layout } from "../../components/Layout.ts";
import { Newsletter } from "../../components/Newsletter.ts";
import { fmtIsoDate } from "../../helpers/date.ts";
import { readBlogFiles } from "../../helpers/markdown.ts";

export const GET = async (req: Request) => {
  const posts = await readBlogFiles();
  return htmlToResponse(
    Layout({
      title: "Blog | Mastro",
      ogImage: "https://mastrojs.github.io/blog/og.png",
      req,
      children: html`
        <main>
          <h1>Blog</h1>
          <p><strong>Posts about the web and <a href="/">Mastro</a> – the simplest web framework and site generator yet.</strong></p>
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
