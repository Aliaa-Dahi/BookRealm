import "./books-container.css";

export default function createBooksGrid(booksArray = []){
    if (!Array.isArray(booksArray)) {
        console.error("createBooksGrid: expected an array, got:", booksArray);
        return `<div class="alert alert-warning">No books to display.</div>`;
    }
    let booksContainerHTML = `<div class="row g-4">`;
    
    for(let i=0; i<booksArray.length; i++){
        booksContainerHTML += `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card shadow-sm h-100">
                    <img
                        src="https://covers.openlibrary.org/b/id/${booksArray[i].cover_i}-L.jpg"
                        class="card-img-top"
                        alt="${booksArray[i].title}"
  >
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h3 class="book-title playfair playfair-800">
                            ${booksArray[i].title}
                        </h3>
                        <span class="book-author inter inter-600">${booksArray[i].author_name}</span>
                    </div>
                    <div class="card-footer">
                        <div class="edition-info d-flex justify-content-between">
                            <span>${booksArray[i].first_publish_year}</span>
                            <span>${booksArray[i].edition_count} Editions</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    booksContainerHTML += `</div>`;
    return booksContainerHTML;

    return `
        <div class="row g-4">
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <div class="card">
                    <div class="card-body">
                        Book
                    </div>
                </div>
            </div>
        </div>
    `
}