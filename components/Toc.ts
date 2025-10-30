import { html } from "@mastrojs/mastro";
import type { SidebarItem } from "../routes/[...slug].server.ts";

interface Props {
  contents: SidebarItem[];
  currentPath?: string;
}

export const Toc = (props: Props) =>
  html`
    <ol>
      ${props.contents.map((chapter) => html`
        <li>
          <a href=${chapter.slug} ${chapter.slug === props.currentPath
            ? "aria-current=page"
            : ""}>
            ${chapter.label}
          </a>
        </li>
      `)}
    </ol>
  `
