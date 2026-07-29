export function GeneresContainer(generes) {
    let genereContainerHTML = `<div class="generes-cards row g-4">`;
    
    generes.forEach(genere => {
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

