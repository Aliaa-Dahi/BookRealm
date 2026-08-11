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
        pageItems.push(`<li class="page-item${isActive}"><a class="page-link" href="#">${i}</a></li>`);
    }

    const isPrevDisabled = currentPage <= 1 ? ' disabled' : '';
    const isNextDisabled = currentPage >= totalPageNumber ? ' disabled' : '';

    return `
    <div class="pag-wrapper">
        <nav aria-label="Page navigation" id="pag-nav">
            <ul class="pagination">
                <li class="page-item${isPrevDisabled}">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                ${pageItems.join('')}
                <li class="page-item${isNextDisabled}">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    `;
}
