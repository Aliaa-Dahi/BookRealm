/**
 * stars.js — shared star-rendering utility
 *
 * Converts a numeric rating (0–5, supports decimals) into a FontAwesome
 * star HTML string with full, partial (25/50/75%), and empty stars.
 *
 * Used by: book-card.js (renderStarRating) and book-details.js (bd-stars row)
 */

/**
 * Returns an HTML string of star <i> elements for the given rating.
 * Partial stars use CSS clip-path at 25% intervals.
 *
 * @param {number} ratingVal  - Numeric rating 0–5
 * @param {string} filledClass - CSS class for filled stars   (default: 'star-filled')
 * @param {string} emptyClass  - CSS class for empty stars    (default: 'star-empty')
 * @returns {string} HTML string — stars only, no wrapper
 */
export function buildStarHtml(ratingVal, filledClass = 'star-filled', emptyClass = 'star-empty') {
    const num = Math.min(5, Math.max(0, parseFloat(ratingVal) || 0));

    const fullCount = Math.floor(num);
    const remainder = num - fullCount;

    let html = '';

    for (let i = 0; i < fullCount; i++) {
        html += `<i class="fa-solid fa-star ${filledClass}"></i>`;
    }

    let fillPct = 0;
    if (remainder >= 0.875)      fillPct = 100;
    else if (remainder >= 0.625) fillPct = 75;
    else if (remainder >= 0.375) fillPct = 50;
    else if (remainder >= 0.125) fillPct = 25;

    if (fillPct === 100) {
        html += `<i class="fa-solid fa-star ${filledClass}"></i>`;
    } else if (fillPct > 0) {
        html += `
            <span class="star-partial-wrapper position-relative d-inline-flex align-items-center justify-content-center">
                <i class="fa-regular fa-star ${emptyClass}"></i>
                <i class="fa-solid fa-star ${filledClass} star-clipped position-absolute top-0 start-0"
                   style="clip-path: inset(0 ${100 - fillPct}% 0 0);"></i>
            </span>`;
    }

    const emptyCount = 5 - fullCount - (fillPct > 0 ? 1 : 0);
    for (let i = 0; i < emptyCount; i++) {
        html += `<i class="fa-regular fa-star ${emptyClass}"></i>`;
    }

    return html;
}
