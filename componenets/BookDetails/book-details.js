import "./book-details.css";

/**
 * BookDetails
 * Generates the HTML for the Book Details page.
 *
 * @param {Object} book - The book object from the API
 * @returns {string} HTML string
 */
export default function BookDetails(book) {
    if (!book) return '';

    const coverUrl = book.cover_id || book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_id || book.cover_i}-L.jpg`
        : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=450';

    // Safe fallbacks for data
    const subject = (book.subjects && book.subjects.length > 0) ? book.subjects[0] : 'FICTION';
    const rating = book.rating || 'No Rating';
    const reviews = book.ratings_count ? `(${book.ratings_count} Reviews)` : '';
    
    // Create description-like text from subjects & publishers
    const detailsText = `
        A fascinating work by ${book.author_name}, this book delves into themes of ${book.subjects.slice(0, 3).join(', ')}. 
        Originally published in ${book.first_publish_year} ${book.publishers.length > 0 ? `by ${book.publishers[0]}` : ''}, 
        it remains a prominent piece in the ${subject} genre. Available in ${book.languages.length || 1} language(s) 
        and spanning across ${book.edition_count} known editions. 
        ${book.pages ? `This edition contains approximately ${book.pages} pages.` : ''}
    `;

    // Calculate stars
    const fullStars = Math.floor(book.rating || 0);
    const emptyStars = 5 - fullStars;
    let starsHtml = '';
    for(let i=0; i<fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
    for(let i=0; i<emptyStars; i++) starsHtml += '<i class="fa-regular fa-star"></i>';

    return `
        <div class="book-details-page container mt-4 pt-5">
            <!-- Breadcrumbs -->
            <div class="bd-breadcrumbs inter">
                <a href="/" class="text-decoration-none text-muted">HOME</a> 
                <span>›</span> 
                <a href="/books" class="text-decoration-none text-muted">${subject}</a> 
                <span>›</span> 
                <span class="current">${book.title}</span>
            </div>

            <div class="row gx-5 mt-4">
                <!-- Left: Cover Image -->
                <div class="col-md-5 col-lg-4 mb-4 mb-md-0">
                    <div class="bd-cover-wrapper">
                        <img src="${coverUrl}" alt="${book.title} Cover" class="bd-cover-image">
                    </div>
                </div>

                <!-- Right: Book Info -->
                <div class="col-md-7 col-lg-8">
                    <span class="bd-overline inter">${subject} / FICTION</span>
                    <h1 class="bd-title playfair playfair-800">${book.title}</h1>
                    <div class="bd-author playfair">
                        by <strong>${book.author_name}</strong>
                    </div>

                    <div class="bd-meta-row inter">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bd-stars">${starsHtml}</div>
                            <span class="bd-rating-count fw-bold">${rating} <span class="fw-normal text-muted">${reviews}</span></span>
                        </div>
                        <div class="bd-meta-divider"></div>
                        <div class="bd-publish-date">
                            First Published: <strong>${book.first_publish_year}</strong>
                        </div>
                    </div>

                    <div class="bd-details-block inter">
                        <p>${detailsText}</p>
                    </div>

                    <div class="bd-actions inter">
                        <button class="bd-btn bd-btn-dark">
                            <i class="fa-solid fa-book-open-reader"></i> Read Now
                        </button>
                        <button class="bd-btn bd-btn-outline">
                            <i class="fa-regular fa-bookmark"></i> Add to Library
                        </button>
                        <button class="bd-btn-icon">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
