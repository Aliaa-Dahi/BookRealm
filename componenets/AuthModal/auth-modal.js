import './auth-modal.css';
import { registerUser, loginUser } from '../../services/auth.service.js';
import { showToast } from '../../utils/toast.js';
import { Modal } from 'bootstrap';

// Track which mode the modal is currently in
let currentAuthType = 'login';

// ── HTML Template ─────────────────────────────────────────────────────────────

export default function getAuthModal() {
  return `<div class="modal fade" id="authModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content library-card border-0 position-relative">
      <div class="library-card-inner">
        <button type="button" class="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style="z-index: 10;"></button>

        <p class="library-subtitle script-font">Welcome back, BookRealm.</p>

        <form id="auth-form">
          <div class="d-flex flex-column gap-3 mt-4 mb-4">

            <!-- Register only: First Name + Last Name row -->
            <div id="field-names" class="d-none gap-3">
              <div class="mb-4 flex-fill">
                <label class="library-label inter text-uppercase form-label w-100">First Name</label>
                <div class="input-icon-wrapper">
                  <input id="input-firstName" type="text" class="library-input inter w-100" placeholder="First name...">
                  <i class="fa-regular fa-user"></i>
                </div>
                <p class="auth-error-msg d-none mt-1" id="error-firstName"></p>
              </div>
              <div class="mb-4 flex-fill">
                <label class="library-label inter text-uppercase form-label w-100">Last Name</label>
                <div class="input-icon-wrapper">
                  <input id="input-lastName" type="text" class="library-input inter w-100" placeholder="Last name...">
                </div>
                <p class="auth-error-msg d-none mt-1" id="error-lastName"></p>
              </div>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="library-label inter text-uppercase form-label w-100">Email</label>
              <div class="input-icon-wrapper">
                <input id="input-email" type="email" class="library-input inter w-100" placeholder="your@email.com">
                <i class="fa-regular fa-envelope"></i>
              </div>
              <p class="auth-error-msg d-none mt-1" id="error-email"></p>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="library-label inter text-uppercase form-label w-100">Password</label>
              <div class="input-icon-wrapper">
                <input id="input-password" type="password" class="library-input inter w-100" placeholder="••••••••">
                <i id="toggle-password-btn" class="fa-regular fa-eye-slash toggle-password-icon" style="cursor: pointer;"></i>
              </div>
              <p class="auth-error-msg d-none mt-1" id="error-password"></p>
            </div>

          </div>

          <p class="auth-error-msg auth-general-error d-none text-center mb-2" id="error-general"></p>

          <div class="mt-3">
            <button id="auth-submit-btn" type="submit" class="btn main-btn d-inline-flex align-items-center gap-2 w-100">Login</button>
          </div>
        </form>

        <p class="text-center mt-3 mb-0 inter small text-opacity-75" id="auth-switch" style="color: var(--dark-text);">
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
      showToast(`Welcome, ${firstName}! Your account has been created.`, 'success');
    } else {
      const user = await loginUser({ email, password });
      showToast(`Welcome back, ${user.firstName}!`, 'success');
    }

    // Close modal on success
    const modalEl = document.getElementById('authModal');
    if (modalEl) {
      const bsModal = Modal.getOrCreateInstance(modalEl);
      bsModal.hide();
    }

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