// copy code buttons
document.querySelectorAll("figure > pre + button").forEach(btn =>
  btn.addEventListener("click", e => {
    const text = e.target.dataset.text || e.target.previousElementSibling.textContent.trimEnd();
    navigator.clipboard.writeText(text);
    const copied = e.target.parentElement.querySelector(".copied");
    if (copied) {
      copied.style.display = "block";
      setTimeout(() => copied.style.display = "none", 2000);
    }
  })
);

// search box
const searchInput = document.querySelector("search > input");
const popover = document.querySelector("search > [popover]");
const ul = popover.querySelector("ul");
if (searchInput && popover && ul) {
  searchInput.value = "";
  popover.addEventListener("beforetoggle", e => {
    if (e.newState === "closed") {
      searchInput.value = "";
    }
  });
  const appendResults = (ul, results) => {
    const lis = results.map(() => {
      // create lis in order
      const li = document.createElement("li");
      ul.append(li);
      return li;
    });
    results.forEach(async (r, i) => {
      // populate lis as soon as data arrives over the network
      const { meta, url, sub_results } = await r.data();
      lis[i].innerHTML = `
        <a href="${url}">${meta.title}</a>
        <ul>${sub_results.map(r =>
          `<li>
            ${r.url === url ? "" : `<a href="${r.url}">${r.title}</a>`}
            <p>${r.excerpt}</p>
          </li>`).join("")}
        </ul>
      `;
    });
  };
  let pagefindP;
  searchInput.addEventListener("focus", () => {
    // using pagefind@1.0.4 because of https://github.com/Pagefind/pagefind/issues/729
    pagefindP = import("/pagefind/pagefind.js");
    pagefindP.then(p => p.init());
  });
  popover.querySelector("button").addEventListener("click", () => popover.hidePopover())
  searchInput.addEventListener("input", async () => {
    const { value } = searchInput;
    if (value) {
      const search = await pagefindP.then(p => p.debouncedSearch(value));
      if (search) {
        ul.innerHTML = "";
        popover.showPopover();
        const { results } = search;
        if (results?.length) {
          appendResults(ul, results.slice(0, 10));
        } else {
          ul.innerHTML = "<li>No results.</li>";
        }
      }
    } else {
      popover.hidePopover();
    }
  });

  document.addEventListener("keyup", e => {
    const { activeElement } = document;
    const firstItem = popover.querySelector("a");
    const h2 = popover.querySelector("h2");
    if (activeElement === searchInput || activeElement === h2) {
      if (e.key === "Enter") {
        h2.focus();
      } else if (e.key === "ArrowDown") {
        firstItem?.focus();
      }
    } else if (activeElement?.parentElement?.parentElement === ul) {
      if (e.key === "ArrowUp") {
        if (activeElement === firstItem) {
          searchInput.focus()
        } else {
          activeElement.parentElement.previousElementSibling?.querySelector("a")?.focus();
        }
      } else if (e.key === "ArrowDown") {
        activeElement.parentElement.nextElementSibling?.querySelector("a")?.focus();
      }
    }
  });
}
