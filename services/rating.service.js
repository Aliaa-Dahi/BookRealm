/**
 * Rating Service
 *
 * Stores and retrieves per-user book ratings in localStorage.
 * Ratings are purely local / cosmetic — they do NOT affect the
 * book's global API rating, only the current user's UI.
 *
 * Storage shape:
 * {
 *   "<bookId>": 4,   // integer 1-5
 *   ...
 * }
 */

const RATINGS_KEY = 'userBookRatings';

function getRatings() {
    try {
        const stored = localStorage.getItem(RATINGS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch (e) {
        console.error('Error reading ratings from localStorage', e);
    }
    return {};
}

function saveRatings(ratings) {
    try {
        localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    } catch (e) {
        console.error('Error saving ratings to localStorage', e);
    }
}

/**
 * Get the user's rating for a book.
 * @param {string} bookId
 * @returns {number|null} 1-5 or null if not yet rated
 */
export function getUserRating(bookId) {
    if (!bookId) return null;
    const ratings = getRatings();
    const val = ratings[String(bookId)];
    return typeof val === 'number' ? val : null;
}

/**
 * Set the user's rating for a book.
 * Pass null to clear the rating.
 * @param {string} bookId
 * @param {number|null} rating - integer 1-5, or null to clear
 */
export function setUserRating(bookId, rating) {
    if (!bookId) return;
    const ratings = getRatings();

    if (rating === null || rating === undefined) {
        delete ratings[String(bookId)];
    } else {
        const clamped = Math.min(5, Math.max(1, Math.round(rating)));
        ratings[String(bookId)] = clamped;
    }

    saveRatings(ratings);

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userRatingUpdated', {
            detail: { bookId: String(bookId), rating }
        }));
    }
}
