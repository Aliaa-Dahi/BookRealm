import './profile-lists-tab.css';
import { getLists } from "../../services/list.service.js";
import { MainBtn } from "../Button/button.js";

const LIST_META = {
    favourites: { icon: 'fa-solid fa-heart text-danger',       label: 'Favourites'       },
    readList:   { icon: 'fa-solid fa-eye',                      label: 'Watchlist'        },
};

function defaultMeta(key) {
    return { icon: 'fa-solid fa-bookmark', label: key };
}

/**
 * Renders a single list summary card.
 */
function renderListCard(key, listObj, listUrl) {
    const meta  = LIST_META[key] || defaultMeta(key);
    const count = (listObj.books || []).length;
    const desc  = listObj.description || 'No description yet.';

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <a href="${listUrl}" class="text-decoration-none list-summary-card h-100"
               data-list-key="${key}">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <span class="list-card-icon">
                        <i class="${meta.icon}"></i>
                    </span>
                    <span class="list-card-badge">
                        ${count} ${count === 1 ? 'book' : 'books'}
                    </span>
                </div>
                <h6 class="playfair playfair-700 list-card-title mb-1">
                    ${listObj.name}
                </h6>
                <p class="inter list-card-desc mb-0">
                    ${desc}
                </p>
            </a>
        </div>
    `;
}

/**
 * Renders the full "Lists" tab content:
 * - Create List button header
 * - Summary cards for all user lists (Favourites, Watchlist, custom lists)
 *
 * @param {string} username
 * @returns {string} HTML string
 */
export function renderListsTab(username) {
    const listsMap = getLists();

    const listOrder = [
        'favourites',
        'readList',
        ...Object.keys(listsMap).filter(k => k !== 'favourites' && k !== 'readList')
    ];

    const cardsHtml = listOrder.map(key => {
        const listObj = listsMap[key];
        if (!listObj) return '';
        const listUrl = `/users/${username}/lists/${key}`;
        return renderListCard(key, listObj, listUrl);
    }).join('');

    return `
        <section id="section-lists" class="profile-tab-section">
            <div class="d-flex align-items-center justify-content-between mb-4">
                <h5 class="playfair playfair-700 lists-tab-title mb-0">My Lists</h5>
                ${MainBtn("Create List", "fa-solid fa-plus", "btn-sm btn-create-list-trigger")}
            </div>
            <div class="row g-4">
                ${cardsHtml}
            </div>
        </section>
    `;
}
