import { html } from "@mastrojs/mastro";
import type { SidebarItem } from "../routes/[...slug].server.ts";

interface Props {
  contents: SidebarItem[];
}

export const Toc = (props: Props) =>
  html`
    <ol>
      ${props.contents.map((ch) => html`
        <li><a href="${ch.slug}">${ch.label}</a></li>
      `)}
    </ol>
  `
