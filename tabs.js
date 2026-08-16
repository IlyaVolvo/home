(function () {
  const root = document.querySelector("[data-tabs]");
  if (!root) return;

  const tablist = root.querySelector(".tabs");
  const tabs = [...root.querySelectorAll(".tabs [data-tab]")];
  const panels = [...root.querySelectorAll("section[data-tab]")];
  if (!tablist || tabs.length === 0) return;

  function activate(id, updateHash) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.tab === id;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.tab !== id;
    });
    if (updateHash) {
      history.replaceState(null, "", "#" + id);
    }
  }

  function idFromHash() {
    const hash = location.hash.slice(1);
    return tabs.some((tab) => tab.dataset.tab === hash)
      ? hash
      : tabs[0].dataset.tab;
  }

  tablist.setAttribute("role", "tablist");
  tabs.forEach((tab) => {
    const id = tab.dataset.tab;
    tab.setAttribute("role", "tab");
    tab.id = "tab-" + id;
    tab.setAttribute("aria-controls", id);
  });
  panels.forEach((panel) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", "tab-" + panel.dataset.tab);
  });

  root.classList.add("is-enhanced");
  activate(idFromHash(), false);

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      activate(tab.dataset.tab, true);
    });
    tab.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(tab);
      let next = -1;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") {
        next = (index - 1 + tabs.length) % tabs.length;
      }
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next < 0) return;
      event.preventDefault();
      tabs[next].focus();
      activate(tabs[next].dataset.tab, true);
    });
  });

  window.addEventListener("hashchange", () => activate(idFromHash(), false));
})();
