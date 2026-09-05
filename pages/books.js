import createBooksGrid from "../components/BooksContainer/books-container.js";
import { createSkeletonGrid } from "../components/BookCard/book-card-skeleton.js";
import Pagination, { attachPaginationEvents } from "../components/Pagination/pagination.js";
import BookCountBadge from "../components/BookCountBadge/book-count-badge.js";
import SearchInput from "../components/SearchInput/search-input.js";
import BookDetails from "../components/BookDetails/book-details.js";
import { BookDetailsSkeleton } from "../components/BookDetails/book-details-skeleton.js";
import { fetchStrategies, getFetchStrategy } from "../services/book.service.js";
import { renderNotFound } from "./not-found.js";

export function renderBooks(container) {
  // Determine which strategy and parameter to use based on URL/Path
  const { strategy, param, displayName } = getFetchStrategy();

  // ── Book Details page ────────────────────────────────────────────────────
  if (strategy === 'bookDetails') {
    // Show skeleton while the API call is pending
    container.innerHTML = BookDetailsSkeleton();

    fetchStrategies.bookDetails(param).then(data => {
      const book = (data.works || [])[0] || null;
      if (book) {
        container.innerHTML = BookDetails(book);
      } else {
        renderNotFound(container);
      }
    }).catch(() => {
      container.innerHTML = `
        <div class="container mt-5 pt-5 text-center">
          <i class="fa-solid fa-triangle-exclamation fa-2x text-secondary mb-3 d-block"></i>
          <p class="inter text-muted">Failed to load book details. Check your connection and try again.</p>
          <button class="btn nf-btn-primary inter mt-2" onclick="window.location.reload()">
            <i class="fa-solid fa-rotate-right me-2"></i>Retry
          </button>
        </div>`;
    });
    return;
  }

  const fetchFn = fetchStrategies[strategy];

  container.innerHTML = `
      <div class="books-page container mt-5 pt-5">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 border-bottom pb-3">
              <h2 class="playfair playfair-800 section-title d-inline-block mb-0">${displayName}</h2>
              <span class="inter inter-500 total-count-badge count-badge d-inline-flex align-items-center text-nowrap"></span>
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