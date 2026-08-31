import './profile-header.css';
import { SubBtn } from "../Button/button.js";

/**
 * Renders the profile header banner.
 *
 * @param {Object} params
 * @param {string} params.initials
 * @param {string} params.displayName
 * @param {string} params.username
 * @param {string} params.joinDateFormatted
 * @param {number} params.totalBooksCount
 * @param {number} params.totalListsCount
 * @param {number} params.followingCount
 * @returns {string} HTML string
 */
export function renderProfileHeader({ initials, displayName, username, joinDateFormatted, totalBooksCount, totalListsCount, followingCount }) {
    return `
        <div class="profile-header-banner pt-5 pb-4 shadow-sm">
            <div class="container pt-4">
                <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">

                    <!-- User info -->
                    <div class="d-flex align-items-center gap-3">
                        <div class="profile-avatar-large rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow"><span>${initials}</span></div>
                        <div>
                            <h2 class="profile-username playfair playfair-900 mb-0 fs-2">${displayName}</h2>
                            <p class="mb-1 mt-1 small">
                                <span class="profile-display-name">@${username}</span>
                                <span class="profile-join-date ms-2">• Joined ${joinDateFormatted}</span>
                            </p>
                            <div class="mt-2">
                                ${SubBtn("Edit Profile", "fa-regular fa-pen-to-square", "btn-sm")}
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="d-flex align-items-center gap-4">
                        <div class="text-center">
                            <div class="profile-stat-number" id="stat-total-books">${totalBooksCount}</div>
                            <div class="profile-stat-label">Books</div>
                        </div>
                        <div class="text-center">
                            <div class="profile-stat-number" id="stat-total-lists">${totalListsCount}</div>
                            <div class="profile-stat-label">Lists</div>
                        </div>
                        <div class="text-center">
                            <div class="profile-stat-number">${followingCount}</div>
                            <div class="profile-stat-label">Following</div>
                        </div>
                        <div class="text-center">
                            <div class="profile-stat-number">3</div>
                            <div class="profile-stat-label">Followers</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}
