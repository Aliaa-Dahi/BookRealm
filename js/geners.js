import { GeneresContainer } from "../componenets/GeneresContainer/generes-container.js";

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

const generesContainer = document.querySelector(".generes-container");
if (generesContainer) {
    generesContainer.innerHTML = GeneresContainer(generes);
    
    generesContainer.addEventListener('click', (e) => {
        // .closest() finds the .card no matter if they clicked the span or the card-body!
        const card = e.target.closest('.card');
        
        if(card){
            // .trim() removes the extra empty spaces/newlines around the text
            // console.log(card.textContent.trim());
            getByGenere(card.textContent.trim())
        }
    });
}

async function getByGenere(genere){
    const response = await fetch(`https://openlibrary.org/subjects/${genere}.json`);
    const data = await response.json()
    console.log(data)
}