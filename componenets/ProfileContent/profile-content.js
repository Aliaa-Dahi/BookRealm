import './profile-content.css';
import ViewAll from "../ViewAll/view-all.js";


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

            <!-- DYNAMIC CUSTOM LIST SECTION -->
            <section id="section-custom-list" class="mb-5 profile-tab-section" style="display:none;">
                <div class="d-flex flex-column mb-4 profile-section-header pb-2">
                    <h5 class="playfair playfair-700 profile-section-title mb-1 d-flex align-items-center gap-2" id="custom-list-title">
                        <i class="fa-solid fa-bookmark"></i> List Title
                    </h5>
                    <p class="inter text-muted mb-0" id="custom-list-desc"></p>
                </div>
                <div id="profile-custom-list-container"></div>
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
