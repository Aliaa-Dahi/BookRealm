import { createGenresGrid } from "../componenets/GeneresContainer/generes-container.js";

export function renderHome(container) {
  container.innerHTML = `
    <!-- Hero -->
    <section class="hero">
      <div class="overlay">
        <div class="hero-content">
          <h1 class="playfair playfair-900">BookRealm</h1>
          <p class="lead inter inter-300">
            A sanctuary for curious minds. Discover over 4 million records
            from the world's greatest archives, meticulously curated for the
            modern reader.
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
            <button class="main-btn relative">
              Start Discovery
              <i class="fa-solid fa-search"></i>
            </button>
            <button class="sub-btn">Browse Genres</button>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="pt-3">
          <div class="view-all d-flex justify-content-end mb-2">
            <a href="/geners" class="inter inter-600 text-dark">
              View All <i class="fa-solid fa-arrow-right ms-2"></i>
            </a>
          </div>
          <div class="home-generes-container"></div>
        </div>
      </div>
    </section>
  `;

  // Initialize genres list in the home page
  const homeGenresWrapper = container.querySelector(".home-generes-container");
  if (homeGenresWrapper) {
    homeGenresWrapper.innerHTML = createGenresGrid(8  );
  }
}
