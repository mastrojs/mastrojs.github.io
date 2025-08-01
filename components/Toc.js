import { html } from "mastro";

export const Toc = (props) =>
  html`
    <ol>
      ${props.contents.map((ch) => html`
        <li><a href="${ch.slug}">${ch.label}</a></li>
      `)}
    </ol>
  `
