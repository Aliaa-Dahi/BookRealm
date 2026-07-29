const navLinks = document.querySelectorAll(' .nav-link');

export function updateActiveLink() {
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