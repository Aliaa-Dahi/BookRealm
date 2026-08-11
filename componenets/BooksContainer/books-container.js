import "./books-container.css";
import BookCard from "../BookCard/book-card.js";

export default function createBooksGrid(booksArray = []) {
    if (!Array.isArray(booksArray)) {
        console.error("createBooksGrid: expected an array, got:", booksArray);
        return `<div class="alert alert-warning">No books to display.</div>`;
    }

    let booksContainerHTML = `<div class="row g-4">`;

    for (let i = 0; i < booksArray.length; i++) {
        booksContainerHTML += BookCard(booksArray[i]);
    }

    booksContainerHTML += `</div>`;
    return booksContainerHTML;
}