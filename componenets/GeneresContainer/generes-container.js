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


export function createGenresGrid(count = generes.length) {
    let genereContainerHTML = `<div class="generes-cards row g-4">`;
    
    generes.slice(0, count).forEach(genere => {
        // Replace underscores with spaces for words like "science_fiction"
        const displayName = genere.replace(/_/g, ' ');
        
        genereContainerHTML += `
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card shadow-sm h-100">
              <div class="card-body inter inter-800" data-genere="${genere}">
                <span>${displayName}</span>
              </div>
            </div>
          </div>`;
    });
    
    genereContainerHTML += `</div>`;
    return genereContainerHTML; 
}

// Call this after inserting the grid HTML into the DOM
export function attachGenreClickListener(wrapper) {
    const grid = wrapper.querySelector('.generes-cards');
    if (!grid) return;
    grid.addEventListener('click', (e) => {
        const cardBody = e.target.closest('.card-body');
        if (cardBody) {
            getByGenere(cardBody.dataset.genere);
        }
    });
}

export async function getByGenere(genere){
    const response = await fetch(`https://openlibrary.org/subjects/${genere}.json`);
    const data = await response.json()
    console.log(data)
}

