import { createGenresGrid, attachGenreClickListener } from "../componenets/GeneresContainer/generes-container.js";

export function renderGeners(container) {
  container.innerHTML = `
    <div class="generes-page container mt-5 pt-5"></div>
  `;

  const genresPage = container.querySelector(".generes-page");
  if (genresPage) {
    genresPage.innerHTML = createGenresGrid();
    attachGenreClickListener(genresPage);
  }
}
