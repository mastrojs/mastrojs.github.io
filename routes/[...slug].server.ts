import { Layout } from "../components/Layout.ts";
import { Newsletter } from "../components/Newsletter.ts";
import { Sidebar } from "../components/Sidebar.ts";
import { Toc } from "../components/Toc.ts";
import { fmtIsoDate } from "../helpers/date.ts";
import { serveMarkdownFolder } from "@mastrojs/markdown";
import { html, htmlToResponse, unsafeInnerHtml } from "@mastrojs/mastro";
import { mdToHtml } from "../helpers/markdown.ts";

export interface SidebarItem {
  label: string;
  contents?: SidebarItem[];
  slug?: string;
};

export const { GET, getStaticPaths } = serveMarkdownFolder({
  folder: "data",
  mdToHtml,
}, ({ content, meta }, req) => {
  const { pathname } = new URL(req.url);
  const pathSegments = pathname.split("/");
  const isBlog = pathSegments[1] === "blog";

  const part = sidebar.find((part) => part.slug === `/${pathSegments[1]}/`);
  const contents = part?.contents;
  const flattened = contents && contents.some(item => "contents" in item)
    ? contents.flatMap((item) => "contents" in item ? item.contents : [])
    : contents;
  const { prev, next } = getPrevNext(flattened, pathname);

  const { title, date } = meta;
  if (!title) throw Error(`No title in ${pathname}`);
  return htmlToResponse(
    Layout({
      title: meta.metaTitle || (title ? `${title} | Mastro ${pageTitlePrefix(pathname)}` : "Mastro"),
      description: meta.description,
      canonical: meta.canonical,
      ogImage: `https://mastrojs.github.io${pathname}og.png`,
      children: html`
        ${Sidebar(sidebar, part, pathname)}

        <main ${meta.layout === "hero" ? `class=hero` : (isBlog ? "" : "data-pagefind-body")}>
          <h1>${meta.titleIsHtml ? unsafeInnerHtml(title) : title}</h1>

          ${isBlog && date
            ? html`<p>${meta.author} on ${fmtIsoDate(date)}</p>`
            : ""}

          ${content}

          ${(pathSegments.length === 3) && contents
            ? Toc({ contents })
            : ""}

          ${["/", "/guide/"].includes(pathname) || isBlog
            ? Newsletter()
            : ""}
          ${pathname === "/" ? html`
            <section class="center-text">
              <p><em>This is the end of the page. Yet it may be the beginning of your journey with Mastro.</em></p>
              <p>
                <a class="button" href="https://github.dev/mastrojs/template-basic">Try online with GitHub</a>
                <a class="button -secondary" href="/docs/">Get started</a>
              </p>
            </section>
            ` : ""}
          ${isBlog
            ? html`
                <section class="center-text">
                  <p><em>This is the end of the page. Yet it may be the beginning of your journey with Mastro.</em></p>
                  <p><a href="/" class="button">Discover Mastro →</a></p>
                </section>
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
});

export const pageTitlePrefix = (path: string) => {
  const segments = path.split("/");
  if (segments.length > 2) {
    const part = segments[1];
    return part
      ? (part[0].toUpperCase() + part.slice(1))
      : "";
  } else {
    return "";
  }
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
      { label: "Client-side vs server-side JavaScript, SSG vs SSR, SPA vs MPA", slug: "/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/" },
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
      { label: "Bundling and pregenerating assets", slug: "/guide/bundling-assets/" },
      { label: "Web application architectures", slug: "/guide/web-application-architectures/" },
    ],
  }],
}, {
  label: "Docs",
  slug: "/docs/",
  contents: [
    { label: "Routing", slug: "/docs/routing/" },
    { label: "Components and HTML", slug: "/docs/html-components/" },
    { label: "Installation and setup", slug: "/docs/install-setup/" },
    { label: "Next steps & getting help", slug: "/docs/next-steps-and-help/" },
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
