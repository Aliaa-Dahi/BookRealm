import './auth-modal.css'

export default function getAuthModal(){
    return `<div class="modal fade" id="authModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content library-card border-0">
      <div class="library-card-inner">
        <button type="button" class="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style="z-index: 10;"></button>
        
        <p class="library-subtitle script-font">Welcome back, BookRealm.</p>

        <div class="auth-fields d-flex flex-column gap-3 mt-4 mb-4">

          <!-- Register only: First Name + Last Name row -->
          <div id="field-names" class="d-none d-flex gap-3">
            <div class="library-input-group flex-fill">
              <label class="library-label inter text-uppercase">First Name</label>
              <div class="input-icon-wrapper">
                <input id="input-first-name" type="text" class="library-input inter" placeholder="First name...">
                <i class="fa-regular fa-user"></i>
              </div>
            </div>
            <div class="library-input-group flex-fill">
              <label class="library-label inter text-uppercase">Last Name</label>
              <div class="input-icon-wrapper">
                <input id="input-last-name" type="text" class="library-input inter" placeholder="Last name...">
              </div>
            </div>
          </div>

          <!-- Email (always visible) -->
          <div class="library-input-group">
            <label class="library-label inter text-uppercase">Email</label>
            <div class="input-icon-wrapper">
              <input id="input-email" type="email" class="library-input inter" placeholder="your@email.com">
              <i class="fa-regular fa-envelope"></i>
            </div>
          </div>

          <!-- Password (always visible) -->
          <div class="library-input-group">
            <label class="library-label inter text-uppercase">Password</label>
            <div class="input-icon-wrapper">
              <input id="input-password" type="password" class="library-input inter" placeholder="••••••••">
              <i class="fa-solid fa-key"></i>
            </div>
          </div>

        </div>
        
        <div class="d-flex justify-content-center mt-3">
          <button id="auth-submit-btn" type="button" class="main-btn inter inter-600 w-100">Login</button>
        </div>
      </div>
    </div>
  </div>
</div>`
 }

const MODAL_CONFIG = {
  login: {
    subtitle: "Welcome back, BookRealm.",
    showNames: false,
    btnText: "Login",
  },
  register: {
    subtitle: "Join us, BookRealm.",
    showNames: true,
    btnText: "Register",
  },
};

export function updateAuthModal(authType) {
  const config = MODAL_CONFIG[authType] ?? MODAL_CONFIG.login;
  const modalEl = document.getElementById("authModal");
  if (!modalEl) return;

  // Update subtitle
  modalEl.querySelector(".library-subtitle").textContent = config.subtitle;

  // Show/hide first name + last name row
  const namesRow = modalEl.querySelector("#field-names");
  namesRow.classList.toggle("d-none", !config.showNames);
  namesRow.classList.toggle("d-flex", config.showNames);

  // Update submit button text
  modalEl.querySelector("#auth-submit-btn").textContent = config.btnText;
}