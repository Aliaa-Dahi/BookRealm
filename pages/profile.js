import createBooksGrid from "../componenets/BooksContainer/books-container.js";
import { getCurrentUser, getUsers, getUserInitials } from "../componenets/AuthModal/auth.service.js";
import "../css/profile.css";

// Static dataset for Favorite Books
const staticFavoriteBooks = [
  {
    key: "/works/OL27448W",
    title: "The Hobbit",
    cover_id: 8406785,
    author_name: "J.R.R. Tolkien",
    first_publish_year: 1937,
    edition_count: 342,
    rating: "4.8"
  },
  {
    key: "/works/OL82586W",
    title: "Harry Potter and the Sorcerer's Stone",
    cover_id: 10521270,
    author_name: "J.K. Rowling",
    first_publish_year: 1997,
    edition_count: 512,
    rating: "4.9"
  },
  {
    key: "/works/OL27479W",
    title: "Pride and Prejudice",
    cover_id: 10515152,
    author_name: "Jane Austen",
    first_publish_year: 1813,
    edition_count: 1250,
    rating: "4.7"
  },
  {
    key: "/works/OL1168083W",
    title: "To Kill a Mockingbird",
    cover_id: 8228691,
    author_name: "Harper Lee",
    first_publish_year: 1960,
    edition_count: 489,
    rating: "4.8"
  }
];

// Static dataset for Recent Likes
const staticRecentLikes = [
  {
    key: "/works/OL21636838W",
    title: "The Name of the Wind",
    cover_id: 8231996,
    author_name: "Patrick Rothfuss",
    first_publish_year: 2007,
    edition_count: 94,
    rating: "4.6"
  },
  {
    key: "/works/OL15358693W",
    title: "Dune",
    cover_id: 9112040,
    author_name: "Frank Herbert",
    first_publish_year: 1965,
    edition_count: 318,
    rating: "4.7"
  },
  {
    key: "/works/OL17342898W",
    title: "The Way of Kings",
    cover_id: 12547191,
    author_name: "Brandon Sanderson",
    first_publish_year: 2010,
    edition_count: 67,
    rating: "4.9"
  },
  {
    key: "/works/OL17358742W",
    title: "1984",
    cover_id: 8575704,
    author_name: "George Orwell",
    first_publish_year: 1949,
    edition_count: 980,
    rating: "4.7"
  }
];

// Static Following user list
const staticFollowing = [
  { initials: "ES", name: "Emma Smith" },
  { initials: "MR", name: "Michael Read" },
  { initials: "AC", name: "Arthur Conan" }
];

export function renderProfile(container) {
  if (!container) return;

  // Extract user_name from URL path (e.g., /users/john_doe_1723589000123)
  const pathParts = window.location.pathname.split('/');
  const urlUsername = (pathParts[1] === 'users' && pathParts[2]) ? pathParts[2] : null;

  const currentUser = getCurrentUser();
  const allUsers = getUsers();

  let user = null;
  if (urlUsername) {
    user = allUsers.find(u => u.user_name === urlUsername);
  }
  if (!user) {
    user = currentUser || {
      firstName: "Aliaa",
      lastName: "Mohamad",
      user_name: "aliaa_mohamad_1723589000000",
      join_date: new Date().toISOString()
    };
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || 'Reader Profile';

  const username = user.user_name || (user.firstName ? user.firstName.toLowerCase() : 'user');
  const initials = getUserInitials(user) || 'A';

  const joinDateFormatted = user.join_date
    ? new Date(user.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div class="profile-page pb-5">

      <!-- Header Banner Section -->
      <div class="profile-header-banner pt-5 pb-4 shadow-sm">
        <div class="container pt-4">
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
            
            <!-- User Info Left -->
            <div class="d-flex align-items-center gap-3">
              <div class="profile-avatar-large shadow">
                <span>${initials}</span>
              </div>
              <div>
                <h2 class="profile-username playfair playfair-900 mb-0 fs-2">${displayName}</h2>
                <p class="mb-1 mt-1 small">
                  <span class="profile-display-name">${username}</span>
                  <span class="profile-join-date ms-2">• Joined ${joinDateFormatted}</span>
                </p>
                <div class="mt-2">
                  <button type="button" class="sub-btn btn-sm text-uppercase px-3 py-1 fw-semibold small">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <!-- Stats Counters Right -->
            <div class="d-flex align-items-center gap-4">
              <div class="text-center">
                <div class="profile-stat-number">100</div>
                <div class="profile-stat-label">Books</div>
              </div>
              <div class="text-center">
                <div class="profile-stat-number">4</div>
                <div class="profile-stat-label">Lists</div>
              </div>
              <div class="text-center">
                <div class="profile-stat-number">3</div>
                <div class="profile-stat-label">Following</div>
              </div>
              <div class="text-center">
                <div class="profile-stat-number">3</div>
                <div class="profile-stat-label">Followers</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Sub-Nav Filter Tabs -->
      <div class="profile-subnav mb-5 shadow-sm">
        <div class="container">
          <ul class="nav profile-nav-tabs flex-nowrap overflow-x-auto">
            <li class="nav-item">
              <a class="nav-link active inter" href="#profile">Profile</a>
            </li>
            <li class="nav-item">
              <a class="nav-link inter" href="#books">Books</a>
            </li>
            <li class="nav-item">
              <a class="nav-link inter" href="#reviews">Reviews</a>
            </li>
            <li class="nav-item">
              <a class="nav-link inter" href="#watchlist">Watchlist</a>
            </li>
            <li class="nav-item">
              <a class="nav-link inter" href="#lists">Lists</a>
            </li>
            <li class="nav-item">
              <a class="nav-link inter" href="#likes">Likes</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Main Profile Content -->
      <div class="container">
        
        <!-- FAVORITE BOOKS SECTION -->
        <section class="mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
            <h6 class="profile-section-title mb-0">Favorite Books</h6>
          </div>
          ${createBooksGrid(staticFavoriteBooks)}
        </section>

        <!-- RECENT LIKES SECTION -->
        <section class="mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
            <h6 class="profile-section-title mb-0">Recent Likes</h6>
            <a href="/books?q=popular" class="profile-section-link text-decoration-none">
              <i class="fa-solid fa-heart me-1"></i> ALL
            </a>
          </div>
          ${createBooksGrid(staticRecentLikes)}
        </section>

        <!-- FOLLOWING SECTION -->
        <section class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
            <h6 class="profile-section-title mb-0">Following (${staticFollowing.length})</h6>
          </div>
          <div class="d-flex align-items-center gap-3">
            ${staticFollowing.map(f => `
              <div class="following-circle shadow-sm" title="${f.name}">
                ${f.initials}
              </div>
            `).join('')}
          </div>
        </section>

      </div>

    </div>
  `;
}