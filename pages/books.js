import createBooksGrid from "../componenets/BooksContainer/books-container.js";

export function renderBooks(container){
    container.innerHTML = `
        <div class="books-page container mt-5 pt-5"></div>
    `;
    const booksPage = container.querySelector(".books-page");
    if(booksPage) {
        booksPage.innerHTML = createBooksGrid();
    }   
}