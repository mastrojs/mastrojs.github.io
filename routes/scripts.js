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
        if (search.results?.length) {
          search.results.forEach(async r => {
            const { meta, url, excerpt } = await r.data();
            const li = document.createElement("li");
            li.innerHTML = '<a href="' + url + '">' + meta.title + '</a>' +
              '<div>' + excerpt + '</div>';
            ul.append(li);
          });
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
