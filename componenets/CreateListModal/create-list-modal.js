import './create-list-modal.css';
import { MainBtn, SubBtn } from '../Button/button.js';

/**
 * CreateListModal
 *
 * A "Create New Book List" modal that shares the exact visual identity of the
 * AuthModal — parchment background, noise texture, paper-line underline inputs,
 * script subtitle, and the same padding/structure.
 *
 * Triggered by any element with class `.btn-create-list-trigger`.
 * Form submission is handled externally in profile.js via #create-list-form.
 *
 * @returns {string} HTML string
 */
export function renderCreateListModal() {
    return `
        <div class="modal fade" id="createListModal" tabindex="-1"
             aria-labelledby="createListModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content library-card border-0">
                    <div class="library-card-inner">

                        <!-- Close -->
                        <button type="button" class="btn-close position-absolute"
                                data-bs-dismiss="modal" aria-label="Close"
                                style="z-index: 10;"></button>

                        <!-- Script subtitle — mirrors auth modal -->
                        <p class="library-subtitle script-font">A new chapter begins.</p>

                        <form id="create-list-form">
                            <div class="auth-fields d-flex flex-column gap-3 mt-4 mb-4">

                                <!-- List Name -->
                                <div class="library-input-group">
                                    <label class="library-label inter text-uppercase"
                                           for="list-name-input">List Name</label>
                                    <div class="input-icon-wrapper">
                                        <input id="list-name-input" type="text"
                                               class="library-input inter"
                                               placeholder="e.g. Summer Reads, Sci-Fi Gems"
                                               required autocomplete="off">
                                        <i class="fa-regular fa-bookmark"></i>
                                    </div>
                                </div>

                                <!-- Description -->
                                <div class="library-input-group">
                                    <label class="library-label inter text-uppercase"
                                           for="list-desc-input">Description <span style="opacity:0.5;">(Optional)</span></label>
                                    <textarea id="list-desc-input"
                                              class="library-textarea inter"
                                              rows="3"
                                              placeholder="Describe the theme or contents of this collection..."></textarea>
                                </div>

                            </div>

                            <!-- Actions -->
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
