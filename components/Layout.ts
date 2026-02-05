import { html, type Html } from "@mastrojs/mastro";

interface Props {
  canonical?: string;
  children: Html;
  description?: string;
  ogImage: string;
  title?: string;
}

export const Layout = (props: Props) =>
  html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <title>${props.title}</title>
        <link rel="stylesheet" href="/styles/styles.css">
        <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
        ${props.canonical && html`
          <link rel="canonical" href="${props.canonical}">
        `}
        <meta name="description" content="${props.description || "A minimal tool to build content-driven websites"}">
        <meta property="og:image" content=${props.ogImage}>
        <script type="module" src="/scripts.js"></script>
        <script
          data-goatcounter="https://mastrojs.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        ></script>
        <link rel="alternate" type="application/atom+xml" href="/feed.xml">
      </head>
      <body>
        <header>
          <a href="/">Mastro 👨‍🍳</a>
          <a href="/docs/" class="headerLink">Docs</a>

          <button class="-minimal" id="searchBtn">
            <svg width="20" height="20" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
              <title>Search</title>
              <path stroke-width="2" stroke="currentColor" d="m16.1507,15.85658l6.04878,6.04878l-6.04878,-6.04878za7.533,7.533 0 1 1 -10.653,-10.653a7.533,7.533 0 0 1 10.653,10.653" stroke-linejoin="round" stroke-linecap="round" fill="none" />
            </svg>
            <span>Search</span>
          </button>
          <search popover>
            <input type="search" placeholder="Search docs" aria-label="Search">
            <h2 tabindex="-1" style="display: none;">Search results</h2>
            <button class="-minimal" aria-label="Close search results">✕</button>
            <ul></ul>
          </search>

          <div>
            <a href="/blog/" class="headerLink">Blog</a>
            <a href="/docs/next-steps-and-help/#community-%26-getting-help" class="headerLink hide-mobile">Community</a>
            <a class="hide-mobile-xs" href="https://github.com/mastrojs/mastro" rel="me">
              <svg role="img" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <title>GitHub</title>
                <path
                  d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"
                >
                </path>
              </svg>
            </a>
            &nbsp;
            <a class="hide-mobile-xs" href="https://discord.gg/gmw2VEW5Rw" rel="me">
              <svg role="img" width="20" height="20" viewBox="5 4 22 22">
                <title>Discord</title>
                <path fill="none" stroke="currentColor"
                  d="M2 11.6c0-3.36 0-5.04.654-6.324a6 6 0 0 1 2.622-2.622C6.56 2 8.24 2 11.6 2h8.8c3.36 0 5.04 0 6.324.654a6 6 0 0 1 2.622 2.622C30 6.56 30 8.24 30 11.6v8.8c0 3.36 0 5.04-.654 6.324a6 6 0 0 1-2.622 2.622C25.44 30 23.76 30 20.4 30h-8.8c-3.36 0-5.04 0-6.324-.654a6 6 0 0 1-2.622-2.622C2 25.44 2 23.76 2 20.4z"/><path fill="#5865f2" d="M23.636 9.34A18.8 18.8 0 0 0 19.097 8c-.195.332-.424.779-.581 1.134a17.7 17.7 0 0 0-5.03 0A12 12 0 0 0 12.897 8a18.7 18.7 0 0 0-4.542 1.343c-2.872 4.078-3.65 8.055-3.262 11.975a18.6 18.6 0 0 0 5.567 2.68c.448-.58.848-1.195 1.192-1.844a12 12 0 0 1-1.877-.859 9 9 0 0 0 .46-.342c3.62 1.59 7.553 1.59 11.13 0q.225.178.46.342c-.595.337-1.225.626-1.88.86q.516.974 1.191 1.845a18.6 18.6 0 0 0 5.57-2.682c.457-4.544-.78-8.484-3.27-11.978m-11.29 9.567c-1.087 0-1.978-.953-1.978-2.113s.872-2.116 1.977-2.116c1.106 0 1.997.953 1.978 2.116.002 1.16-.872 2.113-1.978 2.113m7.308 0c-1.086 0-1.977-.953-1.977-2.113s.872-2.116 1.977-2.116c1.106 0 1.997.953 1.978 2.116 0 1.16-.872 2.113-1.978 2.113"
                  >
                </path>
              </svg>
            </a>
            &nbsp;
            <a href="https://bsky.app/profile/mastrojs.bsky.social" rel="me">
              <svg role="img" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <title>Bluesky</title>
                <path
                  d="M12 10.8c-1-2.1-4-6-6.8-8C2.6 1 1.6 1.3.9 1.6.1 1.9 0 3 0 3.8c0 .7.4 5.6.6 6.4C1.4 13 4.3 14 7 13.6h.4H7c-4 .6-7.4 2-2.8 7 5 5.3 6.8-1 7.8-4.2 1 3.2 2 9.3 7.7 4.3 4.3-4.3 1.2-6.5-2.7-7a9 9 0 0 1-.4-.1h.4c2.7.3 5.6-.6 6.4-3.4.2-.8.6-5.7.6-6.4 0-.7-.1-1.9-.9-2.2-.7-.3-1.7-.7-4.3 1.2-2.8 2-5.7 5.9-6.8 8"
                >
                </path>
              </svg>
            </a>
          </div>
        </header>

        ${props.children}

      </body>
    </html>
  `;
