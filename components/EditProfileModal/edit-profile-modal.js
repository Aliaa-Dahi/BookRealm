/**
 * EditProfileModal
 * Uses the same library-card parchment visual system as AuthModal.
 * Allows the user to update their first name, last name, and optionally change password.
 */
export function renderEditProfileModal() {
    return `
        <div class="modal fade" id="editProfileModal" tabindex="-1"
             aria-labelledby="editProfileModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content library-card border-0 position-relative">
                    <div class="library-card-inner">

                        <button type="button" class="btn-close position-absolute"
                                data-bs-dismiss="modal" aria-label="Close"
                                style="z-index: 10;"></button>

                        <p class="library-subtitle script-font">Your story, your way.</p>

                        <form id="edit-profile-form" novalidate>
                            <div class="d-flex flex-column gap-3 mt-4 mb-4">

                                <!-- First Name + Last Name row -->
                                <div class="d-flex gap-3">
                                    <div class="mb-4 flex-fill">
                                        <label class="library-label inter text-uppercase form-label w-100"
                                               for="edit-firstName">First Name</label>
                                        <div class="input-icon-wrapper">
                                            <input id="edit-firstName" type="text"
                                                   class="library-input inter w-100"
                                                   placeholder="First name..." autocomplete="given-name">
                                            <i class="fa-regular fa-user"></i>
                                        </div>
                                        <p class="auth-error-msg d-none mt-1" id="edit-error-firstName"></p>
                                    </div>
                                    <div class="mb-4 flex-fill">
                                        <label class="library-label inter text-uppercase form-label w-100"
                                               for="edit-lastName">Last Name</label>
                                        <div class="input-icon-wrapper">
                                            <input id="edit-lastName" type="text"
                                                   class="library-input inter w-100"
                                                   placeholder="Last name..." autocomplete="family-name">
                                        </div>
                                        <p class="auth-error-msg d-none mt-1" id="edit-error-lastName"></p>
                                    </div>
                                </div>

                                <!-- Change Password section (collapsed by default) -->
                                <div class="mb-2">
                                    <button type="button" class="btn btn-link p-0 inter text-decoration-none"
                                            id="toggle-password-section"
                                            style="font-size: 0.82rem; color: var(--secondary);">
                                        <i class="fa-solid fa-lock me-1"></i> Change Password
                                        <i class="fa-solid fa-chevron-down ms-1" id="toggle-chevron"></i>
                                    </button>
                                </div>

                                <div id="password-change-section" class="d-none d-flex flex-column gap-3">
                                    <div class="mb-4">
                                        <label class="library-label inter text-uppercase form-label w-100"
                                               for="edit-currentPassword">Current Password</label>
                                        <div class="input-icon-wrapper">
                                            <input id="edit-currentPassword" type="password"
                                                   class="library-input inter w-100"
                                                   placeholder="••••••••" autocomplete="current-password">
                                            <i class="fa-regular fa-lock"></i>
                                        </div>
                                        <p class="auth-error-msg d-none mt-1" id="edit-error-currentPassword"></p>
                                    </div>
                                    <div class="mb-4">
                                        <label class="library-label inter text-uppercase form-label w-100"
                                               for="edit-newPassword">New Password</label>
                                        <div class="input-icon-wrapper">
                                            <input id="edit-newPassword" type="password"
                                                   class="library-input inter w-100"
                                                   placeholder="Min. 8 characters" autocomplete="new-password">
                                            <i class="fa-regular fa-lock"></i>
                                        </div>
                                        <p class="auth-error-msg d-none mt-1" id="edit-error-newPassword"></p>
                                    </div>
                                </div>

                            </div>

                            <p class="auth-error-msg auth-general-error d-none text-center mb-2"
                               id="edit-error-general"></p>

                            <div class="mt-3">
                                <button id="edit-profile-submit" type="submit"
                                        class="btn main-btn d-inline-flex align-items-center gap-2 w-100">
                                    Save Changes
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    `;
}
