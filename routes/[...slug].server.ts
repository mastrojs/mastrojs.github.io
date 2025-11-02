import { Layout } from "../components/Layout.ts";
import { Newsletter } from "../components/Newsletter.ts";
import { Sidebar } from "../components/Sidebar.ts";
import { Toc } from "../components/Toc.ts";
import { fmtIsoDate } from "../helpers/date.ts";
import { findFiles, html, htmlToResponse } from "@mastrojs/mastro";
import { readMd } from "../helpers/markdown.ts";

export interface SidebarItem {
  label: string;
  contents?: SidebarItem[];
  slug?: string;
};

export const GET = async (req: Request) => {
  const { pathname } = new URL(req.url);
  const { content, meta } = await readMd(pathname);
  const pathSegments = pathname.split("/");
  const isBlog = pathSegments[1] === "blog";

  const guideOrReactive = sidebar.find((part) => part.slug === `/${pathSegments[1]}/`);
  const contents = guideOrReactive?.contents;
  const flattened = contents && contents.some(item => "contents" in item)
    ? contents.flatMap((item) => "contents" in item ? item.contents : [])
    : contents;
  const { prev, next } = getPrevNext(flattened, pathname);

  return htmlToResponse(
    Layout({
      title: meta.metaTitle || (meta.title ? `${meta.title} | Mastro` : "Mastro"),
      description: meta.description,
      children: html`
        ${Sidebar(sidebar, guideOrReactive, pathname)}

        <main ${meta.layout === "hero" ? `class=hero` : (isBlog ? "" : "data-pagefind-body")}>
          <h1>${meta.title}</h1>

          ${isBlog
            ? html`<p>${meta.author} on ${fmtIsoDate(meta.date)}</p>`
            : ""}

          ${content}

          ${(pathSegments.length === 3 || pathname === "/guide/docs/") && contents
            ? Toc({ contents })
            : ""}

          ${["/", "/guide/"].includes(pathname) || isBlog
            ? Newsletter()
            : ""}
          ${pathname === "/" ? html`
            <p class="center-text">
              <button class="-minimal" onclick="document.documentElement.scrollTop=0">
                ↑ Back to top
              </button>
            </p>
            ` : ""}
          ${isBlog
            ? html`
                <p class="center-text">
                  <a href="/" class="button -minimal">Try Mastro now →</a>
                </p>
                `
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

        <link rel="stylesheet" media="(prefers-color-scheme: light)" href="/styles/highlightjs-stackoverflow-light.min.css">
        <link rel="stylesheet" media="(prefers-color-scheme: dark)" href="/styles/highlightjs-stackoverflow-dark.min.css">
      `,
    }),
  );
};

export const getStaticPaths = async () => {
  const files = await findFiles("data/**/*.md");
  return files.map(file => file.endsWith("/index.md")
    ? file.slice(5, -8)
    : file.slice(5, -3) + "/");
}

const getPrevNext = (contents: SidebarItem[] | undefined, pathname: string) => {
  if (!contents) {
    return {};
  } else {
    const index = contents.findIndex((c) => c.slug === pathname);
    return index >= 0
      ? {
        prev: contents[index - 1],
        next: contents[index + 1],
      }
      : {};
  }
}

const sidebar = [{
  label: "Guide",
  slug: "/guide/",
  contents: [{
    label: "HTML, CSS and JavaScript",
    contents: [
      { label: "Intro: Why learn HTML and CSS?", slug: "/guide/why-html-css/" },
      { label: "Setup: GitHub and VS Code for Web", slug: "/guide/setup/" },
      { label: "Start with HTML", slug: "/guide/html/" },
      { label: "Publish your website to GitHub Pages", slug: "/guide/publish-website/" },
      { label: "Style with CSS", slug: "/guide/css/" },
      { label: "Introducing JavaScript", slug: "/guide/javascript/" },
    ],
  }, {
    label: "Static site generation (SSG)",
    contents: [
      { label: "Client-side vs server-side JavaScript, SPA vs MPA", slug: "/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/" },
      { label: "Server-side components and routing", slug: "/guide/server-side-components-and-routing/" },
      { label: "A static blog from markdown files", slug: "/guide/static-blog-from-markdown-files/" },
      { label: "Third-party packages", slug: "/guide/third-party-packages/" },
      { label: "Interactivity with JavaScript in the browser", slug: "/guide/interactivity-with-javascript-in-the-browser/" },
    ],
  }, {
    label: "Running a server (SSR)",
    contents: [
      { label: "URLs and HTTP", slug: "/guide/urls-http/" },
      { label: "Mastro as a server on the command line", slug: "/guide/cli-install/" },
      { label: "Deploy server or static site with CI/CD", slug: "/guide/deploy/" },
      { label: "Forms and REST APIs", slug: "/guide/forms-and-rest-apis/" },
      { label: "Bundling, pregenerating assets and caching", slug: "/guide/bundling-assets-caching/" },
      { label: "Web application architecture and the write-read-boundary", slug: "/guide/web-application-architecture-and-write-read-boundary/" },
    ],
  }],
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
