import './profile-content.css';
import ViewAll from "../ViewAll/view-all.js";

/**
 * Renders the main profile content sections:
 * Favourites preview, Watchlist preview, Lists tab slot, and Following.
 *
 * @param {Object} params
 * @param {number}   params.favCount
 * @param {number}   params.readListCount
 * @param {string}   params.favListUrl
 * @param {string}   params.watchlistUrl
 * @param {Array}    params.following  - Array of { initials, name }
 * @returns {string} HTML string
 */
export function renderProfileContent({ favCount, readListCount, favListUrl, watchlistUrl, following }) {
    return `
        <div class="container">

            <!-- FAVOURITE BOOKS SECTION -->
            <section id="section-favourites" class="mb-5 profile-tab-section">
                <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
                    <h6 class="profile-section-title mb-0 d-flex align-items-center gap-2">
                        <i class="fa-solid fa-heart"></i> Favorite Books
                    </h6>
                    <div class="view-all-holder" id="holder-fav-view-all">
                        ${favCount > 4 ? ViewAll(favListUrl, "View All") : ''}
                    </div>
                </div>
                <div id="profile-favorites-container"></div>
            </section>

            <!-- WATCHLIST SECTION -->
            <section id="section-watchlist" class="mb-5 profile-tab-section">
                <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
                    <h6 class="profile-section-title mb-0 d-flex align-items-center gap-2">
                        <i class="fa-solid fa-eye profile-section-icon-fav"></i> Watchlist
                    </h6>
                    <div class="view-all-holder" id="holder-watch-view-all">
                        ${readListCount > 4 ? ViewAll(watchlistUrl, "View All") : ''}
                    </div>
                </div>
                <div id="profile-watchlist-container"></div>
            </section>

            <!-- LISTS TAB SECTION (populated dynamically when tab is active) -->
            <section id="section-lists" class="mb-5 profile-tab-section" style="display:none;">
                <div id="profile-lists-tab-container"></div>
            </section>

            <!-- FOLLOWING SECTION -->
            <section id="section-following" class="mb-4 profile-tab-section">
                <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
                    <h6 class="profile-section-title mb-0">Following (${following.length})</h6>
                </div>
                <div class="d-flex align-items-center gap-3">
                    ${following.map(f => `
                        <div class="following-circle rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm" title="${f.name}">${f.initials}</div>
                    `).join('')}
                </div>
            </section>

        </div>
    `;
}
