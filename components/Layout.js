import { html } from "mastro";

export const Layout = (props) =>
  html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <title>${props.title}</title>
        <link rel="stylesheet" href="/styles/styles.css">
        <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
        ${props.description && html`
          <meta name="description" content="${props.description}">
        `}
        <meta property="og:image" content="/assets/og.png">
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

          <search>
            <input type="search" placeholder="Search" aria-label="Search">
            <div popover>
              <h2 tabindex="-1">Search results</h2>
              <button class="-minimal" aria-label="Close search results">✕</button>
              <ul></ul>
            </div>
          </search>

          <div>
            <a href="https://github.com/mastrojs/mastro" rel="me">
              <svg role="img" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <title>GitHub</title>
                <path
                  d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"
                >
                </path>
              </svg></a>
            &nbsp;
            <a href="https://bsky.app/profile/mastrojs.bsky.social" rel="me">
              <svg role="img" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
