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
            <a class="hide-mobile-xs" href="https://stt.gg/k7QMEaP1" rel="me">
              <svg role="img" width="18" height="18" viewBox="0 0 307 307" fill="currentColor">
                <title>Stoat Chat</title>
                <path
                  d="M49.249 265.73C19.266 237.782.504 197.948.504 153.767.504 69.295 69.084.716 153.555.716c84.472 0 153.051 68.58 153.051 153.05 0 70.3-47.498 129.592-112.124 147.508-14.343-21.075-27.344-40.273-17.624-71.87-11.859 6.052-19.313 17.957-21.569 30.9-4.413-6.935-9.312-13.624-14.987-19.583-14.447-15.17-34.143-25.778-43.258-45.478-4.164-9.305-7.017-22.607-3.719-32.235 2.38 18.687 11.471 35.88 27.754 45.836 12.412 7.588 26.32 8.838 40.241 11.774 14.512 3.058 37.561 9.954 51.701 7.463 11.755-2.067 36.42-15.05 35.761-29.13-.23-4.845-6.144-13.009-8.331-17.684-2.91-6.224-1.183-7.568-.85-13.811.935-17.672-3.731-26.402-12.315-40.954-10.41-17.651-21.835-28.317-41.622-35.482-18.083-6.55-45.913-2.842-46.125-2.541 3.656 4.007 7.02 8.697 7.491 14.247-7.412-6.856-14.582-14.143-22.882-19.955-18.359-12.852-29.858-11.64-37.156 10.714-3.804 11.647-6.68 27.475-3.154 39.388 2.138 7.216 6.577 13.088 11.632 18.503-9.891-1.348-15.887-9.94-18.068-19.252-24.517 53.03-29.976 78.674-28.153 133.606m181.873-50.782-.003-.003c-3.807.117-7.319-1.906-10.19-4.223-1.619-1.373-3.993-3.149-4.325-5.205-.658-4.094 2.602-7.02 4.544-8.235 1.666-1.038 3.691-1.617 5.603-2.059 4.359-1.007 8.884-1.94 13.274-1.087 1.314.256 2.619.68 3.7 1.47 1.08.785 1.92 1.974 2.065 3.304.107.987-.163 1.972-.489 2.908a25.2 25.2 0 0 1-3.117 6.061c-1.297 1.864-2.847 3.575-4.717 4.862-1.87 1.288-4.076 2.14-6.345 2.207m-65.042-60.126c15.053-2.04 16.888 21.271 2.366 22.25s-16.16-20.38-2.366-22.25m-50.717-46.278c1.39 3.313 4.254 5.52 6.728 7.951-5.616 1.704-11.284.077-16.214-2.748.292 5.207 4.148 9.8 7.035 13.458-4.76 1.092-8.967-.539-12.234-3.976-.048 4.84 1.6 9.06 3.974 13.153-9.284 4.618-13.292-5.095-13.766-12.696-.519-8.354 2.862-29.432 8.856-35.505 6.705-6.796 17.121 1.12 22.8 5.684 5.012 4.026 9.834 8.89 14.376 13.425-5.963 3.94-14.844 3.776-21.555 1.254m116.675 60.858c-3.282-5.707-4.286-7.367-6.195-11.5-1.3-2.814-1.957-6.152 2.751-6.251 8.541-.181 11.5 13.346 4.848 18.066a.976.976 0 0 1-1.404-.315m-5.611-54.458c2.423-33.31 2.14-54.868-28.753-24.63 11.66 5.423 21.466 14.075 28.753 24.63"
                  />
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
