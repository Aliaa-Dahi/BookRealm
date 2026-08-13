import './nav.css';

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

// Update the active state dynamically when the URL hash changes
window.addEventListener('hashchange', updateActiveLink);
updateActiveLink()

export default function getNav(){
    
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

          <div class="auth-buttons d-flex gap-2">
            <a href="#" class="auth-btn main-btn" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="login">Login</a>
            <a href="#" class="auth-btn sub-btn" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="register">Register</a>
          </div>

        </div>
      </div>
    </nav>

    <!-- Mobile Nan -->
    <div class="mobile-nav d-md-none">
      <div class="container-fluid bg-body-tertiary d-flex justify-content-between shadow-sm p-3">
        <a class="navbar-brand playfair playfair-900 " href="/">BookRealm</a>

        <button class="bars-icon" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"><i class="fa-solid fa-bars"></i></button>
      </div>

    </div>

    <!-- OffCanvas -->
    <div class="offcanvas offcanvas-start pt-2" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title playfair playfair-900" id="offcanvasRightLabel">BookRealm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column justify-content-between">
        <ul class="list-unstyled">
          <li class="mb-3"><a href="/" class="nav-link text-decoration-none text-dark">Home</a></li>
          <li class="mb-3"><a href="/geners" class="nav-link text-decoration-none text-dark">Genres</a></li>
          <li class="mb-3"><a href="#my-lists" class="nav-link text-decoration-none text-dark">My Lists</a></li>
        </ul>

        <div class="mt-4">
          <a href="#" class="auth-btn main-btn d-block mb-3" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="login">Login</a>
          <a href="#" class="auth-btn sub-btn d-block" data-bs-toggle="modal" data-bs-target="#authModal" data-bs-auth-type="register">Register</a>
        </div>
      </div>
    </div>`
}