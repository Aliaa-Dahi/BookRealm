import { createGenresGrid, attachGenreClickListener } from "../componenets/GeneresContainer/generes-container.js";
import createBooksGrid from "../componenets/BooksContainer/books-container.js";
import { generes } from "./geners.js";

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
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title playfair playfair-700">Common Geners</h2>
            <a href="/geners" class="inter inter-600 text-dark">
              View All <i class="fa-solid fa-arrow-right ms-2"></i>
            </a>
          </div>
          <div class="home-generes-container"></div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="pt-3">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title playfair playfair-700">Popular Books</h2>
            <a href="/books" class="inter inter-600 text-dark">
              View All <i class="fa-solid fa-arrow-right ms-2"></i>
            </a>
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
    // Show a loading spinner while fetching
    homeBooksWrapper.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
    
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

async function fetchTopRated() {
  try {
    const response = await fetch('https://openlibrary.org/search.json?q=dragon&sort=rating&limit=8');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    
    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? Number(doc.ratings_average).toFixed(1) : '4.5'
    }));

    return works;
  } catch (err) {
    console.warn("Primary book search failed or reset, using subject fallback endpoint:", err);
    try {
      const fallbackResponse = await fetch('https://openlibrary.org/subjects/fantasy.json?limit=8');
      const fallbackData = await fallbackResponse.json();
      return (fallbackData.works || []).map(work => ({
        key: work.key,
        title: work.title,
        cover_id: work.cover_id || null,
        author_name: work.authors ? work.authors.map(a => a.name).join(', ') : 'Unknown Author',
        first_publish_year: work.first_publish_year || 'N/A',
        edition_count: work.edition_count || 0,
        rating: '4.5'
      }));
    } catch (fallbackErr) {
      console.error("Fallback fetch also failed:", fallbackErr);
      throw fallbackErr;
    }
  }
}
