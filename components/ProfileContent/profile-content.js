import './profile-content.css';
import ViewAll from "../ViewAll/view-all.js";
import ProfileSectionHeader from "../ProfileSectionHeader/profile-section-header.js";


export function renderProfileContent({ favCount, readListCount, favListUrl, watchlistUrl }) {
    return `
        <div class="container">

            <!-- FAVOURITE BOOKS SECTION -->
            <section id="section-favourites" class="mb-5 profile-tab-section">
                ${ProfileSectionHeader(
                    'fa-solid fa-heart',
                    'Favorite Books',
                    favCount > 4 ? `<div class="view-all-holder" id="holder-fav-view-all">${ViewAll(favListUrl, "View All")}</div>` : '<div class="view-all-holder" id="holder-fav-view-all"></div>'
                )}
                <div id="profile-favorites-container"></div>
            </section>

            <!-- READ LIST SECTION -->
            <section id="section-watchlist" class="mb-5 profile-tab-section">
                ${ProfileSectionHeader(
                    'fa-solid fa-eye',
                    'Read List',
                    readListCount > 4 ? `<div class="view-all-holder" id="holder-watch-view-all">${ViewAll(watchlistUrl, "View All")}</div>` : '<div class="view-all-holder" id="holder-watch-view-all"></div>'
                )}
                <div id="profile-watchlist-container"></div>
            </section>

            <!-- LISTS TAB SECTION (populated dynamically when tab is active) -->
            <section id="section-lists" class="mb-5 profile-tab-section" style="display:none;">
                <div id="profile-lists-tab-container"></div>
            </section>

            <!-- DYNAMIC CUSTOM LIST SECTION -->
            <section id="section-custom-list" class="mb-5 profile-tab-section" style="display:none;">
                <div class="d-flex flex-column mb-4 profile-section-header pb-2">
                    <h6 class="profile-section-title mb-0 d-flex align-items-center gap-2" id="custom-list-title">
                        <i class="fa-solid fa-bookmark" style="color: var(--secondary);"></i> List Title
                    </h6>
                    <p class="inter text-muted mb-0 mt-1" id="custom-list-desc"></p>
                </div>
                <div id="profile-custom-list-container"></div>
            </section>

        </div>
    `;
}
