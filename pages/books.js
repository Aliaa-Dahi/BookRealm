import createBooksGrid from "../componenets/BooksContainer/books-container.js";
import Pagination, { attachPaginationEvents } from "../componenets/Pagination/pagination.js";
import BookCountBadge from "../componenets/BookCountBadge/book-count-badge.js";
import SearchInput from "../componenets/SearchInput/search-input.js";
import BookDetails from "../componenets/BookDetails/book-details.js";
/**
 * Strategy Pattern for fetching books from Open Library.
 * To add a new way to fetch books:
 * 1. Add the fetch function to `fetchStrategies` returning a unified format: `{ works, work_count }`.
 * 2. Update `getFetchStrategy` to detect the route/parameters and map it to your new strategy.
 */
const fetchStrategies = {
  // Fetch by Subject/Genre
  genre: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    // We use the search API here instead of the subjects API to get rating data
    const response = await fetch(`https://openlibrary.org/search.json?subject=${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`);
    const data = await response.json();
    
    // Normalize data format to consistent structure
    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : null
    }));

    return {
      works: works,
      work_count: data.numFound || 0
    };
  },

  // Fetch by Search Query (Keyword/Title/Author search)
  search: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`);
    const data = await response.json();
    
    // Normalize data format to consistent structure
    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : null
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
      edition_count: entry.revision || 0,
      rating: null
    }));

    return {
      works: works,
      work_count: data.size || 0
    };
  },

  // Fetch details for a single book by title (takes first result)
  bookDetails: async (param) => {
    const fields = 'key,title,author_name,cover_i,first_publish_year,edition_count,ratings_average,ratings_count,subject,publisher,language,number_of_pages_median';
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(param)}&limit=1&fields=${fields}`);
    const data = await response.json();

    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? parseFloat(doc.ratings_average.toFixed(1)) : null,
      ratings_count: doc.ratings_count || 0,
      subjects: doc.subject ? doc.subject.slice(0, 3) : [],
      publishers: doc.publisher ? doc.publisher.slice(0, 2) : [],
      languages: doc.language || [],
      pages: doc.number_of_pages_median || null
    }));

    return {
      works: works,
      work_count: data.numFound || 0
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

  // 3. Book Details Strategy (e.g., /books/harry-potter-and-the-philosophers-stone)
  //    Detected when pathParts[2] exists and is NOT a known genre keyword
  //    We distinguish it by checking whether it came from a BookCard click (data stored in slug form)
  if (pathParts[2] && pathParts[2] !== 'author') {
    const slug = pathParts[2];
    // If the slug looks like a book title (contains hyphens typical of multi-word titles)
    // and is not a single genre word — treat as book detail
    const isBookSlug = slug.includes('-');
    if (isBookSlug) {
      const titleFromSlug = slug.replace(/-/g, ' ');
      return {
        strategy: 'bookDetails',
        param: titleFromSlug,
        displayName: titleFromSlug.replace(/\b\w/g, c => c.toUpperCase())
      };
    }

    // 4. Genre Strategy (e.g., /books/fantasy — single word slugs)
    const genre = slug;
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

  // ── Book Details page ────────────────────────────────────────────────────
  if (strategy === 'bookDetails') {
    // Show a spinner while the API call is pending
    container.innerHTML = `
      <div class="text-center w-100 my-5 pt-5">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    fetchStrategies.bookDetails(param).then(data => {
      const book = (data.works || [])[0] || null;
      if (book) {
        container.innerHTML = BookDetails(book);
      } else {
        container.innerHTML = `<div class="container mt-5 pt-5"><p class="text-muted inter">Book not found.</p></div>`;
      }
    }).catch(() => {
      container.innerHTML = `<div class="container mt-5 pt-5"><p class="text-danger inter">Failed to load book details.</p></div>`;
    });
    return;
  }

  const fetchFn = fetchStrategies[strategy];
  
  // const paginationHTML = Pagination();

  container.innerHTML = `
      <div class="books-page container mt-5 pt-5">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 border-bottom pb-3">
              <h2 class="playfair playfair-800 section-title mb-0">${displayName}</h1>
              <span class="inter inter-500 total-count-badge count-badge"></span>
          </div>
          ${SearchInput()}
          <div class="books-grid-wrapper"></div>

          <div class="pagination-holder"></div>
         
      </div>
  `;

  const booksGridWrapper = container.querySelector(".books-grid-wrapper");
  const totalCountBadge = container.querySelector(".total-count-badge");
  totalCountBadge.innerHTML = BookCountBadge(0, 0, 0); // initial placeholder while loading

  // Active strategy — can be overridden at runtime by the search input
  let activeFetchFn = fetchFn;
  let activeParam   = param;

  let currentPage = 1;
  const limit = 20;
  let totalWorks = 0;

  async function fetchByPage(pageNumber) {
      // Show loading spinner
      booksGridWrapper.innerHTML = `
          <div class="text-center w-100 my-5">
              <div class="spinner-border text-secondary" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>
          </div>
      `;

      try {
          const currentOffset = (pageNumber - 1) * limit;
          // Call the ACTIVE strategy (may be overridden by search input)
          const data = await activeFetchFn(activeParam, limit, currentOffset);
          const works = data.works || [];
          totalWorks = data.work_count || 0;

          // Render only the books for the current page
          booksGridWrapper.innerHTML = createBooksGrid(works);
          
          // Update total badge count
          const startNum = works.length > 0 ? (pageNumber - 1) * limit + 1 : 0;
          const endNum = Math.min(pageNumber * limit, totalWorks);
          totalCountBadge.innerHTML = BookCountBadge(startNum, endNum, totalWorks);

          // Re-render pagination every time: updates sliding window + active/disabled state
          if (totalWorks > 0) {
              const paginationHolder = container.querySelector(".pagination-holder");
              const totalPageNumber = Math.ceil(totalWorks / limit);
              paginationHolder.innerHTML = Pagination(totalPageNumber, pageNumber);
              attachPaginationEvents(paginationHolder, {
                  currentPage: pageNumber,
                  totalWorks,
                  limit,
                  onPageChange: (targetPage) => {
                      currentPage = targetPage;
                      fetchByPage(currentPage);
                  }
              });
          }
      }
      catch (error) {
          console.error("Error loading books with strategy:", strategy, error);
          booksGridWrapper.innerHTML = `
              <div class="alert alert-danger d-inline-block">
                  Failed to load books. <button class="btn btn-link p-0 text-danger retry-btn align-baseline">Retry</button>
              </div>
          `;
          const retryBtn = booksGridWrapper.querySelector(".retry-btn");
          if (retryBtn) {
              retryBtn.addEventListener("click", () => fetchByPage(pageNumber));
          }
      }
  }

  // Initial load call
  if (booksGridWrapper && fetchFn) {
      fetchByPage(1);
  }

  // ── Search Input ───────────────────────────────────────────────────────────
  // Attach a debounced listener to the SearchInput rendered above the grid.
  // Typing triggers a live API search; clearing reverts to the original strategy.
  const searchEl = container.querySelector('.search-element');
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      if (query.length === 0) {
        // Revert to the original URL-based strategy
        activeFetchFn = fetchFn;
        activeParam   = param;
      } else if (query.length < 3) {
        // Too short — avoid 422 from the API
        return;
      } else {
        // Switch to search strategy with the typed query
        activeFetchFn = fetchStrategies.search;
        activeParam   = query;
      }

      // Reset to page 1 whenever the query changes
      currentPage = 1;
      fetchByPage(1);
    });
  }
}