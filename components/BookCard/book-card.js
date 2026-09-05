import "./book-card.css";
import { isBookFavorite, toggleFavoriteBook, isBookInReadList, toggleReadListBook } from "../../services/list.service.js";
import { requireAuth } from "../../services/auth.service.js";
import { renderBookCardDropdown } from "../BookCardDropdown/book-card-dropdown.js";
import { getUserRating, setUserRating } from "../../services/rating.service.js";
import { buildStarHtml } from "../../utils/stars.js";


/**
 * Generates a deterministic fallback rating for books without an explicit rating.
 * Returns values rounded to 0.25 steps (e.g. 3.75, 4.0, 4.25, 4.5, 4.75, 5.0).
 */
function getFallbackRating(keyStr) {
    if (!keyStr) return 4.5;
    let hash = 0;
    for (let i = 0; i < keyStr.length; i++) {
        hash = keyStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const values = [3.75, 4.0, 4.25, 4.5, 4.75, 5.0];
    return values[Math.abs(hash) % values.length];
}


/**
 * Renders the read-only (API) star display — partial star support included.
 */
function renderStarRating(ratingVal) {
    const num = Math.min(5, Math.max(0, parseFloat(ratingVal) || 4.5));
    return `
        <div class="book-card-rating d-flex align-items-center gap-1">
            <div class="book-card-stars d-inline-flex align-items-center gap-1" title="${num.toFixed(2)} out of 5 stars">
                ${buildStarHtml(num)}
            </div>
            <span class="rating-number">${num.toFixed(1)}</span>
        </div>
    `;
}

/**
 * Renders the eye / heart / dots action button group.
 * Used in both the desktop hover overlay and the mobile footer strip.
 *
 * @param {string}  bookId
 * @param {boolean} isFav
 * @param {boolean} inReadList
 * @param {string}  btnClass   - CSS class for the button (card-action-btn or bd-action-btn)
 * @returns {string} HTML string
 */
export function renderActionButtons(bookId, isFav, inReadList, btnClass = 'card-action-btn') {
    return `
        <button type="button"
            class="btn ${btnClass} eye-btn ${inReadList ? 'active' : ''} rounded-circle p-0 d-flex align-items-center justify-content-center"
            data-book-id="${bookId}" title="Want to Read">
            <i class="fa-solid fa-eye"></i>
        </button>
        <button type="button"
            class="btn ${btnClass} heart-btn ${isFav ? 'active' : ''} rounded-circle p-0 d-flex align-items-center justify-content-center"
            data-book-id="${bookId}" title="Like / Save">
            <i class="fa-solid fa-heart"></i>
        </button>
        <div class="dots-btn-wrapper position-relative">
            <button type="button"
                class="btn ${btnClass} dots-btn rounded-circle p-0 d-flex align-items-center justify-content-center"
                data-book-id="${bookId}" title="More Options">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
        </div>
    `;
}

/**
 * Renders the interactive user-rating widget.
 * Designed to sit inline alongside the API rating in a single row.
 */
export function renderInteractiveRating(bookId, apiRatingVal) {
    const userRating = getUserRating(bookId);
    const hasUserRating = userRating !== null;
    const apiNum = Math.min(5, Math.max(0, parseFloat(apiRatingVal) || 4.5));

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        const filled = hasUserRating && i <= userRating;
        starsHtml += `<button type="button"
            class="btn p-0 border-0 bg-transparent user-star-btn flex-shrink-0 ${filled ? 'star-filled' : 'star-empty'}"
            data-star="${i}" data-book-id="${bookId}"
            title="Rate ${i} star${i > 1 ? 's' : ''}"
            aria-label="Rate ${i} star${i > 1 ? 's' : ''}">
            <i class="${filled ? 'fa-solid' : 'fa-regular'} fa-star"></i>
        </button>`;
    }

    const label = hasUserRating
        ? `<span class="user-rating-value text-nowrap flex-shrink-0">${userRating}<span class="user-rating-max">/5</span></span>`
        : '';

    return `
        <div class="user-rating-inline d-flex align-items-center gap-1" data-book-id="${bookId}">
            <span class="user-rating-sep"></span>
            <span class="user-rating-prefix text-uppercase flex-shrink-0 text-nowrap">You</span>
            <div class="user-stars d-inline-flex align-items-center gap-1"
                 data-book-id="${bookId}"
                 data-api-rating="${apiNum}">
                ${starsHtml}
            </div>
            ${label}
        </div>
    `;
}

    // ── Heart & Eye Action Button Delegations ────────────────────────────────────
