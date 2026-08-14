import * as bootstrap from "bootstrap";
import { getCurrentUser, getUsers, getUserInitials } from "../services/auth.service.js";
import { renderProfileHeader }      from "../componenets/ProfileHeader/profile-header.js";
import { renderProfileSubnav }      from "../componenets/ProfileSubnav/profile-subnav.js";
import { renderProfileContent }     from "../componenets/ProfileContent/profile-content.js";
import { renderCreateListModal }    from "../componenets/CreateListModal/create-list-modal.js";
import { renderListsTab }           from "../componenets/ProfileLists/profile-lists-tab.js";
import { loadListSection, loadFavoritesSection, loadWatchlistSection } from "../componenets/ProfileLists/profile-lists.js";
import { getLists, createList }     from "../services/list.service.js";
import "../css/profile.css";

const STATIC_FOLLOWING = [
  { initials: "ES", name: "Emma Smith"    },
  { initials: "MR", name: "Michael Read"  },
  { initials: "AC", name: "Arthur Conan"  }
];

export function renderProfile(container) {
  if (!container) return;

  // ── Resolve user & URL ────────────────────────────────────────────────────────
  const pathParts   = window.location.pathname.split('/');
  const urlUsername = (pathParts[1] === 'users' && pathParts[2]) ? pathParts[2] : null;

  let initialTab = 'profile';
  if (pathParts[3] === 'lists') {
    initialTab = pathParts[4] ? pathParts[4].toLowerCase() : 'lists';
  }

  const currentUser = getCurrentUser();
  const allUsers    = getUsers();

  const user = allUsers.find(u => u.user_name === urlUsername) || currentUser || {
    firstName: "Aliaa",
    lastName:  "Mohamad",
    user_name: "aliaa_mohamad_1723589000000",
    join_date:  new Date().toISOString()
  };

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || 'Reader Profile';

  const username           = user.user_name || (user.firstName?.toLowerCase() ?? 'user');
  const initials           = getUserInitials(user) || 'A';
  const joinDateFormatted  = user.join_date
    ? new Date(user.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // ── URL constants ─────────────────────────────────────────────────────────────
  const profileBaseUrl = `/users/${username}`;
  const listsBaseUrl   = `/users/${username}/lists`;
  const favListUrl     = `/users/${username}/lists/favourites`;
  const watchlistUrl   = `/users/${username}/lists/watchlist`;

  // ── Live counts helper ────────────────────────────────────────────────────────
  const getCounts = () => {
    const all = getLists();
    let booksSum = 0;
    Object.values(all).forEach(l => { booksSum += (l.books || []).length; });
    return {
      favCount:        (all.favourites?.books || []).length,
      readListCount:   (all.readList?.books   || []).length,
      totalBooksCount: booksSum,
      totalListsCount: Object.keys(all).length
    };
  };

  const { favCount, readListCount, totalBooksCount, totalListsCount } = getCounts();
  let activeTabName = initialTab;

  // ── Assemble page from components ─────────────────────────────────────────────
  container.innerHTML = `
    <div class="profile-page pb-5">
      ${renderProfileHeader({ initials, displayName, username, joinDateFormatted, totalBooksCount, totalListsCount, followingCount: STATIC_FOLLOWING.length })}
      ${renderProfileSubnav({ profileBaseUrl, listsBaseUrl, favListUrl, watchlistUrl, favCount, readListCount })}
      ${renderProfileContent({ favCount, readListCount, favListUrl, watchlistUrl, following: STATIC_FOLLOWING })}
      ${renderCreateListModal()}
    </div>
  `;

  // ── DOM refs ──────────────────────────────────────────────────────────────────
  const favContainer      = document.getElementById('profile-favorites-container');
  const watchContainer    = document.getElementById('profile-watchlist-container');
  const listsTabContainer = document.getElementById('profile-lists-tab-container');

  // ── Counter sync ──────────────────────────────────────────────────────────────
  const syncCounters = () => {
    const c  = getCounts();
    const el = id => document.getElementById(id);
    if (el('stat-total-books'))  el('stat-total-books').textContent  = c.totalBooksCount;
    if (el('stat-total-lists'))  el('stat-total-lists').textContent  = c.totalListsCount;
    if (el('tab-fav-count'))     el('tab-fav-count').textContent     = c.favCount;
    if (el('tab-watch-count'))   el('tab-watch-count').textContent   = c.readListCount;
  };

  // ── Tab activation ────────────────────────────────────────────────────────────
  const activateTab = (tabName, updateUrl = false) => {
    activeTabName = tabName;

    container.querySelectorAll('.profile-nav-tabs .nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab') === tabName);
    });

    const sections       = container.querySelectorAll('.profile-tab-section');
    const viewAllHolders = container.querySelectorAll('.view-all-holder');

    if (tabName === 'profile') {
      sections.forEach(s => s.style.display = s.id === 'section-lists' ? 'none' : 'block');
      viewAllHolders.forEach(h => h.style.display = 'block');
      loadFavoritesSection(favContainer, 4);
      loadWatchlistSection(watchContainer, 4);
      if (updateUrl) history.pushState({}, '', profileBaseUrl);

    } else if (tabName === 'lists') {
      sections.forEach(s => s.style.display = s.id === 'section-lists' ? 'block' : 'none');
      listsTabContainer.innerHTML = renderListsTab(username);
      bindCreateListTriggers();
      bindListCardNavigation();
      if (updateUrl) history.pushState({}, '', listsBaseUrl);

    } else {
      sections.forEach(s => {
        s.style.display = (s.id === `section-${tabName}`) ? 'block' : 'none';
      });
      viewAllHolders.forEach(h => h.style.display = 'none');

      if (tabName === 'favourites') {
        loadListSection(favContainer,  'favourites', { limit: 1000, iconClass: 'fa-regular fa-heart' });
      } else if (tabName === 'watchlist') {
        loadListSection(watchContainer, 'readList',  { limit: 1000, iconClass: 'fa-regular fa-eye'   });
      }

      if (updateUrl) history.pushState({}, '', `/users/${username}/lists/${tabName}`);
    }
  };

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const openCreateModal = () =>
    bootstrap.Modal.getOrCreateInstance(document.getElementById('createListModal')).show();

  const bindCreateListTriggers = () => {
    container.querySelectorAll('.btn-create-list-trigger').forEach(btn => {
      btn.addEventListener('click', openCreateModal);
    });
  };

  const bindListCardNavigation = () => {
    container.querySelectorAll('.list-summary-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // prevent the global router from also pushing a history entry
        const key = card.getAttribute('data-list-key');
        if (key) activateTab(key, true);
      });
    });
  };

  // ── Form submit ───────────────────────────────────────────────────────────────
  container.querySelector('#create-list-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#list-name-input')?.value?.trim();
    const desc = container.querySelector('#list-desc-input')?.value?.trim();
    if (!name) return;

    createList(name, desc);
    bootstrap.Modal.getInstance(document.getElementById('createListModal'))?.hide();
    activateTab('lists', true);
  });

  // ── View All clicks ───────────────────────────────────────────────────────────
  container.querySelectorAll('.view-all-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href?.includes('/lists/')) activateTab(href.split('/lists/')[1], true);
    });
  });

  // ── Sub-nav clicks ────────────────────────────────────────────────────────────
  container.querySelectorAll('.profile-nav-tabs .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(link.getAttribute('data-tab'), true);
    });
  });

  // ── Boot ──────────────────────────────────────────────────────────────────────
  activateTab(initialTab, false);
  bindCreateListTriggers();

  // ── Real-time book list updates ───────────────────────────────────────────────
  window.addEventListener('bookListUpdated', (e) => {
    const { listKey, bookId, inList } = e.detail || {};
    syncCounters();

    if (!inList && bookId) {
      const containerId     = listKey === 'readList' ? 'profile-watchlist-container' : `profile-${listKey}-container`;
      const targetContainer = document.getElementById(containerId);
      if (!targetContainer) return;

      const cardCol = Array.from(targetContainer.querySelectorAll('.col-12'))
        .find(col => col.getAttribute('data-book-id') === bookId ||
                     col.querySelector('[data-book-id]')?.getAttribute('data-book-id') === bookId);

      if (cardCol) {
        Object.assign(cardCol.style, { transition: 'all 0.3s ease', opacity: '0', transform: 'scale(0.9)' });
        setTimeout(() => {
          cardCol.remove();
          if (targetContainer.querySelectorAll('.col-12').length === 0) {
            loadListSection(targetContainer, listKey, { limit: activeTabName === 'profile' ? 4 : 1000 });
          }
        }, 300);
      }
    }
  });
}