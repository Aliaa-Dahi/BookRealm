import "./book-card.css";
import { isBookFavorite, toggleFavoriteBook, isBookInReadList, toggleReadListBook } from "../../services/list.service.js";

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
 * Renders star rating icons supporting full, half (50%), quarter (25%), and 3/4 (75%) stars.
 * All star colors are assigned via common.css variables in book-card.css.
 */
function renderStarRating(ratingVal) {
    const num = Math.min(5, Math.max(0, parseFloat(ratingVal) || 4.5));

    const fullCount = Math.floor(num);
    const remainder = num - fullCount;

    let starsHtml = '';

    // Render full stars
    for (let i = 0; i < fullCount; i++) {
        starsHtml += `<i class="fa-solid fa-star star-filled"></i>`;
    }

    // Render partial star (25%, 50%, or 75%) if remainder exists
    let fillPct = 0;
    if (remainder >= 0.875) fillPct = 100;
    else if (remainder >= 0.625) fillPct = 75;
    else if (remainder >= 0.375) fillPct = 50;
    else if (remainder >= 0.125) fillPct = 25;

    if (fillPct === 100) {
        starsHtml += `<i class="fa-solid fa-star star-filled"></i>`;
    } else if (fillPct > 0) {
        starsHtml += `
            <span class="star-partial-wrapper">
                <i class="fa-regular fa-star star-empty"></i>
                <i class="fa-solid fa-star star-filled star-clipped" style="clip-path: inset(0 ${100 - fillPct}% 0 0);"></i>
            </span>
        `;
    }

    return `
        <div class="book-card-rating">
            <div class="book-card-stars" title="${num.toFixed(2)} out of 5 stars">
                ${starsHtml}
            </div>
            <span class="rating-number">${num.toFixed(1)}</span>
        </div>
    `;
}

// Global click delegation for action buttons (heart for favourites, eye for readList)
if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
        const heartBtn = e.target.closest('.heart-btn');
        if (heartBtn) {
            e.preventDefault();
            e.stopPropagation();
            const bookId = heartBtn.getAttribute('data-book-id');
            if (bookId) {
                const res = toggleFavoriteBook(bookId);
                heartBtn.classList.toggle('active', res.isFavorite);
            }
            return;
        }

        const eyeBtn = e.target.closest('.eye-btn');
        if (eyeBtn) {
            e.preventDefault();
            e.stopPropagation();
            const bookId = eyeBtn.getAttribute('data-book-id');
            if (bookId) {
                const res = toggleReadListBook(bookId);
                eyeBtn.classList.toggle('active', res.inReadList);
            }
            return;
        }
    });
}

/**
 * BookCard
 * Returns the HTML string for a single book card column.
 *
 * @param {Object} book
 * @returns {string} HTML string
 */
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
        <a href="/books/${slug}" class="col-12 col-md-6 col-lg-3 text-decoration-none" data-book-id="${bookId}" data-book-title="${book.title}">
            <div class="card book-card shadow-sm h-100">
                <div class="position-relative overflow-hidden">
                    <img
                        src="${coverUrl}"
                        class="card-img-top"
                        alt="${book.title}"
                    >
                    <div class="book-card-hover-overlay position-absolute bottom-0 start-0 end-0 d-none d-md-flex align-items-center justify-content-center gap-3 p-2">
                        <button type="button" class="btn card-action-btn eye-btn ${inReadList ? 'active' : ''} rounded-circle d-flex align-items-center justify-content-center" data-book-id="${bookId}" title="Want to Read">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button type="button" class="btn card-action-btn heart-btn ${isFav ? 'active' : ''} rounded-circle d-flex align-items-center justify-content-center" data-book-id="${bookId}" title="Like / Save">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                        <button type="button" class="btn card-action-btn dots-btn rounded-circle d-flex align-items-center justify-content-center" onclick="event.preventDefault(); event.stopPropagation();" title="More Options">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                    <h3 class="book-title playfair playfair-800">
                        ${book.title}
                    </h3>
                    <span class="book-author inter inter-600">
                        ${authorDisplay}
                        ${isMultiAuthor ? `<i class="fa-solid fa-users ms-1 text-muted" title="Multiple authors participated in this book"></i>` : ''}
                    </span>
                </div>
                <div class="card-footer">
                    ${renderStarRating(ratingVal)}
                </div>
            </div>
        </a>
    `;
}
