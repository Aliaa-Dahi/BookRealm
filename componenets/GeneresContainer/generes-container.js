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
              <div class="card-body inter inter-800">
                <span>${displayName}</span>
              </div>
            </div>
          </div>`;
    });
    
    genereContainerHTML += `</div>`; // Close the container AFTER the loop!
    return genereContainerHTML;
}

