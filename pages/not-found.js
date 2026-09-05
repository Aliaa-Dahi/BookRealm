import "../css/not-found.css";
import { navigate } from "../js/router.js";

export function renderNotFound(container) {
    container.innerHTML = `
        <div class="nf-page d-flex flex-column align-items-center justify-content-center text-center">

            <div class="nf-ink-drop"></div>

            <div class="nf-content position-relative">
                <p class="nf-eyebrow inter text-uppercase">Page not found</p>

                <div class="nf-code-wrap d-flex align-items-end justify-content-center gap-2 my-3">
                    <span class="nf-four playfair">4</span>
                    <div class="nf-book-spine d-flex flex-column align-items-center justify-content-end">
                        <span class="nf-spine-title">Lost</span>
                    </div>
                    <span class="nf-four playfair">4</span>
                </div>

                <p class="nf-message inter">
                    Looks like this page wandered off the shelf.<br>
                    <span class="nf-sub">Let's get you back to a good book.</span>
                </p>

                <div class="d-flex align-items-center justify-content-center gap-3 mt-4">
                    <button class="btn nf-btn-primary inter" id="nf-home-btn">
                        <i class="fa-solid fa-house me-2"></i>Go Home
                    </button>
                    <button class="btn nf-btn-secondary inter" id="nf-back-btn">
                        <i class="fa-solid fa-arrow-left me-2"></i>Go Back
                    </button>
                </div>
            </div>

        </div>
    `;

    document.getElementById('nf-home-btn').addEventListener('click', () => {
        navigate('/', () => window.__appCallbacks?.showContent());
    });

    document.getElementById('nf-back-btn').addEventListener('click', () => {
        window.history.back();
    });
}
