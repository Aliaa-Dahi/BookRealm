import { createGenresGrid, attachGenreClickListener } from "../components/GenresContainer/generes-container.js";
import createBooksGrid from "../components/BooksContainer/books-container.js";
import { createSkeletonGrid } from "../components/BookCard/book-card-skeleton.js";
import ViewAll from "../components/ViewAll/view-all.js";
import { generes } from "./genres.js";
import { fetchTopRated } from "../services/book.service.js";

export function renderHome(container) {
  container.innerHTML = `
    <!-- Hero -->
    <section class="hero">
      <div class="overlay d-flex flex-column justify-content-center align-items-center top-0 start-0 end-0 bottom-0">
        <div class="hero-content d-flex flex-column text-center">
          <h1 class="hero-title m-0">
            <img src="/images/logo.png" alt="BookRealm" class="hero-logo-img" />
          </h1>
          <p class="lead inter inter-300">
            A sanctuary for curious minds. Discover over 4 million records
            from the world's greatest archives, meticulously curated for the
            modern reader.
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
            <button class="btn main-btn d-inline-flex align-items-center gap-2">
              <i class="fa-solid fa-search"></i>
              Start Discovery
            </button>
            <button class="btn sub-btn d-inline-flex align-items-center gap-2">Browse Genres</button>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="pt-3">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title d-inline-block playfair playfair-700">Common Geners</h2>
            ${ViewAll("/geners", "View All")}
          </div>
          <div class="home-generes-container"></div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="pt-3">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title d-inline-block playfair playfair-700">Popular Books</h2>
            ${ViewAll("/books", "View All")}
          </div>
          <div class="home-books-container"></div>
        </div>
      </div>
    </section>
  `;

  const homeGenresWrapper = container.querySelector(".home-generes-container");
  if (homeGenresWrapper) {
    homeGenresWrapper.innerHTML = createGenresGrid(generes, 8);
    attachGenreClickListener(homeGenresWrapper);
  }

  const homeBooksWrapper = container.querySelector(".home-books-container");
  if (homeBooksWrapper) {
    // Show shimmer skeleton cards while fetching
    homeBooksWrapper.innerHTML = createSkeletonGrid(8);
    
    fetchTopRated()
      .then(booksArray => {
        homeBooksWrapper.innerHTML = createBooksGrid(booksArray);
      })
      .catch(error => {
        console.error("Error loading top rated books:", error);
        homeBooksWrapper.innerHTML = `
          <div class="alert alert-danger" role="alert">
            Failed to load books. Please try again later.
          </div>
        `;
      });
  }
}

