import './profile-subnav.css';

/**
 *
 * @param {Object} params
 * @param {string} params.profileBaseUrl
 * @param {string} params.listsBaseUrl
 * @param {string} params.favListUrl
 * @param {string} params.watchlistUrl
 * @param {number} params.favCount
 * @param {number} params.readListCount
 * @returns {string} HTML string
 */
export function renderProfileSubnav({ profileBaseUrl, listsBaseUrl, favListUrl, watchlistUrl, favCount, readListCount }) {
    return `
        <div class="profile-subnav mb-5 shadow-sm">
            <div class="container">
                <ul class="nav profile-nav-tabs flex-nowrap overflow-x-auto">
                    <li class="nav-item">
                        <a class="nav-link inter" data-tab="profile" href="${profileBaseUrl}">Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link inter text-nowrap" data-tab="favourites" href="${favListUrl}">
                            Favourites (<span id="tab-fav-count">${favCount}</span>)
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link inter text-nowrap" data-tab="watchlist" href="${watchlistUrl}">
                            Watchlist (<span id="tab-watch-count">${readListCount}</span>)
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link inter text-nowrap" data-tab="lists" href="${listsBaseUrl}">Lists</a>
                    </li>
                </ul>
            </div>
        </div>
    `;
}
