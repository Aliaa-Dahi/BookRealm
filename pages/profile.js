import * as bootstrap from "bootstrap";
import { getCurrentUser, getUsers, getUserInitials } from "../services/auth.service.js";
import { renderProfileHeader }      from "../componenets/ProfileHeader/profile-header.js";
import { renderProfileSubnav }      from "../componenets/ProfileSubnav/profile-subnav.js";
import { renderProfileContent }     from "../componenets/ProfileContent/profile-content.js";
import { renderCreateListModal, setupListModal } from "../componenets/CreateListModal/create-list-modal.js";
import { renderConfirmModal, showConfirm }   from "../componenets/Confirm/confirm.js";
import { renderListsTab }           from "../componenets/ProfileLists/profile-lists-tab.js";
import { loadListSection, loadFavoritesSection, loadWatchlistSection } from "../componenets/ProfileLists/profile-lists.js";
import { getLists, getList, createList, updateList, deleteList } from "../services/list.service.js";
import "../css/profile.css";

const STATIC_FOLLOWING = [
  { initials: "ES", name: "Emma Smith"    },
  { initials: "MR", name: "Michael Read"  },
  { initials: "AC", name: "Arthur Conan"  }
];

export function renderProfile(container) {
  if (!container) return;

  // ── Auth guard: profile requires login ────────────────────────────────────────
  const currentUser = getCurrentUser();
  if (!currentUser) {
    // Redirect to home and show the login modal
    window.dispatchEvent(new CustomEvent('requireLogin'));
    window.history.replaceState({}, '', '/');
    const { showContent } = window.__appCallbacks || {};
    if (typeof showContent === 'function') showContent();
    return;
  }

  // ── Resolve user & URL ────────────────────────────────────────────────────────
  const pathParts   = window.location.pathname.split('/');
  const urlUsername = (pathParts[1] === 'users' && pathParts[2]) ? pathParts[2] : null;

  let initialTab = 'profile';
  if (pathParts[3] === 'lists') {
    initialTab = pathParts[4] ? pathParts[4] : 'lists';
  }

  const allUsers = getUsers();
  const user = allUsers.find(u => u.user_name === urlUsername) || currentUser;

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
    const customListsCount = Object.keys(all).filter(k => k !== 'favourites' && k !== 'readList').length;
    return {
      favCount:         (all.favourites?.books || []).length,
      readListCount:    (all.readList?.books   || []).length,
      customListsCount,
      totalBooksCount:  booksSum,
      totalListsCount:  customListsCount
    };
  };

  const { favCount, readListCount, customListsCount, totalBooksCount, totalListsCount } = getCounts();
  let activeTabName = initialTab;

  // ── Assemble page from components ─────────────────────────────────────────────
  container.innerHTML = `
    <div class="profile-page pb-5">
      ${renderProfileHeader({ initials, displayName, username, joinDateFormatted, totalBooksCount, totalListsCount, followingCount: STATIC_FOLLOWING.length })}
      ${renderProfileSubnav({ profileBaseUrl, listsBaseUrl, favListUrl, watchlistUrl, favCount, readListCount, customListsCount })}
      ${renderProfileContent({ favCount, readListCount, favListUrl, watchlistUrl, following: STATIC_FOLLOWING })}
      ${renderCreateListModal()}
      ${renderConfirmModal()}
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
    if (el('stat-total-lists'))  el('stat-total-lists').textContent  = c.customListsCount;
    if (el('tab-fav-count'))     el('tab-fav-count').textContent     = c.favCount;
    if (el('tab-watch-count'))   el('tab-watch-count').textContent   = c.readListCount;
    if (el('tab-lists-count'))   el('tab-lists-count').textContent   = c.customListsCount;
  };

  // ── Tab activation ────────────────────────────────────────────────────────────
  const activateTab = (tabName, updateUrl = false) => {
    activeTabName = tabName;

    container.querySelectorAll('.profile-nav-tabs .nav-link').forEach(link => {
      const linkTab = link.getAttribute('data-tab');
      link.classList.toggle('active', linkTab === tabName);
    });

    const sections       = container.querySelectorAll('.profile-tab-section');
    const viewAllHolders = container.querySelectorAll('.view-all-holder');

    const customContainer = document.getElementById('profile-custom-list-container');
    const customTitle     = document.getElementById('custom-list-title');
    const customDesc      = document.getElementById('custom-list-desc');

    if (tabName === 'profile') {
      sections.forEach(s => {
        s.style.display = (s.id === 'section-favourites' || s.id === 'section-watchlist' || s.id === 'section-following') ? 'block' : 'none';
      });
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

    } else if (tabName === 'favourites' || tabName === 'favorites') {
      sections.forEach(s => s.style.display = s.id === 'section-favourites' ? 'block' : 'none');
      viewAllHolders.forEach(h => h.style.display = 'none');
      loadListSection(favContainer,  'favourites', { limit: 1000, iconClass: 'fa-solid fa-heart' });
      if (updateUrl) history.pushState({}, '', favListUrl);

    } else if (tabName === 'watchlist' || tabName === 'readlist' || tabName === 'readList') {
      sections.forEach(s => s.style.display = s.id === 'section-watchlist' ? 'block' : 'none');
      viewAllHolders.forEach(h => h.style.display = 'none');
      loadListSection(watchContainer, 'readList',  { limit: 1000, iconClass: 'fa-solid fa-eye'   });
      if (updateUrl) history.pushState({}, '', watchlistUrl);

    } else {
      // Custom user list!
      sections.forEach(s => s.style.display = s.id === 'section-custom-list' ? 'block' : 'none');
      viewAllHolders.forEach(h => h.style.display = 'none');

      const listObj = getList(tabName);
      if (listObj) {
        if (customTitle) customTitle.innerHTML = `<i class="fa-solid fa-bookmark"></i> ${listObj.name}`;
        if (customDesc)  customDesc.textContent = listObj.description || '';
        loadListSection(customContainer, tabName, { limit: 1000, iconClass: 'fa-solid fa-bookmark' });
      } else if (customContainer) {
        customContainer.innerHTML = `<div class="alert alert-warning">List not found.</div>`;
      }

      if (updateUrl) history.pushState({}, '', `/users/${username}/lists/${tabName}`);
    }
  };

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setupListModal('create');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('createListModal')).show();
  };

  const bindCreateListTriggers = () => {
    container.querySelectorAll('.btn-create-list-trigger').forEach(btn => {
      btn.addEventListener('click', openCreateModal);
    });
  };

  const bindListCardNavigation = () => {
    container.querySelectorAll('.list-summary-card').forEach(card => {
      // Edit button handler
      const editBtn = card.querySelector('.btn-edit-list');
      editBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key  = editBtn.getAttribute('data-list-key');
        const name = editBtn.getAttribute('data-list-name');
        const desc = editBtn.getAttribute('data-list-desc');
        setupListModal('edit', key, name, desc);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('createListModal')).show();
      });

      // Delete button handler
      const deleteBtn = card.querySelector('.btn-delete-list');
      deleteBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key  = deleteBtn.getAttribute('data-list-key');
        const name = deleteBtn.getAttribute('data-list-name');

        showConfirm({
          title: 'Delete List',
          message: `Are you sure you want to delete the list "${name}"? This action cannot be undone.`,
          confirmText: 'Delete',
          onConfirm: () => {
            deleteList(key);
            syncCounters();
            if (activeTabName === key) {
              activateTab('lists', true);
            } else {
              listsTabContainer.innerHTML = renderListsTab(username);
              bindCreateListTriggers();
              bindListCardNavigation();
            }
          }
        });
      });

      // Card click navigation handler
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-edit-list') || e.target.closest('.btn-delete-list')) return;
        e.preventDefault();
        e.stopPropagation();
        const key = card.getAttribute('data-list-key');
        if (key) activateTab(key, true);
      });
    });
  };

  // ── Form submit ───────────────────────────────────────────────────────────────
  container.querySelector('#create-list-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const mode = form.dataset.mode || 'create';
    const listKey = form.dataset.listKey || '';
    const nameInput = container.querySelector('#list-name-input');
    const descInput = container.querySelector('#list-desc-input');
    const name = nameInput?.value?.trim();
    const desc = descInput?.value?.trim();
    if (!name) return;

    let targetTabKey = 'lists';
    if (mode === 'edit' && listKey) {
      updateList(listKey, name, desc);
      targetTabKey = listKey;
    } else {
      const created = createList(name, desc);
      if (created && created.key) targetTabKey = created.key;
    }

    bootstrap.Modal.getInstance(document.getElementById('createListModal'))?.hide();

    if (activeTabName === 'lists') {
      listsTabContainer.innerHTML = renderListsTab(username);
      bindCreateListTriggers();
      bindListCardNavigation();
    } else if (activeTabName === targetTabKey) {
      activateTab(targetTabKey, false);
    } else {
      activateTab(targetTabKey, true);
    }
    syncCounters();
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
      let containerId;
      if (listKey === 'readList') containerId = 'profile-watchlist-container';
      else if (listKey === 'favourites') containerId = 'profile-favorites-container';
      else containerId = 'profile-custom-list-container';

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