import './profile-lists-tab.css';
import './profile-lists.css';
import { getLists, LIST_KEYS } from "../../services/list.service.js";
import { MainBtn } from "../Button/button.js";
import ProfileSectionHeader from "../ProfileSectionHeader/profile-section-header.js";

const LIST_META = {
    [LIST_KEYS.FAVOURITES]: { icon: 'fa-solid fa-heart', label: 'Favourites' },
    [LIST_KEYS.READ_LIST]:  { icon: 'fa-solid fa-eye',   label: 'Read List'  },
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
    const isSystemList = (key === LIST_KEYS.FAVOURITES || key === LIST_KEYS.READ_LIST);

    const actionsHtml = !isSystemList ? `
        <div class="d-flex align-items-center gap-1 ms-2">
            <button type="button" class="btn btn-sm btn-link p-1 border-0 text-decoration-none btn-edit-list"
                    data-list-key="${key}"
                    data-list-name="${listObj.name.replace(/"/g, '&quot;')}"
                    data-list-desc="${(listObj.description || '').replace(/"/g, '&quot;')}"
                    title="Edit List"
                    style="color: var(--secondary); opacity: 0.85; transition: var(--general-transition);">
                <i class="fa-solid fa-pen-to-square fs-6"></i>
            </button>
            <button type="button" class="btn btn-sm btn-link p-1 border-0 text-decoration-none btn-delete-list"
                    data-list-key="${key}"
                    data-list-name="${listObj.name.replace(/"/g, '&quot;')}"
                    title="Delete List"
                    style="color: var(--color-error); opacity: 0.85; transition: var(--general-transition);">
                <i class="fa-solid fa-trash-can fs-6"></i>
            </button>
        </div>
    ` : '';

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <a href="${listUrl}" class="text-decoration-none d-block list-summary-card p-4 h-100 position-relative"
               data-list-key="${key}">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <span class="list-card-icon">
                        <i class="${meta.icon}"></i>
                    </span>
                    <div class="d-flex align-items-center">
                        <span class="list-card-badge rounded-pill fw-semibold">
                            ${count} ${count === 1 ? 'book' : 'books'}
                        </span>
                        ${actionsHtml}
                    </div>
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

    // Only show custom lists — favourites and readList have their own dedicated tabs
    const customKeys = Object.keys(listsMap).filter(
        k => k !== LIST_KEYS.FAVOURITES && k !== LIST_KEYS.READ_LIST
    );

    const cardsHtml = customKeys.map(key => {
        const listObj = listsMap[key];
        if (!listObj) return '';
        const listUrl = `/users/${username}/lists/${key}`;
        return renderListCard(key, listObj, listUrl);
    }).join('');

    return `
        <section id="section-lists" class="profile-tab-section">
            ${ProfileSectionHeader(
                'fa-solid fa-layer-group',
                'My Lists',
                MainBtn("Create List", "fa-solid fa-plus", "btn-sm btn-create-list-trigger")
            )}
            <div class="row g-4">
                ${cardsHtml || `
                    <div class="col-12">
                        <div class="empty-list-state text-center py-5 px-3 my-3">
                            <i class="fa-regular fa-rectangle-list fs-1 d-block empty-list-state-icon"></i>
                            <h5 class="playfair playfair-700 fs-5 mb-2 empty-list-state-title">No Lists Yet</h5>
                            <p class="inter empty-list-state-desc mx-auto mb-3">You haven't created any custom lists. Create one to start organising your books.</p>
                        </div>
                    </div>
                `}
            </div>
        </section>
    `;
}
