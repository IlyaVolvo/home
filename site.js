(function () {
  const views = [...document.querySelectorAll("[data-view]")];
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  const drop = document.querySelector(".nav-drop");
  if (views.length === 0) return;

  const ids = new Set(views.map((view) => view.dataset.view));
  const projectIds = new Set(["faultitude", "wordaholic", "spin-master"]);

  function idFromHash() {
    const hash = location.hash.slice(1);
    if (hash === "projects") return "faultitude";
    return ids.has(hash) ? hash : "about";
  }

  function show(id) {
    views.forEach((view) => {
      const on = view.dataset.view === id;
      view.hidden = !on;
      view.classList.toggle("is-on", on);
    });
    navLinks.forEach((link) => {
      link.setAttribute(
        "aria-current",
        link.dataset.nav === id ? "page" : "false"
      );
    });
    if (drop) {
      drop.classList.toggle("is-active", projectIds.has(id));
      drop.open = false;
    }
    if (location.hash.slice(1) !== id) {
      history.pushState(null, "", "#" + id);
    }
  }

  document.documentElement.classList.add("is-enhanced");
  show(idFromHash());

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (drop && drop.contains(link) && /^https?:/.test(link.getAttribute("href") || "")) {
      drop.open = false;
      return;
    }
    if (!link.getAttribute("href")?.startsWith("#")) return;
    const id = (link.dataset.nav || link.hash.slice(1) || "").replace(/^#/, "");
    if (!ids.has(id) && id !== "about" && id !== "contact") return;
    event.preventDefault();
    show(id === "projects" ? "faultitude" : id);
  });

  window.addEventListener("hashchange", () => show(idFromHash()));
  window.addEventListener("popstate", () => show(idFromHash()));
})();
