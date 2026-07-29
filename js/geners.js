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
}