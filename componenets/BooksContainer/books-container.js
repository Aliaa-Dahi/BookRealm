import "./books-container.css";

export default function createBooksGrid(booksArray = []){
    if (!Array.isArray(booksArray)) {
        console.error("createBooksGrid: expected an array, got:", booksArray);
        return `<div class="alert alert-warning">No books to display.</div>`;
    }
    let booksContainerHTML = `<div class="row g-4">`;
    
    for(let i=0; i<booksArray.length; i++){
        const book = booksArray[i];
        // Use a high-quality placeholder image if cover_id is missing
        const coverUrl = book.cover_id || book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_id || book.cover_i}-M.jpg`
            : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=450';

        booksContainerHTML += `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card book-card shadow-sm h-100">
                    <img
                        src="${coverUrl}"
                        class="card-img-top"
                        alt="${book.title}"
                    >
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h3 class="book-title playfair playfair-800">
                            ${book.title}
                        </h3>
                        <span class="book-author inter inter-600">${book.author_name}</span>
                    </div>
                    <div class="card-footer">
                        <div class="edition-info d-flex justify-content-between">
                            <span>${book.first_publish_year}</span>
                            <span>${book.edition_count} Editions</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    booksContainerHTML += `</div>`;
    return booksContainerHTML;
}