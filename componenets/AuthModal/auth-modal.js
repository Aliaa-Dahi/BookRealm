import './auth-modal.css'

export default function getAuthModal(){
    return `<div class="modal fade" id="authModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content library-card border-0">
      <div class="library-card-inner">
        <button type="button" class="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style="z-index: 10;"></button>
        
        <p class="library-subtitle script-font">Welcome back, BookRealm.</p>
        
        <div class="library-input-group mt-5">
          <label class="library-label inter text-uppercase"> Full Name</label>
          <div class="input-icon-wrapper">
            <input type="text" class="library-input inter" placeholder="Enter your name...">
            <i class="fa-regular fa-user"></i>
          </div>
        </div>
        
        <div class="library-input-group mt-4 mb-5">
          <label class="library-label inter text-uppercase">Password</label>
          <div class="input-icon-wrapper">
            <input type="password" class="library-input inter" placeholder="••••••••">
            <i class="fa-solid fa-key"></i>
          </div>
        </div>
        
        <div class="library-footer">
          <p class="library-footer-text m-0">By signing in, you agree to handle all digital volumes with care and return them to their virtual shelves on time.</p>
          <i class="fa-solid fa-book-open library-footer-icon"></i>
        </div>
      </div>
    </div>
  </div>
</div>`
 }

const MODAL_CONFIG = {
  login: {
    subtitle: "Welcome back, BookRealm.",
    nameLabel: "Patron Username",
    namePlaceholder: "Enter your name...",
  },
  register: {
    subtitle: "Join us, BookRealm.",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name...",
  },
};

export function updateAuthModal(authType) {
  const config = MODAL_CONFIG[authType] ?? MODAL_CONFIG.login;
  const modalEl = document.getElementById("authModal");
  if (!modalEl) return;

  modalEl.querySelector(".library-subtitle").textContent = config.subtitle;
  modalEl.querySelector(".library-label").textContent = config.nameLabel;
  modalEl.querySelector(".library-input[type='text']").placeholder = config.namePlaceholder;
}