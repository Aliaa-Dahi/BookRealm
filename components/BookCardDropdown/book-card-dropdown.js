import "./book-card-dropdown.css";
import { getLists, isBookInList, toggleBookInList, LIST_KEYS } from "../../services/list.service.js";
import { requireAuth } from "../../services/auth.service.js";

/**
 * Renders the custom user-created lists inside the sub-dropdown.
 * Explicitly filters out system default lists ("favourites" and "readList").
 */
function renderCustomLists(bookId) {
    const allLists = getLists();

    // Filter out system default lists: favourites & readList
    const customKeys = Object.keys(allLists).filter(
        key => key !== LIST_KEYS.FAVOURITES && key !== LIST_KEYS.READ_LIST
    );

    if (customKeys.length === 0) {
        return `
            <div class="empty-lists-msg text-center py-2 px-1">
                No custom lists created yet.
            </div>
        `;
    }

    return customKeys.map(key => {
        const list   = allLists[key];
        const inList = isBookInList(key, bookId);

        return `
            <button type="button"
                    class="card-dropdown-list-item bg-transparent d-flex align-items-center gap-2 w-100 border-0 px-2 py-1 rounded-1 text-start ${inList ? 'in-list' : ''}"
                    data-dropdown-list-key="${key}"
                    data-dropdown-book-id="${bookId}">
                <i class="fa-solid fa-bookmark card-dd-list-icon text-center"></i>
                <span class="flex-fill text-truncate">${list.name}</span>
                <i class="fa-solid fa-check check-icon"></i>
            </button>
        `;
    }).join('');
}

/**
 * Returns the HTML string for the BookCard Parchment Dropdown Menu (including the Add to List sub-dropdown).
 *
 * @param {string} bookId
 * @returns {string} HTML string
 */
export function renderBookCardDropdown(bookId) {
    const customListsHtml = renderCustomLists(bookId);

    return `
        <div class="card-dots-dropdown rounded-2" data-dropdown-for="${bookId}">
            <div class="card-dropdown-noise rounded-2 overflow-hidden position-absolute top-0 start-0 w-100 h-100"></div>

            <!-- Rate this book -->
            <div class="mb-1">
                <span class="card-dropdown-label d-block text-uppercase fw-bold mb-2">Rate this book</span>
                <div class="card-dropdown-stars d-flex gap-2" data-rating="0">
                    ${[1, 2, 3, 4, 5].map(n =>
                        `<i class="fa-regular fa-star card-dd-star" data-value="${n}"></i>`
                    ).join('')}
                </div>
            </div>

            <hr class="card-dropdown-divider my-2">

            <!-- Add to list (triggers sub-dropdown) -->
            <div class="position-relative add-to-list-wrapper">
                <button type="button"
                        class="card-dropdown-action-btn bg-transparent add-to-list-trigger d-flex align-items-center justify-content-between gap-2 w-100 border-0 px-2 py-1 rounded-1 text-start"
                        data-dropdown-book-id="${bookId}">
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-plus card-dd-list-icon text-center"></i>
                        <span>Add to list</span>
                    </div>
                    <i class="fa-solid fa-chevron-right card-dd-chevron"></i>
                </button>

                <!-- Sub-dropdown for user-created custom lists -->
                <div class="card-sub-dropdown rounded-2" data-sub-for="${bookId}">
                    <div class="card-dropdown-noise rounded-2 overflow-hidden position-absolute top-0 start-0 w-100 h-100"></div>
                    <span class="card-dropdown-label d-block text-uppercase fw-bold mb-2">My Lists</span>
                    <div class="d-flex flex-column gap-1">
                        ${customListsHtml}
                    </div>
                </div>
            </div>

            <hr class="card-dropdown-divider my-2">

            
        </div>
    `;
}

