import "./paginations.css";

const WINDOW_SIZE = 4;

export default function Pagination(totalPageNumber, currentPage = 1) {
    // Calculate the start of the sliding window, clamped to valid bounds
    let windowStart = Math.max(1, currentPage - Math.floor(WINDOW_SIZE / 2));
    let windowEnd = windowStart + WINDOW_SIZE - 1;

    // If window goes past the end, shift it back
    if (windowEnd > totalPageNumber) {
        windowEnd = totalPageNumber;
        windowStart = Math.max(1, windowEnd - WINDOW_SIZE + 1);
    }

    const pageItems = [];
    for (let i = windowStart; i <= windowEnd; i++) {
        const isActive = i === currentPage ? ' active' : '';
        pageItems.push(`<li class="page-item${isActive}"><a class="page-link d-flex align-items-center justify-content-center bg-transparent" href="#">${i}</a></li>`);
    }

    const isPrevDisabled = currentPage <= 1 ? ' disabled' : '';
    const isNextDisabled = currentPage >= totalPageNumber ? ' disabled' : '';

    return `
    <div class="pag-wrapper d-flex justify-content-center">
        <nav aria-label="Page navigation" id="pag-nav">
            <ul class="pagination flex-wrap justify-content-center">
                <li class="page-item${isPrevDisabled}">
                    <a class="page-link d-flex align-items-center justify-content-center bg-transparent" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                ${pageItems.join('')}
                <li class="page-item${isNextDisabled}">
                    <a class="page-link d-flex align-items-center justify-content-center bg-transparent" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    `;
}

/**
 * Attaches click event handling to a rendered pagination nav.
 * Call this after inserting Pagination() HTML into the DOM.
 *
 * @param {HTMLElement} paginationHolder - The container element holding the pagination HTML.
 * @param {object}   options
 * @param {number}   options.currentPage  - The currently active page number.
 * @param {number}   options.totalWorks   - Total number of items across all pages.
 * @param {number}   options.limit        - Number of items per page.
 * @param {function} options.onPageChange - Callback invoked with the target page number.
 */
export function attachPaginationEvents(paginationHolder, { currentPage, totalWorks, limit, onPageChange }) {
    const nav = paginationHolder.querySelector('#pag-nav');
    if (!nav) return;

    nav.addEventListener('click', (e) => {
        e.preventDefault();

        const targetLink = e.target.closest('.page-link');
        if (!targetLink) return;

        const maxPage = Math.ceil(totalWorks / limit);
        let targetPage = currentPage;

        if (targetLink.getAttribute('aria-label') === 'Previous') {
            if (currentPage <= 1) return;
            targetPage = currentPage - 1;
        } else if (targetLink.getAttribute('aria-label') === 'Next') {
            if (currentPage >= maxPage) return;
            targetPage = currentPage + 1;
        } else {
            const parsed = parseInt(targetLink.textContent.trim(), 10);
            if (isNaN(parsed)) return;
            targetPage = parsed;
        }

        onPageChange(targetPage);
    });
}
