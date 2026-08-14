import createBooksGrid from "../BooksContainer/books-container.js";
import { createSkeletonGrid } from "../BookCard/book-card-skeleton.js";
import { getList } from "../../services/list.service.js";
import { fetchBooksByIds } from "../../services/book.service.js";

/**
 * Returns HTML string for an empty list state card.
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

/**
 * Generic function to load and render any list into a DOM container element.
 * Limits displayed items to options.limit (defaults to 4).
 *
 * @param {HTMLElement} containerEl - Target DOM container element
 * @param {string} listKey - The key identifier for the list
 * @param {Object} options - Optional display configuration ({ limit: 4, iconClass: "..." })
 */
export async function loadListSection(containerEl, listKey, options = {}) {
    if (!containerEl || !listKey) return;

    const limit = options.limit || 4;
    const listObj = getList(listKey);
    const books = listObj?.books || [];
    const listName = listObj?.name || options.title || listKey;
    const listDescription = listObj?.description || options.description || "This list is currently empty.";
    const iconClass = options.iconClass || "fa-regular fa-bookmark";

    if (books.length === 0) {
        containerEl.innerHTML = renderEmptyListState(
            `Your ${listName}`,
            listDescription,
            iconClass
        );
        return;
    }

    // 1. Slice to limit (e.g. max 4 books) for section previews
    const targetBookIds = books.slice(0, limit);

    // 2. Render shared skeleton grid while fetching details
    containerEl.innerHTML = createSkeletonGrid(targetBookIds.length);

    try {
        // 3. Fetch full book objects
        const fetchedBooks = await fetchBooksByIds(targetBookIds);
        if (fetchedBooks.length === 0) {
            containerEl.innerHTML = renderEmptyListState(
                `Your ${listName}`,
                `No book details found for your ${listName}.`,
                iconClass
            );
        } else {
            // 4. Render real books using shared BooksContainer component
            containerEl.innerHTML = createBooksGrid(fetchedBooks);
        }
    } catch (e) {
        console.error(`Error loading list section for key "${listKey}":`, e);
        containerEl.innerHTML = `<div class="alert alert-warning">Unable to load ${listName} at this time.</div>`;
    }
}

/**
 * Helper shortcut to load Favorites section.
 */
export function loadFavoritesSection(containerEl, limit = 4) {
    return loadListSection(containerEl, 'favourites', { limit, iconClass: 'fa-regular fa-heart' });
}

/**
 * Helper shortcut to load Watchlist section.
 */
export function loadWatchlistSection(containerEl, limit = 4) {
    return loadListSection(containerEl, 'readList', { limit, iconClass: 'fa-regular fa-eye' });
}
