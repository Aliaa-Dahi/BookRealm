import { createGenresGrid, attachGenreClickListener } from "../componenets/GeneresContainer/generes-container.js";
import SearchInput from "../componenets/SearchInput/search-input.js";

export const generes = [
  { slug: "fantasy",            label: "Fantasy",            icon: "fa-solid fa-hat-wizard",         desc: "Magic, mythical creatures, and epic adventures in imagined worlds." },
  { slug: "romance",            label: "Romance",            icon: "fa-solid fa-heart",               desc: "Stories about love, relationships, and emotional journeys." },
  { slug: "science_fiction",    label: "Science Fiction",    icon: "fa-solid fa-rocket",              desc: "Futuristic concepts, space exploration, and advanced technology." },
  { slug: "mystery",            label: "Mystery",            icon: "fa-solid fa-magnifying-glass",    desc: "Puzzles, secrets, and suspenseful tales of the unknown." },
  { slug: "thriller",           label: "Thriller",           icon: "fa-solid fa-masks-theater",       desc: "High-stakes plots, suspense, and edge-of-your-seat action." },
  { slug: "horror",             label: "Horror",             icon: "fa-solid fa-ghost",               desc: "Dark, chilling stories that explore fear and the supernatural." },
  { slug: "historical_fiction", label: "Historical Fiction", icon: "fa-solid fa-chess-rook",          desc: "Fictional stories set in real historical events and eras." },
  { slug: "classics",           label: "Classics",           icon: "fa-solid fa-scroll",              desc: "Timeless literary works that have shaped culture and thought." },
  { slug: "short_stories",      label: "Short Stories",      icon: "fa-solid fa-align-left",          desc: "Compact, powerful fiction that delivers impact in few pages." },
  { slug: "biography",          label: "Biography",          icon: "fa-solid fa-person",              desc: "Real-life stories of inspiring people and their journeys." },
  { slug: "history",            label: "History",            icon: "fa-solid fa-landmark",            desc: "Non-fiction books about past events and civilizations." },
  { slug: "philosophy",         label: "Philosophy",         icon: "fa-solid fa-scale-balanced",      desc: "Ideas about existence, knowledge, ethics, and the human condition." },
  { slug: "religion",           label: "Religion",           icon: "fa-solid fa-place-of-worship",    desc: "Sacred texts, theology, and explorations of faith and spirituality." },
  { slug: "psychology",         label: "Psychology",         icon: "fa-solid fa-brain",               desc: "Exploring the mind, behavior, and human experience." },
  { slug: "self_help",          label: "Self Help",          icon: "fa-solid fa-star",                desc: "Personal growth, motivation, and life improvement." },
  { slug: "health",             label: "Health",             icon: "fa-solid fa-heart-pulse",         desc: "Medicine, wellness, nutrition, and living a healthier life." },
  { slug: "science",            label: "Science",            icon: "fa-solid fa-flask",               desc: "Physics, biology, chemistry, and the wonders of the natural world." },
  { slug: "business",           label: "Business",           icon: "fa-solid fa-briefcase",           desc: "Entrepreneurship, management, and professional success." },
  { slug: "programming",        label: "Programming",        icon: "fa-solid fa-code",                desc: "Books on software development, algorithms, and coding." },
  { slug: "artificial_intelligence", label: "Artificial Intelligence", icon: "fa-solid fa-microchip", desc: "Machine learning, neural networks, and the future of AI." },
  { slug: "technology",         label: "Technology",         icon: "fa-solid fa-laptop",              desc: "Innovation, gadgets, and the impact of tech on society." },
  { slug: "art",                label: "Art",                icon: "fa-solid fa-palette",             desc: "Painting, photography, design, and visual culture explored." },
  { slug: "music",              label: "Music",              icon: "fa-solid fa-music",               desc: "Music theory, artist biographies, and the history of sound." },
  { slug: "cooking",            label: "Cooking",            icon: "fa-solid fa-utensils",            desc: "Recipes, culinary techniques, and food culture worldwide." },
  { slug: "travel",             label: "Travel",             icon: "fa-solid fa-earth-americas",      desc: "Adventures, destinations, and stories from around the globe." },
  { slug: "nature",             label: "Nature",             icon: "fa-solid fa-leaf",                desc: "Wildlife, ecology, environment, and the beauty of the natural world." },
  { slug: "children",           label: "Children",           icon: "fa-solid fa-child",               desc: "Imaginative tales and learning stories for young readers." },
  { slug: "comics",             label: "Comics",             icon: "fa-solid fa-book-open",           desc: "Graphic novels and illustrated stories for all ages." },
  { slug: "poetry",             label: "Poetry",             icon: "fa-solid fa-feather",             desc: "Verses and lyrical writing that capture the human soul." },
];

export function renderGeners(container) {
  container.innerHTML = `
    <div class="generes-page container mt-5 pt-5">
      <div class="mb-4 border-bottom pb-3">
        <h1 class="playfair playfair-800 section-title mb-0">Browse Genres</h1>
      </div>
      ${SearchInput("Search for genres...", "search-element")}
      <div class="genres-grid-container"></div>
    </div>
  `;

  const genresGridContainer = container.querySelector(".genres-grid-container");
  if (genresGridContainer) {
    genresGridContainer.innerHTML = createGenresGrid(generes);
    attachGenreClickListener(genresGridContainer);
  }

  const searchItem = container.querySelector('.search-element');
  if (searchItem) {
    searchItem.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const searchedGeners = generes.filter((g) => g.label.toLowerCase().includes(searchTerm));

      if (searchedGeners.length === 0) {
        genresGridContainer.innerHTML = `
          <div class="text-center py-5">
            <i class="fa-solid fa-magnifying-glass fa-2x mb-3" style="color: var(--gray)"></i>
            <p class="inter inter-500" style="color: var(--gray)">No genres found for "<strong>${e.target.value}</strong>"</p>
          </div>
        `;
        return;
      }

      genresGridContainer.innerHTML = createGenresGrid(searchedGeners);
      attachGenreClickListener(genresGridContainer);
    });
  }
}
