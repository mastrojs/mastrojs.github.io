import { type Html, html } from "@mastrojs/mastro";
import type { SidebarItem } from "../routes/[...slug].server.ts";

interface Props {
  contents?: SidebarItem[];
  currentPath?: string;
}

export const Toc = (props: Props): Html[] => {
  const { contents, currentPath } = props;
  return contents?.some(ch => ch.contents)
    ? html`
        <ol class="toc">
          ${contents.map((chapter) => html`
            <li>
              <div>${chapter.label}</div>
              ${Toc({
                contents: chapter.contents,
                currentPath,
              })}
            </li>
            `)}
          </ol>
        `
    : html`
        <ol>
          ${contents?.map((item) => html`
            <li>
              <a href=${item.slug} ${item.slug === currentPath
                ? "aria-current=page"
                : ""}>
                ${item.label}
              </a>
            </li>
          `)}
        </ol>
      `
}
