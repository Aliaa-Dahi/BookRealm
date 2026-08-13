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
  return `<!-- Nav -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm d-none d-md-block">
      <div class="container-fluid">
        <a class="navbar-brand playfair playfair-900" href="/">BookRealm</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/books">Books</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/geners">Genres</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#my-lists">My Lists</a>
            </li>
          </ul>

          <div class="auth-buttons d-flex align-items-center gap-2">
            <!-- Logged Out View (Desktop) -->
            <div class="logged-out-view d-flex gap-2">
              <a href="#" class="auth-btn main-btn" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="login">Login</a>
              <a href="#" class="auth-btn sub-btn" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="register">Register</a>
            </div>

            <!-- Logged In View (Desktop: Circle on left of Logout button) -->
            <div class="logged-in-view d-none align-items-center gap-3">
              <a href="/profile" class="text-decoration-none" title="User Profile">
                <div class="user-avatar-circle">
                  <span class="user-initials-text"></span>
                </div>
              </a>
              <button type="button" class="auth-btn sub-btn logout-btn">Logout</button>
            </div>
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
            <a href="/profile" class="text-decoration-none" title="User Profile">
              <div class="user-avatar-circle">
                <span class="user-initials-text"></span>
              </div>
            </a>
            <a href="/profile" class="text-decoration-none text-dark">
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
            <a href="#" class="auth-btn main-btn d-block mb-3" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="login">Login</a>
            <a href="#" class="auth-btn sub-btn d-block" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="register">Register</a>
          </div>

          <!-- Logged In View Logout Button (Mobile Bottom) -->
          <div class="logged-in-view d-none">
            <button type="button" class="auth-btn sub-btn logout-btn w-100">Logout</button>
          </div>
        </div>
      </div>
    </div>`;
}