if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
        // Only intercept heart and eye buttons — dots button is handled by book-card-dropdown.js
        const heartBtn = e.target.closest('.heart-btn');
        const eyeBtn   = e.target.closest('.eye-btn');

        if (!heartBtn && !eyeBtn) return;

        // Stop navigation and event propagation
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // ── Guard: require login ──
        if (!requireAuth()) return;

        if (heartBtn) {
            const bookId = heartBtn.getAttribute('data-book-id');
            if (bookId) {
                const res = toggleFavoriteBook(bookId);
                heartBtn.classList.toggle('active', res.isFavorite);
            }
            return;
        }

        if (eyeBtn) {
            const bookId = eyeBtn.getAttribute('data-book-id');
            if (bookId) {
                const res = toggleReadListBook(bookId);
                eyeBtn.classList.toggle('active', res.inReadList);
            }
            return;
        }
    }, true); // Capture phase prevents heart/eye clicks from navigating

    // ── Interactive Star Rating Delegation ───────────────────────────────────
    document.addEventListener('click', (e) => {
        const starBtn = e.target.closest('.user-star-btn');
        if (!starBtn) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Guard: require login before allowing a rating
        if (!requireAuth()) return;

        const bookId = starBtn.getAttribute('data-book-id');
        const newRating = parseInt(starBtn.getAttribute('data-star'), 10);
        if (!bookId || !newRating) return;

        // Toggle off if clicking the same star again
        const currentRating = getUserRating(bookId);
        const finalRating = currentRating === newRating ? null : newRating;

        setUserRating(bookId, finalRating);

        // Re-render the user rating widget for this book
        document.querySelectorAll(`.user-stars[data-book-id="${bookId}"]`).forEach(container => {
            const apiRating = parseFloat(container.getAttribute('data-api-rating')) || 4.5;
            const userRatingInline = container.closest('.user-rating-inline');
            if (userRatingInline) {
                userRatingInline.outerHTML = renderInteractiveRating(bookId, apiRating);
            }
        });
    }, true);

    // ── Star hover preview ────────────────────────────────────────────────────
    document.addEventListener('mouseover', (e) => {
        const starBtn = e.target.closest('.user-star-btn');
        if (!starBtn) return;

        const container = starBtn.closest('.user-stars');
        if (!container) return;

        const hoverVal = parseInt(starBtn.getAttribute('data-star'), 10);
        container.querySelectorAll('.user-star-btn').forEach(btn => {
            const s = parseInt(btn.getAttribute('data-star'), 10);
            const icon = btn.querySelector('i');
            if (s <= hoverVal) {
                icon.className = 'fa-solid fa-star star-filled';
                btn.classList.add('star-filled');
                btn.classList.remove('star-empty');
            } else {
                icon.className = 'fa-regular fa-star star-empty';
                btn.classList.remove('star-filled');
                btn.classList.add('star-empty');
            }
        });
    });

    document.addEventListener('mouseout', (e) => {
        const starBtn = e.target.closest('.user-star-btn');
        if (!starBtn) return;

        const container = starBtn.closest('.user-stars');
        if (!container) return;

        // Only reset if leaving the whole container
        if (container.contains(e.relatedTarget)) return;

        const bookId = container.getAttribute('data-book-id');
        const savedRating = getUserRating(bookId);

        container.querySelectorAll('.user-star-btn').forEach(btn => {
            const s = parseInt(btn.getAttribute('data-star'), 10);
            const icon = btn.querySelector('i');
            const filled = savedRating !== null && s <= savedRating;
            icon.className = filled ? 'fa-solid fa-star star-filled' : 'fa-regular fa-star star-empty';
            btn.classList.toggle('star-filled', filled);
            btn.classList.toggle('star-empty', !filled);
        });
    });
}



export default function BookCard(book) {
    // Use a high-quality placeholder image if cover_id is missing
    const coverUrl = book.cover_id || book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_id || book.cover_i}-M.jpg`
        : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=450';

    const rawAuthor = book.author_name || 'Unknown Author';
    const isMultiAuthor = rawAuthor.includes(',');
    const authorDisplay = isMultiAuthor
        ? `${rawAuthor.split(',')[0]} & others`
        : rawAuthor;

    // Normalize title to a URL-safe slug
    const slug = book.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const bookId = book.key || book.id || book.title;
    const isFav = isBookFavorite(bookId);
    const inReadList = isBookInReadList(bookId);
    const ratingVal = book.rating || getFallbackRating(bookId);
    

    return `
        <div class="col-12 col-md-6 col-lg-3 book-card-link" data-book-id="${bookId}" data-book-title="${book.title}">
            <a href="/books/${slug}" class="text-decoration-none d-block h-100">
            <div class="card book-card h-100 border-0">
                <div class="position-relative">
                    <div class="img-holder">
                        <img
                            src="${coverUrl}"
                            class="card-img-top"
                            alt="${book.title}"
                        >
                    </div>
                    <!-- Desktop hover overlay (hidden on mobile/tablet) -->
                    <div class="book-card-hover-overlay position-absolute bottom-0 start-0 end-0 w-100 d-none d-md-flex align-items-center justify-content-center gap-3 p-2">
                        ${renderActionButtons(bookId, isFav, inReadList)}
                    </div>
                </div>
                <div class="card-body d-flex flex-column justify-content-between p-0 pt-3">
                    <h3 class="book-title playfair playfair-800">
                        ${book.title}
                    </h3>
                    <span class="book-author inter inter-600">
                        ${authorDisplay}
                        ${isMultiAuthor ? `<i class="fa-solid fa-users ms-1 text-muted" title="Multiple authors participated in this book"></i>` : ''}
                    </span>
                </div>
                <div class="card-footer bg-transparent border-0 px-0 pb-0 pt-0">
                    <div class="card-rating-block d-flex flex-column gap-1">
                        ${renderStarRating(ratingVal)}
                        <div class="card-rating-divider"></div>
                        ${renderInteractiveRating(bookId, ratingVal)}
                    </div>
                    <!-- Mobile/tablet action buttons (hidden on desktop where hover overlay is used) -->
                    <div class="card-mobile-actions d-flex d-md-none align-items-center justify-content-center gap-3 mt-2">
                        ${renderActionButtons(bookId, isFav, inReadList)}
                    </div>
                </div>
            </div>
            </a>
        </div>
    `;
}