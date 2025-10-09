import { Layout } from "../components/Layout.js";
import { Newsletter } from "../components/Newsletter.js";
import { Sidebar } from "../components/Sidebar.js";
import { Toc } from "../components/Toc.js";
import { html, htmlToResponse } from "mastro";
import { readMd } from "../helpers/markdown.js";

export const GET = async (req) => {
  const { pathname } = new URL(req.url);
  const { content, meta } = await readMd(pathname);

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

        <main ${meta.layout === "hero" ? `class=hero` : "data-pagefind-body"}>
          <h1>${meta.title}</h1>

          ${content}

          ${contents && index === -1
            ? Toc({ contents })
            : ""}

          ${["/", "/guide/"].includes(pathname)
            ? Newsletter()
            : ""}

          ${pathname === "/" ? html`
            <p style="text-align: center">
              <button class="-minimal" onclick="document.documentElement.scrollTop=0">
                ↑ Back to top
              </button>
            </p>
            ` : ""}
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

        <link rel="stylesheet" media="(prefers-color-scheme: light)" href="/styles/highlightjs-stackoverflow-light.min.css">
        <link rel="stylesheet" media="(prefers-color-scheme: dark)" href="/styles/highlightjs-stackoverflow-dark.min.css">
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
    { label: "Intro: Why learn HTML and CSS?", slug: "/guide/why-html-css/" },
    { label: "Setup: GitHub and VS Code for Web", slug: "/guide/setup/" },
    { label: "Start with HTML", slug: "/guide/html/" },
    { label: "Publish your static website", slug: "/guide/publish-website/" },
    { label: "Style with CSS", slug: "/guide/css/" },
    { label: "Client-side vs server-side JavaScript, SPA vs MPA", slug: "/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/" },
    { label: "Introducing JavaScript", slug: "/guide/javascript/" },
    { label: "Server-side components and routing", slug: "/guide/server-side-components-and-routing/" },
    { label: "A static blog from markdown files", slug: "/guide/static-blog-from-markdown-files/" },
    { label: "Third-party packages", slug: "/guide/third-party-packages/" },
    { label: "Interactivity with JavaScript in the browser", slug: "/guide/interactivity-with-javascript-in-the-browser/" },
    { label: "URLs, HTTP and servers", slug: "/guide/urls-http-servers/" },
    { label: "Setup Mastro on the command line", slug: "/guide/cli-install/" },
    { label: "Deploy server or static site with CI/CD", slug: "/guide/cli-deploy-production/" },
    { label: "Forms and REST APIs", slug: "/guide/forms-and-rest-apis/" },
    { label: "Bundling, pregenerating assets and caching", slug: "/guide/bundling-assets-caching/" },
    { label: "Web application architecture and the write-read-boundary", slug: "/guide/web-application-architecture-and-write-read-boundary/" },
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
