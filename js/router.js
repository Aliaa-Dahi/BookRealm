export function navigate(path, onRouteMatch) {
  window.history.pushState({}, "", path);
  onRouteMatch();
}

export function initRouter(onRouteMatch) {
  // 1. Intercept standard link clicks
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      
      // Intercept only internal root-relative links (e.g. starting with '/')
      // Skip external links (starting with http) or fragment links (starting with #)
      if (href && href.startsWith("/") && !href.startsWith("//")) {
        e.preventDefault();
        navigate(href, onRouteMatch);
      }
    }
  });

  // 2. Listen for back/forward browser navigation
  window.addEventListener("popstate", onRouteMatch);

  // 3. Run the UI update callback once initially on page load
  onRouteMatch();
}
