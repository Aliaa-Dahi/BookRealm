import "./generes-container.css";

export const generes = [
  { slug: "fantasy",            label: "Fantasy",            icon: "fa-solid fa-hat-wizard",         desc: "Magic, mythical creatures, and epic adventures in imagined worlds." },
  { slug: "romance",            label: "Romance",            icon: "fa-solid fa-heart",               desc: "Stories about love, relationships, and emotional journeys." },
  { slug: "science_fiction",    label: "Science Fiction",    icon: "fa-solid fa-rocket",              desc: "Futuristic concepts, space exploration, and advanced technology." },
  { slug: "mystery",            label: "Mystery",            icon: "fa-solid fa-magnifying-glass",    desc: "Puzzles, secrets, and suspenseful tales of the unknown." },
  { slug: "thriller",           label: "Thriller",           icon: "fa-solid fa-masks-theater",       desc: "High-stakes plots, suspense, and edge-of-your-seat action." },
  { slug: "horror",             label: "Horror",             icon: "fa-solid fa-ghost",               desc: "Dark, chilling stories that explore fear and the supernatural." },
  { slug: "historical_fiction", label: "Historical Fiction", icon: "fa-solid fa-chess-rook",          desc: "Fictional stories set in real historical events and eras." },
  { slug: "biography",          label: "Biography",          icon: "fa-solid fa-person",              desc: "Real-life stories of inspiring people and their journeys." },
  { slug: "history",            label: "History",            icon: "fa-solid fa-landmark",            desc: "Non-fiction books about past events and civilizations." },
  { slug: "psychology",         label: "Psychology",         icon: "fa-solid fa-brain",               desc: "Exploring the mind, behavior, and human experience." },
  { slug: "self_help",          label: "Self Help",          icon: "fa-solid fa-star",                desc: "Personal growth, motivation, and life improvement." },
  { slug: "business",           label: "Business",           icon: "fa-solid fa-briefcase",           desc: "Entrepreneurship, management, and professional success." },
  { slug: "programming",        label: "Programming",        icon: "fa-solid fa-code",                desc: "Books on software development, algorithms, and coding." },
  { slug: "artificial_intelligence", label: "Artificial Intelligence", icon: "fa-solid fa-microchip", desc: "Machine learning, neural networks, and the future of AI." },
  { slug: "technology",         label: "Technology",         icon: "fa-solid fa-laptop",              desc: "Innovation, gadgets, and the impact of tech on society." },
  { slug: "cooking",            label: "Cooking",            icon: "fa-solid fa-utensils",            desc: "Recipes, culinary techniques, and food culture worldwide." },
  { slug: "travel",             label: "Travel",             icon: "fa-solid fa-earth-americas",      desc: "Adventures, destinations, and stories from around the globe." },
  { slug: "children",           label: "Children",           icon: "fa-solid fa-child",               desc: "Imaginative tales and learning stories for young readers." },
  { slug: "comics",             label: "Comics",             icon: "fa-solid fa-book-open",           desc: "Graphic novels and illustrated stories for all ages." },
  { slug: "poetry",             label: "Poetry",             icon: "fa-solid fa-feather",             desc: "Verses and lyrical writing that capture the human soul." },
];


export function createGenresGrid(count = generes.length) {
    let genereContainerHTML = `<div class="generes-cards row g-4">`;

    generes.slice(0, count).forEach(genere => {
        genereContainerHTML += `
          <div class="col-12 col-md-6 col-lg-3">
            <div class="genre-card" data-genere="${genere.slug}">
              <div class="genre-card-top">
                <div class="genre-icon-wrapper">
                  <i class="${genere.icon}"></i>
                </div>
                <h3 class="genre-title playfair playfair-700">${genere.label}</h3>
              </div>
              <p class="genre-desc inter inter-400">${genere.desc}</p>
              <span class="genre-explore inter inter-600">
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
            getByGenere(card.dataset.genere);
        }
    });
}

export async function getByGenere(genere){
    const response = await fetch(`https://openlibrary.org/subjects/${genere}.json`);
    const data = await response.json()
    console.log(data)
}
