import "./book-details.css";
import { renderInteractiveRating, renderActionButtons } from "../BookCard/book-card.js";
import { isBookFavorite, isBookInReadList } from "../../services/list.service.js";
import { requireAuth } from "../../services/auth.service.js";
import { renderBookCardDropdown } from "../BookCardDropdown/book-card-dropdown.js";
import { buildStarHtml } from "../../utils/stars.js";

/**
 * BookDetails
 * Generates the HTML for the Book Details page.
 *
 * @param {Object} book - The book object from the API
 * @returns {string} HTML string
 */
export default function BookDetails(book) {
    if (!book) return '';

    // Using a static high-res image for the design instead of Open Library's low-res covers
    const coverUrl = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800&h=1200';

    // Safe fallbacks for data
    const subjectHtml = (book.subjects && book.subjects.length > 0) 
        ? book.subjects.slice(0, 3).map(subj => {
            // Normalize for the URL: lowercase, spaces to underscores, remove special chars
            const slug = subj.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            return `<a href="/books/${slug}" class="text-decoration-none subject-link">${subj}</a>`;
        }).join('<span class="mx-2 text-muted fw-normal">&</span>')
        : '<span class="subject-link">General</span>';
    const apiRatingNum = Math.min(5, Math.max(0, parseFloat(book.rating) || 0));
    const rating = apiRatingNum > 0 ? apiRatingNum.toFixed(1) : 'No Rating';
    const starsHtml = buildStarHtml(apiRatingNum);

    // Book ID for user rating and action buttons
    const bookId     = book.key || book.id || book.title;
    const isFav      = isBookFavorite(bookId);
    const inReadList = isBookInReadList(bookId);

    // Languages logic
    const hasLanguages = book.languages && book.languages.length > 0;
    const visibleLanguages = hasLanguages 
        ? book.languages.slice(0, 3).map(l => `<a href="/books/${l.toLowerCase()}" class="text-decoration-none text-dark">${l.toUpperCase()}</a>`).join(', ') 
        : '';
    const remainingCount = hasLanguages ? book.languages.length - 3 : 0;
    const hasMoreLanguages = remainingCount > 0;

    return `
        <div class="book-details-page container mt-4 pt-5">
           

            <div class="row gx-5 mt-4">
                <div class="col-md-5 mb-4 mb-md-0">
                    <div class="bd-cover-wrapper rounded-4 text-center d-flex align-items-center justify-content-center overflow-hidden">
                        <img src="${coverUrl}" alt="${book.title} Cover" class="bd-cover-image w-100 h-100">
                    </div>
                </div>

                <!-- Right: Book Info -->
                <div class="col-md-6">
                    <span class="bd-overline inter d-block text-uppercase">${subjectHtml}</span>
                    <h2 class="bd-title playfair playfair-800">${book.title}</h2>
                    <div class="bd-author playfair">
                        by <strong>${book.author_name}</strong>
                    </div>

                    <div class="bd-meta-row inter d-flex align-items-center flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bd-stars">${starsHtml}</div>
                            <span class="bd-rating-count fw-bold">${rating}</span>
                        </div>
                        <div class="bd-meta-divider"></div>
                        <div class="bd-publish-date">
                            First Published: <strong>${book.first_publish_year}</strong>
                        </div>
                    </div>

                    <!-- User Rating Row -->
                    <div class="bd-user-rating-row inter d-flex align-items-center gap-3 mb-3 p-3 rounded-3">
                        <span class="bd-stat-label text-nowrap">Your Rating</span>
                        ${renderInteractiveRating(bookId, apiRatingNum)}
                    </div>

                    <div class="bd-stats-grid inter mb-4 d-flex">
                        ${book.pages ? `
                        <div class="bd-stat-item d-flex flex-column gap-1">
                            <span class="bd-stat-label">Pages</span>
                            <span class="bd-stat-value">${book.pages}</span>
                        </div>
                        ` : ''}
                        ${hasLanguages ? `
                        <div class="bd-stat-item d-flex flex-column gap-1">
                            <span class="bd-stat-label">Languages</span>
                            <div class="bd-languages d-flex align-items-center gap-2">
                                <span class="bd-stat-value">${visibleLanguages}</span>
                                ${hasMoreLanguages ? `
                                <button type="button" class="bd-more-languages" aria-expanded="false" aria-label="Show all languages">
                                    +${remainingCount} more
                                </button>
                                <div class="bd-languages-popover">
                                    <div class="bd-languages-list d-flex flex-wrap">
                                        ${book.languages.map(l => `<a href="/books/${l.toLowerCase()}" class="text-decoration-none bd-language-item">${l.toUpperCase()}</a>`).join('')}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}
                        ${book.ratings_count ? `
                        <div class="bd-stat-item d-flex flex-column gap-1">
                            <span class="bd-stat-label">Ratings</span>
                            <span class="bd-stat-value">${book.ratings_count.toLocaleString()}</span>
                        </div>
                        ` : ''}
                    </div>

                    <div class="bd-actions inter mt-4 d-flex align-items-center gap-3">
                        ${renderActionButtons(bookId, isFav, inReadList, 'bd-action-btn')}
                    </div>
                </div>
            </div>
        </div>
    `;
}