// ── Event Listener Bindings for BookCardDropdown ─────────────────────────────
if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {

        // ── Dots button — toggle main dropdown ──
        const dotsBtn = e.target.closest('.dots-btn');
        if (dotsBtn) {
            e.preventDefault();
            e.stopPropagation();

            // Guard: require login before opening the dropdown
            if (!requireAuth()) return;

            const bookId  = dotsBtn.getAttribute('data-book-id');
            // Works for both book-card and book-details contexts
            const card    = dotsBtn.closest('.book-card') || dotsBtn.closest('.book-details-page');
            const wrapper = dotsBtn.closest('.dots-btn-wrapper');
            if (!card || !wrapper || !bookId) return;

            // Close any other open dropdowns across all cards
            document.querySelectorAll('.card-dots-dropdown.open').forEach(d => {
                if (d.getAttribute('data-dropdown-for') !== bookId) {
                    d.classList.remove('open');
                    const sub = d.querySelector('.card-sub-dropdown');
                    if (sub) sub.classList.remove('open');
                    const otherCard = d.closest('.book-card');
                    if (otherCard) otherCard.classList.remove('dropdown-active');
                }
            });

            let dropdown = wrapper.querySelector('.card-dots-dropdown');
            if (!dropdown) {
                wrapper.insertAdjacentHTML('beforeend', renderBookCardDropdown(bookId));
                dropdown = wrapper.querySelector('.card-dots-dropdown');
            }

            const isOpen = dropdown.classList.toggle('open');
            if (!isOpen) {
                const sub = dropdown.querySelector('.card-sub-dropdown');
                if (sub) sub.classList.remove('open');
            } else {
                const dropdownRect = dropdown.getBoundingClientRect();
                const spaceRight = window.innerWidth - dropdownRect.right;
                dropdown.classList.toggle('sub-flipped', spaceRight < 216);
            }
            // Only toggle dropdown-active on book-card, not book-details
            if (card.classList.contains('book-card')) {
                card.classList.toggle('dropdown-active', isOpen);
            }
            return;
        }

        // ── "Add to list" trigger — toggle sub-dropdown ──
        const listTrigger = e.target.closest('.add-to-list-trigger');
        if (listTrigger) {
            e.preventDefault();
            e.stopPropagation();
            const parentDropdown = listTrigger.closest('.card-dots-dropdown');
            if (!parentDropdown) return;

            const subDropdown = parentDropdown.querySelector('.card-sub-dropdown');
            if (subDropdown) {
                const isSubOpen = subDropdown.classList.toggle('open');
                listTrigger.classList.toggle('active-sub', isSubOpen);
            }
            return;
        }

        // ── Custom list item toggle ──
        const listItem = e.target.closest('.card-dropdown-list-item');
        if (listItem) {
            e.preventDefault();
            e.stopPropagation();
            if (!requireAuth()) return;
            const bookId  = listItem.getAttribute('data-dropdown-book-id');
            const listKey = listItem.getAttribute('data-dropdown-list-key');
            if (bookId && listKey) {
                const res = toggleBookInList(listKey, bookId);
                listItem.classList.toggle('in-list', res.inList);
            }
            return;
        }

        // ── Dropdown star rating selection ──
        const ddStar = e.target.closest('.card-dd-star');
        if (ddStar) {
            e.preventDefault();
            e.stopPropagation();
            if (!requireAuth()) return;
            const starsRow = ddStar.closest('.card-dropdown-stars');
            const val      = parseInt(ddStar.getAttribute('data-value'), 10);
            starsRow.setAttribute('data-rating', val);
            starsRow.querySelectorAll('.card-dd-star').forEach(s => {
                const n = parseInt(s.getAttribute('data-value'), 10);
                s.className = n <= val ? 'fa-solid fa-star card-dd-star active' : 'fa-regular fa-star card-dd-star';
            });
            return;
        }

        // ── Click outside — close all open dropdowns ──
        if (!e.target.closest('.card-dots-dropdown')) {
            document.querySelectorAll('.card-dots-dropdown.open').forEach(d => {
                d.classList.remove('open');
                const sub = d.querySelector('.card-sub-dropdown');
                if (sub) sub.classList.remove('open');
                const c = d.closest('.book-card');
                if (c) c.classList.remove('dropdown-active');
            });
        }
    });

    let closeTimer = null;

    // ── Auto-close on mouse leave (non-hover) ──
    document.addEventListener('mouseout', (e) => {
        const openDropdown = document.querySelector('.card-dots-dropdown.open');
        if (!openDropdown) return;

        // Works for both book-card and book-details contexts
        const activeCard = openDropdown.closest('.book-card') || openDropdown.closest('.book-details-page');
        const related = e.relatedTarget;

        // Don't close if the cursor is still inside the card/page or the dropdown itself
        if (related) {
            if (activeCard && activeCard.contains(related)) return;
            if (openDropdown.contains(related)) return;
            // Also keep open when moving into the sub-dropdown
            const openSub = openDropdown.querySelector('.card-sub-dropdown.open');
            if (openSub && openSub.contains(related)) return;
        }

        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            // Double-check the cursor isn't back inside before closing
            if (openDropdown && !openDropdown.matches(':hover')) {
                openDropdown.classList.remove('open');
                const sub = openDropdown.querySelector('.card-sub-dropdown');
                if (sub) sub.classList.remove('open');
            }
            if (activeCard && activeCard.classList.contains('book-card')) {
                activeCard.classList.remove('dropdown-active');
            }
        }, 300);

        // Restore star hover state
        const ddStar = e.target.closest('.card-dd-star');
        if (ddStar) {
            const starsRow = ddStar.closest('.card-dropdown-stars');
            const saved = parseInt(starsRow.getAttribute('data-rating') || '0', 10);
            starsRow.querySelectorAll('.card-dd-star').forEach(s => {
                s.classList.remove('hover');
                const n = parseInt(s.getAttribute('data-value'), 10);
                s.className = n <= saved ? 'fa-solid fa-star card-dd-star active' : 'fa-regular fa-star card-dd-star';
            });
        }
    });

    document.addEventListener('mouseover', (e) => {
        const openDropdown = document.querySelector('.card-dots-dropdown.open');
        if (!openDropdown) return;

        const activeCard = openDropdown.closest('.book-card') || openDropdown.closest('.book-details-page');
        const openSub = openDropdown.querySelector('.card-sub-dropdown.open');

        // Cancel close timer if cursor re-enters any relevant area
        if (
            (activeCard && activeCard.contains(e.target)) ||
            openDropdown.contains(e.target) ||
            (openSub && openSub.contains(e.target))
        ) {
            clearTimeout(closeTimer);
        }

        // Fill stars on hover
        const ddStar = e.target.closest('.card-dd-star');
        if (ddStar) {
            const starsRow = ddStar.closest('.card-dropdown-stars');
            const hoverVal = parseInt(ddStar.getAttribute('data-value'), 10);
            starsRow.querySelectorAll('.card-dd-star').forEach(s => {
                const n = parseInt(s.getAttribute('data-value'), 10);
                s.classList.toggle('hover', n <= hoverVal);
            });
        }
    });
}
