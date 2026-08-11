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
    console.log(book);
    

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
    const rating = book.rating || 'No Rating';
    // Calculate stars
    const fullStars = Math.floor(book.rating || 0);
    const emptyStars = 5 - fullStars;
    let starsHtml = '';
    for(let i=0; i<fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
    for(let i=0; i<emptyStars; i++) starsHtml += '<i class="fa-regular fa-star"></i>';

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
                <!-- Left: Cover Image -->
                <div class="col-md-5  mb-4 mb-md-0">
                    <div class="bd-cover-wrapper">
                        <img src="${coverUrl}" alt="${book.title} Cover" class="bd-cover-image">
                    </div>
                </div>

                <!-- Right: Book Info -->
                <div class="col-md-6 ">
                    <span class="bd-overline inter">${subjectHtml}</span>
                    <h2 class="bd-title playfair playfair-800">${book.title}</h2>
                    <div class="bd-author playfair">
                        by <strong>${book.author_name}</strong>
                    </div>

                    <div class="bd-meta-row inter">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bd-stars">${starsHtml}</div>
                            <span class="bd-rating-count fw-bold">${rating}</span>
                        </div>
                        <div class="bd-meta-divider"></div>
                        <div class="bd-publish-date">
                            First Published: <strong>${book.first_publish_year}</strong>
                        </div>
                    </div>

                    <div class="bd-stats-grid inter mb-4">
                        ${book.pages ? `
                        <div class="bd-stat-item">
                            <span class="bd-stat-label">Pages</span>
                            <span class="bd-stat-value">${book.pages}</span>
                        </div>
                        ` : ''}
                        ${hasLanguages ? `
                        <div class="bd-stat-item">
                            <span class="bd-stat-label">Languages</span>
                            <div class="bd-languages">
                                <span class="bd-stat-value">${visibleLanguages}</span>
                                ${hasMoreLanguages ? `
                                <button type="button" class="bd-more-languages" aria-expanded="false" aria-label="Show all languages">
                                    +${remainingCount} more
                                </button>
                                <div class="bd-languages-popover">
                                    <div class="bd-languages-list">
                                        ${book.languages.map(l => `<a href="/books/${l.toLowerCase()}" class="text-decoration-none bd-language-item">${l.toUpperCase()}</a>`).join('')}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}
                        ${book.ratings_count ? `
                        <div class="bd-stat-item">
                            <span class="bd-stat-label">Ratings</span>
                            <span class="bd-stat-value">${book.ratings_count.toLocaleString()}</span>
                        </div>
                        ` : ''}
                    </div>

                    <div class="bd-actions inter mt-4">
                        <button class="main-btn border-0 py-2 px-4 rounded-3 d-inline-flex align-items-center gap-2">
                            <i class="fa-solid fa-book-open-reader"></i> Read Now
                        </button>
                        <button class="sub-btn  py-2 px-4 rounded-3 d-inline-flex align-items-center gap-2 ">
                            <i class="fa-regular fa-bookmark"></i> Add to Library
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
