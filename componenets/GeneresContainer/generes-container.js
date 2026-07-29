export function GeneresContainer(generes) {
    let generesCards = '';
    generes.forEach(genere => {
        generesCards += `<div class="col-3">
            <div class="card shadow-sm">
              <div class="card-body inter inter-800">
                <span>${genere}</span>
              </div>
            </div>
          </div>`
    });
    return `<div class="generes-cards row g-4">
          ${generesCards}
        </div>`;
}