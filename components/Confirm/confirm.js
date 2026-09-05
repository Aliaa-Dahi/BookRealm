import './confirm.css';
import { SubBtn } from '../Button/button.js';
import * as bootstrap from 'bootstrap';

/**
 * Renders the structural HTML for the Confirm modal component.
 */
export function renderConfirmModal() {
    return `
        <div class="modal fade" id="confirmModal" tabindex="-1"
             aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm" style="max-width: 420px;">
                <div class="modal-content border-0 p-4 rounded-4 shadow-lg position-relative text-center"
                     style="background-color: var(--paper-bg); color: var(--dark-text);">
                    
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3"
                            data-bs-dismiss="modal" aria-label="Close" style="z-index: 10;"></button>

                    <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                         id="confirmIconWrapper"
                         style="width: 64px; height: 64px; background-color: var(--color-error-bg); border: 1px solid var(--color-error-border); color: var(--color-error); font-size: 1.75rem;">
                        <i id="confirmIcon" class="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <h5 class="playfair playfair-700 mb-2" id="confirmTitle" style="color: var(--primary); font-size: 1.35rem;">
                        Are you sure?
                    </h5>

                    <p class="inter text-center opacity-75 mb-4 small" id="confirmMessage" style="color: var(--dark-text); line-height: 1.5;">
                        This action cannot be undone.
                    </p>

                    <div class="d-flex gap-2 justify-content-center w-100">
                        ${SubBtn("Cancel", "", "w-50", "button", 'data-bs-dismiss="modal"')}
                        <button type="button" id="confirmActionBtn" class="btn btn-confirm-action w-50 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm" style="background-color: var(--color-error); color: #fff; border: none;">
                            <i id="confirmActionIcon" class="fa-solid fa-trash-can"></i>
                            <span id="confirmActionText">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Displays the confirm modal programmatically and handles callback / Promise completion.
 *
 * @param {Object} options
 * @param {string}   [options.title="Are you sure?"]
 * @param {string}   [options.message="This action cannot be undone."]
 * @param {string}   [options.confirmText="Delete"]
 * @param {string}   [options.confirmIcon="fa-solid fa-trash-can"]
 * @param {string}   [options.icon="fa-solid fa-triangle-exclamation"]
 * @param {Function} [options.onConfirm]
 * @returns {Promise<boolean>}
 */
export function showConfirm({
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    confirmIcon = 'fa-solid fa-trash-can',
    icon = 'fa-solid fa-triangle-exclamation',
    onConfirm
} = {}) {
    return new Promise((resolve) => {
        let modalEl = document.getElementById('confirmModal');

        if (!modalEl) {
            const div = document.createElement('div');
            div.innerHTML = renderConfirmModal();
            modalEl = div.firstElementChild;
            document.body.appendChild(modalEl);
        }

        const titleEl        = modalEl.querySelector('#confirmTitle');
        const messageEl      = modalEl.querySelector('#confirmMessage');
        const actionBtn      = modalEl.querySelector('#confirmActionBtn');
        const actionTextEl   = modalEl.querySelector('#confirmActionText');
        const actionIconEl   = modalEl.querySelector('#confirmActionIcon');
        const confirmIconEl  = modalEl.querySelector('#confirmIcon');

        if (titleEl)       titleEl.textContent = title;
        if (messageEl)     messageEl.textContent = message;
        if (actionTextEl)  actionTextEl.textContent = confirmText;
        if (actionIconEl)  actionIconEl.className = confirmIcon;
        if (confirmIconEl) confirmIconEl.className = icon;

        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);

        const handleConfirmClick = () => {
            modalInstance.hide();
            cleanup();
            if (typeof onConfirm === 'function') onConfirm();
            resolve(true);
        };

        const handleModalHide = () => {
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            actionBtn?.removeEventListener('click', handleConfirmClick);
            modalEl?.removeEventListener('hidden.bs.modal', handleModalHide);
        };

        actionBtn?.addEventListener('click', handleConfirmClick);
        modalEl?.addEventListener('hidden.bs.modal', handleModalHide, { once: true });

        modalInstance.show();
    });
}
