import "./generes-container.css";
import { navigate } from "../../js/router.js";
import { showContent } from "../../index.js";

export function createGenresGrid(genresArray = [], count = genresArray.length) {
    let genereContainerHTML = `<div class="generes-cards row g-4">`;

    genresArray.slice(0, count).forEach(genere => {
      
        genereContainerHTML += `
          <div class="col-12 col-md-6 col-lg-3">
            <div class="genre-card d-flex flex-column" data-genere="${genere.slug}">
              <div class="genre-card-top d-flex align-items-center">
                <div class="genre-icon-wrapper rounded-circle d-flex align-items-center justify-content-center">
                  <i class="${genere.icon}"></i>
                </div>
                <h3 class="genre-title playfair playfair-700">${genere.label}</h3>
              </div>
              <p class="genre-desc inter inter-400 flex-fill">${genere.desc}</p>
              <span class="genre-explore inter inter-600 d-flex align-items-center">
                Explore <i class="fa-solid fa-arrow-right"></i>
              </span>
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
        const card = e.target.closest('.genre-card');
        if (card) {
            navigate(`/books/${card.dataset.genere}`, showContent);
        }
    });
}

