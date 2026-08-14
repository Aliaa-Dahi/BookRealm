import { getCurrentUser, getUsers, getUserInitials } from "../componenets/AuthModal/auth.service.js";
import { loadFavoritesSection, loadWatchlistSection } from "../componenets/Profile/profile-tabs.js";
import { getFavorites, getReadList } from "../services/list.service.js";
import "../css/profile.css";

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

  // Dynamically count total books across lists
  const favCount = (getFavorites()?.books || []).length;
  const readListCount = (getReadList()?.books || []).length;
  const totalBooksCount = favCount + readListCount;

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
                  <span class="profile-display-name">@${username}</span>
                  <span class="profile-join-date ms-2">• Joined ${joinDateFormatted}</span>
                </p>
                <div class="mt-2">
                  <button type="button" class="btn sub-btn btn-sm d-inline-flex align-items-center gap-2">
                    <i class="fa-regular fa-pen-to-square"></i> Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <!-- Stats Counters Right -->
            <div class="d-flex align-items-center gap-4">
              <div class="text-center">
                <div class="profile-stat-number">${totalBooksCount}</div>
                <div class="profile-stat-label">Books</div>
              </div>
              <div class="text-center">
                <div class="profile-stat-number">2</div>
                <div class="profile-stat-label">Lists</div>
              </div>
              <div class="text-center">
                <div class="profile-stat-number">${staticFollowing.length}</div>
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
              <a class="nav-link active inter" data-tab="all" href="#profile">All</a>
            </li>
            <li class="nav-item">
              <a class="nav-link inter" data-tab="favourites" href="#favourites">Favourites (${favCount})</a>
            </li>
            <li class="nav-item">
              <a class="nav-link inter" data-tab="watchlist" href="#watchlist">Watchlist (${readListCount})</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Main Profile Content -->
      <div class="container">
        
        <!-- FAVORITE BOOKS SECTION -->
        <section id="section-favourites" class="mb-5 profile-tab-section">
          <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
            <h6 class="profile-section-title mb-0 d-flex align-items-center gap-2">
              <i class="fa-solid fa-heart text-danger"></i> Favorite Books
            </h6>
          </div>
          <div id="profile-favorites-container"></div>
        </section>

        <!-- WATCHLIST (READ LIST) SECTION -->
        <section id="section-watchlist" class="mb-5 profile-tab-section">
          <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
            <h6 class="profile-section-title mb-0 d-flex align-items-center gap-2">
              <i class="fa-solid fa-eye" style="color: var(--secondary);"></i> Watchlist (Want to Read)
            </h6>
          </div>
          <div id="profile-watchlist-container"></div>
        </section>

        <!-- FOLLOWING SECTION -->
        <section id="section-following" class="mb-4 profile-tab-section">
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

  // Asynchronously load the Favorites and Watchlist book grids
  const favContainer = document.getElementById('profile-favorites-container');
  const watchContainer = document.getElementById('profile-watchlist-container');

  loadFavoritesSection(favContainer);
  loadWatchlistSection(watchContainer);

  // Bind tab switching interactivity
  const tabLinks = container.querySelectorAll('.profile-nav-tabs .nav-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetTab = link.getAttribute('data-tab');
      const sections = container.querySelectorAll('.profile-tab-section');

      if (targetTab === 'all') {
        sections.forEach(s => s.style.display = 'block');
      } else {
        sections.forEach(s => {
          if (s.id === `section-${targetTab}`) {
            s.style.display = 'block';
          } else {
            s.style.display = 'none';
          }
        });
      }
    });
  });
}