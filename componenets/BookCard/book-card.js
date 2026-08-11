import "./book-card.css";

/**
 * BookCard
 * Returns the HTML string for a single book card column.
 *
 * @param {Object} book
 * @param {string} book.title
 * @param {number|null} book.cover_id
 * @param {number|null} book.cover_i
 * @param {string} book.author_name
 * @param {string|number} book.first_publish_year
 * @param {number} book.edition_count
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

    // Normalize title to a URL-safe slug: lowercase, spaces → dashes, strip special chars
    const slug = book.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    return `
        <a href="/books/${slug}" class="col-12 col-md-6 col-lg-3 text-decoration-none" data-book-title="${book.title}">
            <div class="card book-card shadow-sm h-100">
                <div class="position-relative">
                    <img
                        src="${coverUrl}"
                        class="card-img-top"
                        alt="${book.title}"
                    >
                    ${book.rating ? `
                    <div class="book-rating-badge">
                        <i class="fa-solid fa-star"></i> ${book.rating}
                    </div>
                    ` : ''}
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
                    <div class="edition-info d-flex justify-content-between">
                        <span>${book.first_publish_year}</span>
                        <span>${book.edition_count} Editions</span>
                    </div>
                </div>
            </div>
        </a>
    `;
}
