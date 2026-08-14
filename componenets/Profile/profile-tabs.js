import createBooksGrid from "../BooksContainer/books-container.js";
import { renderBookCardSkeleton } from "../BookCard/book-card.js";
import { getFavorites, getReadList } from "../../services/list.service.js";
import { fetchBooksByIds } from "../../services/book.service.js";

function renderSkeletonGrid(count = 4) {
    return `
        <div class="row g-4">
            ${Array(count).fill(0).map(() => renderBookCardSkeleton()).join('')}
        </div>
    `;
}

/**
 * Returns HTML for an empty list state.
 */
function renderEmptyListState(title, description, iconClass = "fa-regular fa-bookmark") {
    return `
        <div class="text-center py-5 rounded-4 shadow-sm my-3 border" style="background-color: var(--light-paper); border-color: var(--paper-line) !important;">
            <i class="${iconClass} fs-1 mb-3" style="color: var(--secondary);"></i>
            <h5 class="playfair playfair-700 fs-4 mb-2" style="color: var(--primary);">${title} is Empty</h5>
            <p class="inter text-muted mb-3 fs-6" style="max-width: 420px; margin: 0 auto;">${description}</p>
            <a href="/books" class="btn sub-btn btn-sm d-inline-flex align-items-center gap-2">
                <i class="fa-solid fa-compass"></i> Discover Books
            </a>
        </div>
    `;
}

export async function loadFavoritesSection(containerEl) {
    if (!containerEl) return;

    const favList = getFavorites();
    const books = favList?.books || [];

    if (books.length === 0) {
        containerEl.innerHTML = renderEmptyListState(
            "Your Favorites List",
            favList?.description || "You haven't added any favorite books yet. Click the heart icon on any book to add it to your favorites!",
            "fa-regular fa-heart"
        );
        return;
    }

    // Render skeleton while fetching
    containerEl.innerHTML = renderSkeletonGrid(Math.min(books.length, 4));

    try {
        const fetchedBooks = await fetchBooksByIds(books);
        if (fetchedBooks.length === 0) {
            containerEl.innerHTML = renderEmptyListState(
                "Your Favorites List",
                "No details found for your favorite books.",
                "fa-regular fa-heart"
            );
        } else {
            containerEl.innerHTML = createBooksGrid(fetchedBooks);
        }
    } catch (e) {
        console.error("Error loading favorites section:", e);
        containerEl.innerHTML = `<div class="alert alert-warning">Unable to load favorite books at this time.</div>`;
    }
}

/**
 * Renders the Watchlist (readList) section dynamically into the specified container element.
 *
 * @param {HTMLElement} containerEl
 */
export async function loadWatchlistSection(containerEl) {
    if (!containerEl) return;

    const readList = getReadList();
    const books = readList?.books || [];

    if (books.length === 0) {
        containerEl.innerHTML = renderEmptyListState(
            "Your Watchlist",
            readList?.description || "Your Watchlist is empty. Click the eye icon on any book card to add books you want to read!",
            "fa-regular fa-eye"
        );
        return;
    }

    // Render skeleton while fetching
    containerEl.innerHTML = renderSkeletonGrid(Math.min(books.length, 4));

    try {
        const fetchedBooks = await fetchBooksByIds(books);
        if (fetchedBooks.length === 0) {
            containerEl.innerHTML = renderEmptyListState(
                "Your Watchlist",
                "No details found for your watchlist books.",
                "fa-regular fa-eye"
            );
        } else {
            containerEl.innerHTML = createBooksGrid(fetchedBooks);
        }
    } catch (e) {
        console.error("Error loading watchlist section:", e);
        containerEl.innerHTML = `<div class="alert alert-warning">Unable to load Watchlist books at this time.</div>`;
    }
}
