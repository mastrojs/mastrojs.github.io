import { html, htmlToResponse, unsafeInnerHtml } from "@mastrojs/mastro";
import { Layout } from "../../components/Layout.ts";
import { Newsletter } from "../../components/Newsletter.ts";
import { fmtIsoDate } from "../../helpers/date.ts";
import { readBlogFiles } from "../../helpers/markdown.ts";
import { BlogFooter } from "../../components/BlogFooter.ts";

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
          ${posts.map(({ meta, path }) => html`
            <p>
              <a href=${path}>
                ${meta.titleIsHtml ? unsafeInnerHtml(meta.title) : meta.title}
              </a>
              <br>
              <span class="text-gray">
                ${fmtIsoDate(meta.date)}
              </span>
            </p>
            `)}
          ${Newsletter()}
        </main>
        ${BlogFooter()}
        `,
    })
  );
}
