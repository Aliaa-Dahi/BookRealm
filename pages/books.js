import createBooksGrid from "../componenets/BooksContainer/books-container.js";
import { createSkeletonGrid } from "../componenets/BookCard/book-card-skeleton.js";
import Pagination, { attachPaginationEvents } from "../componenets/Pagination/pagination.js";
import BookCountBadge from "../componenets/BookCountBadge/book-count-badge.js";
import SearchInput from "../componenets/SearchInput/search-input.js";
import BookDetails from "../componenets/BookDetails/book-details.js";
import { fetchStrategies, getFetchStrategy } from "../services/book.service.js";

export function renderBooks(container) {
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
  const totalCountBadge  = container.querySelector(".total-count-badge");
  totalCountBadge.innerHTML = BookCountBadge(0, 0, 0); // initial placeholder while loading

  // Active strategy — can be overridden at runtime by the search input
  let activeFetchFn = fetchFn;
  let activeParam   = param;

  let currentPage = 1;
  const limit = 20;
  let totalWorks = 0;

  async function fetchByPage(pageNumber) {
      // Show shimmer skeleton cards while loading
      booksGridWrapper.innerHTML = createSkeletonGrid(8);

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
  const searchEl = container.querySelector('.search-element');
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      if (query.length === 0) {
        // Revert to the original URL-based strategy
        activeFetchFn = fetchFn;
        activeParam   = param;
      } else if (query.length < 3) {
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