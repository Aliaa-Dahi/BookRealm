import './auth-modal.css';
import { registerUser, loginUser } from './auth.service.js';

// Track which mode the modal is currently in
let currentAuthType = 'login';

// ── HTML Template ─────────────────────────────────────────────────────────────

export default function getAuthModal() {
  return `<div class="modal fade" id="authModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content library-card border-0">
      <div class="library-card-inner">
        <button type="button" class="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style="z-index: 10;"></button>

        <p class="library-subtitle script-font">Welcome back, BookRealm.</p>

        <div class="auth-fields d-flex flex-column gap-3 mt-4 mb-4">

        <form id="auth-form">
          <div class="auth-fields d-flex flex-column gap-3 mt-4 mb-4">

            <!-- Register only: First Name + Last Name row -->
            <div id="field-names" class="d-none gap-3">
              <div class="library-input-group flex-fill">
                <label class="library-label inter text-uppercase">First Name</label>
                <div class="input-icon-wrapper">
                  <input id="input-firstName" type="text" class="library-input inter" placeholder="First name...">
                  <i class="fa-regular fa-user"></i>
                </div>
                <p class="auth-error-msg d-none" id="error-firstName"></p>
              </div>
              <div class="library-input-group flex-fill">
                <label class="library-label inter text-uppercase">Last Name</label>
                <div class="input-icon-wrapper">
                  <input id="input-lastName" type="text" class="library-input inter" placeholder="Last name...">
                </div>
                <p class="auth-error-msg d-none" id="error-lastName"></p>
              </div>
            </div>

            <!-- Email (always visible) -->
            <div class="library-input-group">
              <label class="library-label inter text-uppercase">Email</label>
              <div class="input-icon-wrapper">
                <input id="input-email" type="email" class="library-input inter" placeholder="your@email.com">
                <i class="fa-regular fa-envelope"></i>
              </div>
              <p class="auth-error-msg d-none" id="error-email"></p>
            </div>

            <!-- Password (always visible) -->
            <div class="library-input-group">
              <label class="library-label inter text-uppercase">Password</label>
              <div class="input-icon-wrapper">
                <input id="input-password" type="password" class="library-input inter" placeholder="••••••••">
                <i id="toggle-password-btn" class="fa-regular fa-eye-slash toggle-password-icon" style="cursor: pointer;"></i>
              </div>
              <p class="auth-error-msg d-none" id="error-password"></p>
            </div>

          </div>

          <p class="auth-error-msg auth-general-error d-none text-center mb-2" id="error-general"></p>

          <div class="d-flex justify-content-center mt-3">
            <button id="auth-submit-btn" type="submit" class="main-btn inter inter-600 w-100">Login</button>
          </div>
        </form>

        <p class="auth-switch-text text-center mt-3 mb-0 inter" id="auth-switch">
          <span id="auth-switch-prompt">Don't have an account?</span>
          <a href="#" id="auth-switch-link" class="auth-switch-link fw-semibold ms-1">Register</a>
        </p>
      </div>
    </div>
  </div>
</div>`;
}

// ── Config ────────────────────────────────────────────────────────────────────

const MODAL_CONFIG = {
  login: {
    subtitle: 'Welcome back, BookRealm.',
    showNames: false,
    btnText: 'Login',
    switchPrompt: "Don't have an account?",
    switchLinkText: 'Register',
    switchTargetType: 'register',
  },
  register: {
    subtitle: 'Join us, BookRealm.',
    showNames: true,
    btnText: 'Register',
    switchPrompt: 'Already have an account?',
    switchLinkText: 'Login',
    switchTargetType: 'login',
  },
};

// ── Error helpers ─────────────────────────────────────────────────────────────

function showError(fieldId, message) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('d-none');
  }
  const inputEl = document.getElementById(`input-${fieldId}`);
  inputEl?.classList.add('input-error');
}

function clearAllErrors() {
  document.querySelectorAll('.auth-error-msg').forEach(el => {
    el.textContent = '';
    el.classList.add('d-none');
  });
  document.querySelectorAll('.library-input').forEach(el => {
    el.classList.remove('input-error');
  });
}

// ── Submit handler ────────────────────────────────────────────────────────────

async function handleSubmit() {
  clearAllErrors();

  const email     = document.getElementById('input-email').value.trim();
  const password  = document.getElementById('input-password').value;
  const firstName = document.getElementById('input-firstName')?.value.trim() ?? '';
  const lastName  = document.getElementById('input-lastName')?.value.trim() ?? '';

  try {
    if (currentAuthType === 'register') {
      await registerUser({ firstName, lastName, email, password });
      alert(`Welcome, ${firstName}! Your account has been created.`);
    } else {
      const user = await loginUser({ email, password });
      alert(`Welcome back, ${user.firstName}!`);
    }

    // Close modal on success
    const modalEl = document.getElementById('authModal');
    const bsModal = window.bootstrap?.Modal?.getInstance(modalEl);
    bsModal?.hide();

  } catch (err) {
    if (err.inner?.length > 0) {
      // Multiple Yup errors (abortEarly: false)
      err.inner.forEach(e => showError(e.path, e.message));
    } else if (err.path) {
      // Single Yup error
      showError(err.path, err.message);
    }
  }
}

// ── updateAuthModal (called from index.js on show.bs.modal & toggle link) ────

export function updateAuthModal(authType) {
  currentAuthType = authType ?? 'login';
  const config  = MODAL_CONFIG[currentAuthType];
  const modalEl = document.getElementById('authModal');
  if (!modalEl) return;

  clearAllErrors();

  // Reset all inputs
  modalEl.querySelectorAll('.library-input').forEach(input => (input.value = ''));

  // Reset password input visibility and icon
  const passInput = modalEl.querySelector('#input-password');
  const toggleIcon = modalEl.querySelector('#toggle-password-btn');
  if (passInput && toggleIcon) {
    passInput.type = 'password';
    toggleIcon.className = 'fa-regular fa-eye-slash toggle-password-icon';
    toggleIcon.onclick = () => {
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      toggleIcon.className = isPassword
        ? 'fa-regular fa-eye toggle-password-icon'
        : 'fa-regular fa-eye-slash toggle-password-icon';
    };
  }

  // Update subtitle
  modalEl.querySelector('.library-subtitle').textContent = config.subtitle;

  // Show/hide first name + last name row
  const namesRow = modalEl.querySelector('#field-names');
  namesRow.classList.toggle('d-none', !config.showNames);
  namesRow.classList.toggle('d-flex', config.showNames);

  // Update submit button text and form submit handler
  const btn = modalEl.querySelector('#auth-submit-btn');
  btn.textContent = config.btnText;

  const form = modalEl.querySelector('#auth-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      handleSubmit();
    };
  }

  // Update mode toggle link text & handler
  const switchPromptEl = modalEl.querySelector('#auth-switch-prompt');
  const switchLinkEl   = modalEl.querySelector('#auth-switch-link');
  if (switchPromptEl && switchLinkEl) {
    switchPromptEl.textContent = config.switchPrompt;
    switchLinkEl.textContent   = config.switchLinkText;
    switchLinkEl.onclick = (e) => {
      e.preventDefault();
      updateAuthModal(config.switchTargetType);
    };
  }
}