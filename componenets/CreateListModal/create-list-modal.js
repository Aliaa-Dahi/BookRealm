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

                        <p class="library-subtitle script-font">A new chapter begins.</p>

                        <form id="create-list-form">
                            <div class="d-flex flex-column gap-3 mt-4 mb-4">

                                <!-- List Name -->
                                <div class="mb-4">
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
                                <div class="mb-4">
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
                                ${MainBtn("Create List", "fa-solid fa-plus", "w-100", "submit")}
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    `;
}
