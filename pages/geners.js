import { createGenresGrid, attachGenreClickListener } from "../componenets/GeneresContainer/generes-container.js";

export function renderGeners(container) {
  container.innerHTML = `
    <div class="generes-page container mt-5 pt-5">
      <div class="mb-4 border-bottom pb-3">
        <h1 class="playfair playfair-800 section-title mb-0">Browse Genres</h1>
      </div>
      <div class="genres-grid-container"></div>
    </div>
  `;

  const genresGridContainer = container.querySelector(".genres-grid-container");
  if (genresGridContainer) {
    genresGridContainer.innerHTML = createGenresGrid();
    attachGenreClickListener(genresGridContainer);
  }
}
