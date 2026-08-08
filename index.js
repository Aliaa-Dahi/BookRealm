// Libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";


// Custom Styles
import "./css/common.css";
import "./css/home.css";

// Components
import Nav, { updateActiveLink } from "./componenets/Nav/nav.js";
import { initRouter } from "./js/router.js";
import { renderHome } from "./pages/home.js";
import { renderGeners } from "./pages/geners.js";
import { renderBooks } from "./pages/books.js";

const navContainer = document.querySelector(".nav-container");
if (navContainer) {
  navContainer.innerHTML = Nav();
}

function showContent() {
  const currentPath = window.location.pathname;
  console.log("Current path:", currentPath);

  const app = document.getElementById("app");
  if (!app) return;

  if (currentPath === "/geners") {
    renderGeners(app);
  } else if (currentPath === "/books") {
    renderBooks(app);
  } else {
    renderHome(app);
  }

  // Update active state in nav links
  updateActiveLink();
}

// Start router
initRouter(showContent);
