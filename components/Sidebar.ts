import { html } from "@mastrojs/mastro";
import type { SidebarItem } from "../routes/[...slug].server.ts";
import { Toc } from "./Toc.ts";

export const Sidebar = (
  sidebar: SidebarItem[],
  currentPart: SidebarItem | undefined,
  currentPath: string,
) =>
  currentPart && html`
    <script type="module">
    const onChange = () =>
      document.querySelector(".sidebar").open = window.innerWidth > 1000;
    matchMedia("(min-width: 1000px)").addEventListener("change", onChange);
    onChange();
    </script>
    <details class="sidebar">
      <summary>Menu</summary>
      <nav>
        <ul>
          ${sidebar.map((part) =>
            html`
              <li>
                <details ${part.slug === currentPart.slug ? "open" : ""}>
                  <summary>${part.label}</summary>
                  ${Toc({
                    contents: part.contents,
                    currentPath,
                  })}
                </details>
              </li>
            `
          )}
        </ul>
      </nav>
    </details>
  `;
