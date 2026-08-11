import createBooksGrid from "../componenets/BooksContainer/books-container.js";
import Pagination, { attachPaginationEvents } from "../componenets/Pagination/pagination.js";
import BookCountBadge from "../componenets/BookCountBadge/book-count-badge.js";
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
  
  // const paginationHTML = Pagination();

  container.innerHTML = `
      <div class="books-page container mt-5 pt-5">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 border-bottom pb-3">
              <h1 class="playfair playfair-800 section-title mb-0">${displayName}</h1>
              <span class="inter inter-500 total-count-badge count-badge"></span>
          </div>
          <div class="books-grid-wrapper"></div>
          <div class="pagination-holder"></div>
         
      </div>
  `;

  const booksGridWrapper = container.querySelector(".books-grid-wrapper");
  const totalCountBadge = container.querySelector(".total-count-badge");
  totalCountBadge.innerHTML = BookCountBadge(0, 0, 0); // initial placeholder while loading

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
          // Call the selected strategy dynamically with calculated offset
          const data = await fetchFn(param, limit, currentOffset); 
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
}