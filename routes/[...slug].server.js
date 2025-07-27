import { Layout } from "../components/Layout.js";
import { Sidebar } from "../components/Sidebar.js";
import { Toc } from "../components/Toc.js";
import { html, htmlToResponse, readMarkdownFileInFolder } from "mastro";
import { mdToHtml } from "../helpers/markdown.js";

export const GET = async (req) => {
  const { pathname } = new URL(req.url);
  const { content, meta } = await readMarkdownFileInFolder("data", pathname, mdToHtml);

  const currentPart = sidebar.find((part) => part.slug === `/${pathname.split("/")[1]}/`);
  const contents = currentPart?.contents;
  const index = contents?.findIndex((c) => c.slug === pathname);
  const prev = index >= 0 ? contents[index - 1] : undefined;
  const next = index >= 0 ? contents[index + 1] : undefined;
  return htmlToResponse(
    Layout({
      title: meta.metaTitle || (meta.title ? `${meta.title} | Mastro` : "Mastro"),
      description: meta.description,
      children: html`
        ${Sidebar(sidebar, currentPart, pathname)}

        <main ${meta.layout ? `class=${meta.layout}` : ""}>
          <h1>${meta.title}</h1>

          ${content}

          ${contents && index === -1
            ? Toc({ contents })
            : ""}
        </main>

        <footer>
          ${prev
            ? html`
              <a href="${prev.slug}">
                <div>← Previous chapter</div>
                ${prev.label}
              </a>
            `
            : html`<span></span>`}
          ${next && html`
            <a href="${next.slug}">
              <div>Next chapter →</div>
              ${next.label}
            </a>
          `}
        </footer>
      `,
    }),
  );
};

export const getStaticPaths = () =>
  ["/", ...sidebar.flatMap((part) => [part.slug, ...part.contents.map((chapter) => chapter.slug)])];

const sidebar = [{
  label: "Guide",
  slug: "/guide/",
  contents: [
    { label: "Motivation: Why learn HTML and CSS?", slug: "/guide/why-html-css/" },
    { label: "Setup: GitHub and VS Code for Web", slug: "/guide/setup/" },
    { label: "Start with HTML", slug: "/guide/html/" },
    { label: "Publish your website", slug: "/guide/publish-website/" },
    { label: "Style with CSS", slug: "/guide/css/" },
    { label: "Introducing JavaScript", slug: "/guide/javascript/" },
    { label: "Server-side components", slug: "/guide/server-side-components/" },
    { label: "A static blog from markdown files", slug: "/guide/static-blog-from-markdown-files/" },
    { label: "Interactivity with JavaScript in the browser", slug: "/guide/interactivity-with-javascript-in-the-browser/" },
    { label: "URLs, HTTP and servers", slug: "/guide/urls-http-servers/" },
    { label: "Forms and REST APIs", slug: "/guide/forms-and-rest-apis/" },
  ],
}, {
  label: "Reactive",
  slug: "/reactive/",
  contents: [
    { label: "Installing Reactive Mastro", slug: "/reactive/install/" },
    { label: "Why Reactive Mastro?", slug: "/reactive/why-reactive-mastro/" },
    { label: "Using Reactive Mastro", slug: "/reactive/usage/" },
    { label: "Reference", slug: "/reactive/reference/" },
  ],
}];
