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
const searchBtn = document.querySelector("#searchBtn");
const popover = document.querySelector("#searchBtn + search[popover]");
const searchInput = document.querySelector("#searchBtn + search > input");
const h2 = popover.querySelector("h2");
const ul = popover.querySelector("ul");
if (searchInput && popover && ul) {
  searchInput.value = "";
  const getPart = (url) => {
    const part = url.split("/")[1];
    return part
      ? part[0].toUpperCase() + part.slice(1) + ": "
      : "";
  }
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
        <a href="${url}">${getPart(url) + meta.title}</a>
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
  searchBtn.addEventListener("click", () => {
    popover.showPopover();
    searchInput.focus();
    // using pagefind@1.0.4 because of https://github.com/Pagefind/pagefind/issues/729
    pagefindP = import("/pagefind/pagefind.js");
    pagefindP.then(p => p.init());
  });
  popover.querySelector("button").addEventListener("click", () => {
    popover.hidePopover();
  });
  searchInput.addEventListener("input", async () => {
    const { value } = searchInput;
    const search = await pagefindP.then(p => p.debouncedSearch(value));
    if (!search) {
      // debounce detected subsequent call was already made
      return;
    }
    const { results } = search;
    if (results?.length) {
      h2.style.display = "block";
      ul.innerHTML = "";
      appendResults(ul, results.slice(0, 10));
    } else if (value) {
      ul.innerHTML = "<li>No results.</li>";
    } else {
      h2.style.display = "none";
      ul.innerHTML = "";
    }
  });

  document.addEventListener("keyup", e => {
    const { activeElement } = document;
    const firstItem = popover.querySelector("a");
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
