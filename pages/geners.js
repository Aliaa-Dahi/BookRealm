import { createGenresGrid } from "../componenets/GeneresContainer/generes-container.js";

export const generes = [
  "fantasy",
  "romance",
  "science_fiction",
  "mystery",
  "thriller",
  "horror",
  "historical_fiction",
  "biography",
  "history",
  "psychology",
  "self_help",
  "business",
  "programming",
  "artificial_intelligence",
  "technology",
  "cooking",
  "travel",
  "children",
  "comics",
  "poetry"
]; 

async function getByGenere(genere){
    const response = await fetch(`https://openlibrary.org/subjects/${genere}.json`);
    const data = await response.json()
    console.log(data)
}

export function renderGeners(container) {
  container.innerHTML = `
    <div class="generes-page container mt-5 pt-5"></div>
  `;

  const genresPage = container.querySelector(".generes-page");
  if (genresPage) {
    genresPage.innerHTML = createGenresGrid(generes);
    
    genresPage.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            getByGenere(card.textContent.trim());
        }
    });
  }
}
