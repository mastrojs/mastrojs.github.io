import { html } from "@mastrojs/mastro";

interface Props {
  pathname: string;
}

export const BlogFooter = (props?: Props) =>
  html`
    <footer class="blog-footer">
      <h2>Mastro 👨‍🍳</h2>
      <p>
        No dependencies. No build step.<br>
        Just a simple web framework.
      </p>
      <p>
        ${props?.pathname === "/"
          ? html`<a href="/docs/getting-started/" class="button">Get started →</a>`
          : html`<a href="/" class="button">Discover Mastro →</a>`}
      </p>
    </footer>`
