import { Layout } from "../components/Layout.js";
import { html, htmlToResponse, parseYamlFrontmatter, readTextFile, unsafeInnerHtml } from "mastro";
import markdownIt from "markdown-it";
import prism from "markdown-it-prism";
import "prismClike";

const md = markdownIt({
  html: true,
  typographer: true,
});
md.use(prism);

const readMarkdownFile = async (path) => {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  let txt
  try {
    txt = await readTextFile("data" + path + ".md");
  } catch {
    txt = await readTextFile("data" + path + "/index.md");
  }
  const { body, meta } = await parseYamlFrontmatter(txt);
  return {
    content: unsafeInnerHtml(md.render(body)),
    meta,
  };
}

export const GET = async (req) => {
  const { content, meta } = await readMarkdownFile(new URL(req.url).pathname);
  return htmlToResponse(
    Layout({
      title: meta.title,
      children: html`
        ${content}
      `,
    }),
  );
}

const guideChapters = [
  { label: 'Motivation: Why learn HTML and CSS?', slug: 'guide/why-html-css' },
  { label: 'Setup: GitHub and VS Code for Web', slug: 'guide/setup' },
  { label: 'Start with HTML', slug: 'guide/html' },
  { label: 'Publish your website', slug: 'guide/publish-website' },
  { label: 'Style with CSS', slug: 'guide/css' },
  { label: 'Introducing JavaScript', slug: 'guide/javascript' },
  { label: 'Server-side components', slug: 'guide/server-side-components' },
  { label: 'A static blog from markdown files', slug: 'guide/static-blog-from-markdown-files' },
  { label: 'Interactivity with JavaScript in the browser', slug: 'guide/interactivity-with-javascript-in-the-browser' },
  { label: 'Addendum: HTTP, forms and REST APIs', slug: 'guide/http-forms-and-rest-apis' },
]

const reactiveChapters = [
  { label: 'Installing Reactive Mastro', slug: 'reactive/install' },
  { label: 'Why Reactive Mastro?', slug: 'reactive/why-reactive-mastro' },
  { label: 'Using Reactive Mastro', slug: 'reactive/usage' },
  { label: 'Reference', slug: 'reactive/reference' },
]
