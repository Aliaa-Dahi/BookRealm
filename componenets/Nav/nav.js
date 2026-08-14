import './nav.css';
import { getCurrentUser, getUserInitials, logoutUser } from '../AuthModal/auth.service.js';
import { showToast } from '../../utils/toast.js';

export function updateActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash || '#';

  navLinks.forEach(link => {
    const linkUrl = link.href;                 // Absolute URL
    const linkPath = link.pathname;             // Pathname
    const linkHash = link.hash || '#';         // Hash anchor

    let isMatch = false;

    // 1. If the link points to a hash/section on the CURRENT page
    if (linkPath === currentPath && link.getAttribute('href').startsWith('#')) {
      isMatch = (linkHash === currentHash);
    }
    // 2. If the link points to a completely different page (multi-page)
    else {
      isMatch = (linkUrl === currentUrl || linkPath === currentPath);
    }

    // Toggle active class
    link.classList.toggle('active', isMatch);
  });
}

// ── Auth Navigation UI State ──────────────────────────────────────────────────

export function renderAuthNav() {
  const user = getCurrentUser();
  const initials = getUserInitials(user);

  document.querySelectorAll('.logged-out-view').forEach(el => {
    el.classList.toggle('d-none', !!user);
    el.classList.toggle('d-flex', !user);
  });

  document.querySelectorAll('.logged-in-view').forEach(el => {
    el.classList.toggle('d-none', !user);
    el.classList.toggle('d-flex', !!user);
  });

  if (user) {
    const profileUrl = `/users/${user.user_name || 'profile'}`;
    document.querySelectorAll('.user-profile-link').forEach(el => el.setAttribute('href', profileUrl));
    document.querySelectorAll('.user-initials-text').forEach(el => (el.textContent = initials));
    document.querySelectorAll('.user-fullname-text').forEach(
      el => (el.textContent = `${user.firstName} ${user.lastName}`)
    );
    document.querySelectorAll('.user-avatar-circle').forEach(
      el => (el.title = `${user.firstName} ${user.lastName}`)
    );
  }
}

// Listen for auth state changes & page load
window.addEventListener('hashchange', updateActiveLink);
window.addEventListener('authChange', renderAuthNav);
document.addEventListener('DOMContentLoaded', () => {
  updateActiveLink();
  renderAuthNav();
});

// Delegated click handler for logout buttons
document.addEventListener('click', e => {
  if (e.target && e.target.classList.contains('logout-btn')) {
    logoutUser();
    showToast('You have logged out.', 'info');
  }
});

export default function getNav() {
  const user = getCurrentUser();
  const profileUrl = user && user.user_name ? `/users/${user.user_name}` : '/users/profile';

  return `
    <!-- Desktop Nav -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top d-none d-md-flex p-2">
      <div class="container d-flex justify-content-between align-items-center">
        <a class="navbar-brand playfair playfair-900 fs-3" href="/">BookRealm</a>

        <div class="d-flex align-items-center gap-5" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/geners">Genres</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/books">Books</a>
            </li>
          </ul>

          
          </div>
          <div class="auth-buttons">
            <!-- Logged Out View -->
            <div class="logged-out-view d-flex gap-3">
              <button type="button" class="btn sub-btn d-inline-flex align-items-center gap-2" data-bs-toggle="modal"
                data-bs-target="#authModal" data-tab="login">Login</button>
              <button type="button" class="btn main-btn d-inline-flex align-items-center gap-2" data-bs-toggle="modal"
                data-bs-target="#authModal" data-tab="register">Register</button>
            </div>

            <!-- Logged In View (Desktop: Circle on left of Logout button) -->
            <div class="logged-in-view d-none align-items-center gap-3">
              <a href="${profileUrl}" class="text-decoration-none user-profile-link" title="User Profile">
                <div class="user-avatar-circle">
                  <span class="user-initials-text"></span>
                </div>
              </a>
              <button type="button" class="btn sub-btn d-inline-flex align-items-center gap-2 logout-btn">Logout</button>
            </div>
          </div>
      </div>
    </nav>

    <!-- Mobile Nav -->
    <div class="mobile-nav d-md-none">
      <div class="container-fluid bg-body-tertiary d-flex justify-content-between shadow-sm p-3">
        <a class="navbar-brand playfair playfair-900 " href="/">BookRealm</a>

        <button class="bars-icon" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"><i class="fa-solid fa-bars"></i></button>
      </div>

    </div>

    <!-- OffCanvas (Mobile) -->
    <div class="offcanvas offcanvas-start pt-2" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title playfair playfair-900" id="offcanvasRightLabel">BookRealm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column justify-content-between">
        <div>
          <!-- Logged In View (Mobile: On TOP of links tabs) -->
          <div class="logged-in-view d-none align-items-center gap-3 mb-4 p-3 bg-light rounded shadow-sm border">
            <a href="${profileUrl}" class="text-decoration-none user-profile-link" title="User Profile">
              <div class="user-avatar-circle">
                <span class="user-initials-text"></span>
              </div>
            </a>
            <a href="${profileUrl}" class="text-decoration-none text-dark user-profile-link">
              <span class="user-fullname-text playfair playfair-700 text-dark" style="font-size: 1.05rem;"></span>
            </a>
          </div>

          <ul class="list-unstyled">
            <li class="mb-3"><a href="/" class="nav-link text-decoration-none text-dark">Home</a></li>
            <li class="mb-3"><a href="/books" class="nav-link text-decoration-none text-dark">Books</a></li>
            <li class="mb-3"><a href="/geners" class="nav-link text-decoration-none text-dark">Genres</a></li>
            <li class="mb-3"><a href="#my-lists" class="nav-link text-decoration-none text-dark">My Lists</a></li>
          </ul>
        </div>

        <div class="mt-4">
          <!-- Logged Out View (Mobile) -->
          <div class="logged-out-view flex-column gap-2">
            <a href="#" class="btn sub-btn d-flex align-items-center justify-content-center gap-2 w-100" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="login">Login</a>
            <a href="#" class="btn main-btn d-flex align-items-center justify-content-center gap-2 w-100" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="register">Register</a>
          </div>

          <!-- Logged In View Logout Button (Mobile Bottom) -->
          <div class="logged-in-view d-none">
            <button type="button" class="btn sub-btn d-inline-flex align-items-center justify-content-center gap-2 w-100 logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </div>`;
}