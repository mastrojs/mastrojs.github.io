import { html } from "mastro";

export const Sidebar = (sidebar, currentPart, currentPath) =>
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
                  <ul>
                    ${part.contents?.map((chapter) =>
                      html`
                        <li>
                          <a href="${chapter.slug}" ${chapter.slug === currentPath
                            ? "aria-current=page"
                            : ""}>
                            ${chapter.label}
                          </a>
                        </li>
                      `
                    )}
                  </ul>
                </details>
              </li>
            `
          )}
        </ul>
      </nav>
    </details>
  `;
