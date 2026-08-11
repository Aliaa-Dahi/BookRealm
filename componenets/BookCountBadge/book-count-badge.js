/**
 * BookCountBadge
 * Returns the HTML string for the pill badge showing how many books are currently displayed.
 *
 * @param {number} startNum  - First book number on the current page (0 if no results)
 * @param {number} endNum    - Last book number on the current page
 * @param {number} totalWorks - Total number of books available
 * @returns {string} HTML string
 */
export default function BookCountBadge(startNum, endNum, totalWorks) {
    return `<i class="fa-solid fa-book-open me-2"></i>Showing ${startNum}&nbsp;&ndash;&nbsp;${endNum} of ${totalWorks} books`;
}
