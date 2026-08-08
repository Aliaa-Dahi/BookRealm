import createBooksGrid from "../componenets/BooksContainer/books-container.js";
import Pagination from "../componenets/Pagination/pagination.js"
/**
 * Strategy Pattern for fetching books from Open Library.
 * To add a new way to fetch books:
 * 1. Add the fetch function to `fetchStrategies` returning a unified format: `{ works, work_count }`.
 * 2. Update `getFetchStrategy` to detect the route/parameters and map it to your new strategy.
 */
const fetchStrategies = {
  // Fetch by Subject/Genre
  genre: async (param, limit, offset) => {
    const response = await fetch(`https://openlibrary.org/subjects/${param}.json?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    // Normalize data format to consistent structure
    const works = (data.works || []).map(work => ({
      key: work.key,
      title: work.title,
      cover_id: work.cover_id || null,
      author_name: work.authors && work.authors.length > 0 ? work.authors.map(a => a.name).join(', ') : 'Unknown Author',
      first_publish_year: work.first_publish_year || 'N/A',
      edition_count: work.edition_count || 0
    }));

    return {
      works: works,
      work_count: data.work_count || 0
    };
  },

  // Fetch by Search Query (Keyword/Title/Author search)
  search: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(param)}&limit=${limit}&page=${page}`);
    const data = await response.json();
    
    // Normalize data format to consistent structure
    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0
    }));

    return {
      works: works,
      work_count: data.numFound || 0
    };
  },

  // Fetch by Author ID
  author: async (param, limit, offset) => {
    const response = await fetch(`https://openlibrary.org/authors/${param}/works.json?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    // Normalize data format to consistent structure
    const works = (data.entries || []).map(entry => ({
      key: entry.key,
      title: entry.title,
      cover_id: entry.covers ? entry.covers[0] : null,
      author_name: 'Author Works', // Fallback as author works api only returns titles/keys by default
      first_publish_year: entry.first_publish_year || (entry.created?.value ? new Date(entry.created.value).getFullYear() : 'N/A'),
      edition_count: entry.revision || 0
    }));

    return {
      works: works,
      work_count: data.size || 0
    };
  }
};

/**
 * Inspects the current URL path and query parameters to determine:
 * 1. Which fetch strategy to use.
 * 2. The parameter to pass to it.
 * 3. The user-friendly title to display.
 */
function getFetchStrategy() {
  const pathParts = location.pathname.split('/'); // e.g. ["", "books", "fantasy"]
  const queryParams = new URLSearchParams(window.location.search);

  // 1. Search Strategy (e.g., /books?q=harry)
  if (queryParams.has('q')) {
    const query = queryParams.get('q');
    return {
      strategy: 'search',
      param: query,
      displayName: `Search results for "${query}"`
    };
  }

  // 2. Author Strategy (e.g., /books/author/OL26320A)
  if (pathParts[2] === 'author' && pathParts[3]) {
    return {
      strategy: 'author',
      param: pathParts[3],
      displayName: 'Author Works'
    };
  }

  // 3. Genre Strategy (e.g., /books/fantasy)
  if (pathParts[2]) {
    const genre = pathParts[2];
    const formattedGenre = genre.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      strategy: 'genre',
      param: genre,
      displayName: `${formattedGenre} Collection`
    };
  }

  // 4. Default Fallback (All books)
  return {
    strategy: 'genre',
    param: 'books',
    displayName: 'All Books Collection'
  };
}

export function renderBooks(container){
  // Determine which strategy and parameter to use based on URL/Path
  const { strategy, param, displayName } = getFetchStrategy();
  const fetchFn = fetchStrategies[strategy];
  
  const paginationHTML = Pagination();

  container.innerHTML = `
      <div class="books-page container mt-5 pt-5">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 border-bottom pb-3">
              <h1 class="playfair playfair-800 section-title mb-0">${displayName}</h1>
              <span class="text-muted inter inter-500 total-count-badge"></span>
          </div>
          <div class="books-grid-wrapper"></div>
          ${paginationHTML}
         
          <div class="load-more-container text-center mt-5 mb-5"></div>
      </div>
  `;

  const booksGridWrapper = container.querySelector(".books-grid-wrapper");
  const loadMoreContainer = container.querySelector(".load-more-container");
  const totalCountBadge = container.querySelector(".total-count-badge");

  let allBooks = [];
  let offset = 0;
  const limit = 20;

//   Pagination
  let pagination = document.querySelector('#pag-nav')
  pagination.addEventListener("click", (e)=>{
    e.preventDefault();
    const page = e.target.textContent;
    console.log(page)
  })

  async function loadMoreBooks() {
      // Show loading spinner
      loadMoreContainer.innerHTML = `
          <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
      `;

      try {
          // Call the selected strategy dynamically
          const data = await fetchFn(param, limit, offset);
          const works = data.works || [];
          const totalWorks = data.work_count || 0;

          allBooks = [...allBooks, ...works];
          
          // Render or update the books grid
          booksGridWrapper.innerHTML = createBooksGrid(allBooks);
          
          // Update total badge count
          totalCountBadge.textContent = `Showing ${allBooks.length} of ${totalWorks} books`;

          // If there are more books, render "Load More" button
          if (allBooks.length < totalWorks && works.length > 0) {
              loadMoreContainer.innerHTML = `
                  <button class="sub-btn px-4 py-2 load-more-btn">
                      Load More Books
                  </button>
              `;
              const loadMoreBtn = loadMoreContainer.querySelector(".load-more-btn");
              loadMoreBtn.addEventListener("click", () => {
                  offset += limit;
                  loadMoreBooks();
              });
          } else {
              loadMoreContainer.innerHTML = `<p class="text-muted inter inter-500 mt-3">You've reached the end of the collection.</p>`;
          }
      } catch (error) {
          console.error("Error loading books with strategy:", strategy, error);
          loadMoreContainer.innerHTML = `
              <div class="alert alert-danger d-inline-block">
                  Failed to load books. <button class="btn btn-link p-0 text-danger retry-btn align-baseline">Retry</button>
              </div>
          `;
          const retryBtn = loadMoreContainer.querySelector(".retry-btn");
          if (retryBtn) {
              retryBtn.addEventListener("click", loadMoreBooks);
          }
      }
  }

  // Initial load call
  if (booksGridWrapper && fetchFn) {
      loadMoreBooks();
  }
}