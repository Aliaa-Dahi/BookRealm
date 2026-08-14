import "./view-all.css";

/**
 * Reusable ViewAll Component
 * Returns HTML string for a "View All" link with a smooth animated arrow.
 *
 * @param {string} href - Target URL or hash (e.g. "/books", "#favourites", etc.)
 * @param {string} label - Text label (defaults to "View All")
 * @returns {string} HTML string
 */
export default function ViewAll(href = "/books", label = "View All") {
    return `
        <a href="${href}" class="view-all-link inter inter-600 text-decoration-none d-inline-flex align-items-center">
            ${label} <i class="fa-solid fa-arrow-right ms-2 transition-icon"></i>
        </a>
    `;
}
