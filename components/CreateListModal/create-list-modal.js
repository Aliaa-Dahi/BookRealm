import './create-list-modal.css';
import { MainBtn, SubBtn } from '../Button/button.js';

export function renderCreateListModal() {
    return `
        <div class="modal fade" id="createListModal" tabindex="-1"
             aria-labelledby="createListModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content library-card border-0 position-relative">
                    <div class="library-card-inner">

                        <button type="button" class="btn-close position-absolute"
                                data-bs-dismiss="modal" aria-label="Close"
                                style="z-index: 10;"></button>

                        <h5 class="playfair playfair-700 modal-title mb-1" id="listModalTitle">Create List</h5>
                        <p class="library-subtitle script-font mb-0" id="listModalSubtitle">A new chapter begins.</p>

                        <form id="create-list-form" data-mode="create" data-list-key="">
                            <div class="d-flex flex-column gap-3 mt-3 mb-4">

                                <!-- List Name -->
                                <div class="mb-3">
                                    <label class="library-label inter text-uppercase form-label w-100"
                                           for="list-name-input">List Name</label>
                                    <div class="input-icon-wrapper">
                                        <input id="list-name-input" type="text"
                                               class="library-input inter w-100"
                                               placeholder="e.g. Summer Reads, Sci-Fi Gems"
                                               required autocomplete="off">
                                        <i class="fa-regular fa-bookmark"></i>
                                    </div>
                                </div>

                                <!-- Description -->
                                <div class="mb-3">
                                    <label class="library-label inter text-uppercase form-label w-100"
                                           for="list-desc-input">
                                        Description
                                        <span class="fw-normal opacity-50 ms-1">(Optional)</span>
                                    </label>
                                    <textarea id="list-desc-input"
                                              class="library-textarea inter w-100"
                                              rows="3"
                                              placeholder="Describe the theme or contents of this collection..."></textarea>
                                </div>

                            </div>

                            <div class="d-flex gap-3 mt-2">
                                ${SubBtn("Cancel", "", "w-100", "button", 'data-bs-dismiss="modal"')}
                                <button type="submit" class="btn main-btn w-100">
                                    <i id="listModalSubmitIcon" class="fa-solid fa-plus me-1"></i>
                                    <span id="listModalSubmitText">Create List</span>
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    `;
}

export function setupListModal(mode = 'create', listKey = '', name = '', description = '') {
    const modalEl = document.getElementById('createListModal');
    if (!modalEl) return;

    const form = modalEl.querySelector('#create-list-form');
    const titleEl = modalEl.querySelector('#listModalTitle');
    const subtitleEl = modalEl.querySelector('#listModalSubtitle');
    const submitTextEl = modalEl.querySelector('#listModalSubmitText');
    const submitIconEl = modalEl.querySelector('#listModalSubmitIcon');
    const nameInput = modalEl.querySelector('#list-name-input');
    const descInput = modalEl.querySelector('#list-desc-input');

    if (form) {
        form.dataset.mode = mode;
        form.dataset.listKey = listKey;
    }

    if (mode === 'edit') {
        if (titleEl) titleEl.textContent = 'Edit List';
        if (subtitleEl) subtitleEl.textContent = 'Update your curated collection.';
        if (submitTextEl) submitTextEl.textContent = 'Save Changes';
        if (submitIconEl) submitIconEl.className = 'fa-solid fa-check me-1';
        if (nameInput) nameInput.value = name || '';
        if (descInput) descInput.value = description || '';
    } else {
        if (titleEl) titleEl.textContent = 'Create List';
        if (subtitleEl) subtitleEl.textContent = 'A new chapter begins.';
        if (submitTextEl) submitTextEl.textContent = 'Create List';
        if (submitIconEl) submitIconEl.className = 'fa-solid fa-plus me-1';
        if (nameInput) nameInput.value = '';
        if (descInput) descInput.value = '';
    }
}
