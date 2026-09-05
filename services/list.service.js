const LISTS_KEY = "lists";

/**
 * Keys for the two system-managed default lists.
 * Import these wherever 'favourites' or 'readList' are referenced
 * to avoid magic strings scattered across the codebase.
 */
export const LIST_KEYS = {
    FAVOURITES: 'favourites',
    READ_LIST:  'readList',
};

const DEFAULT_LISTS = {
    [LIST_KEYS.FAVOURITES]: {
        name: "Favorites",
        description: "Your favorite books collection",
        create_date: new Date().toISOString(),
        books: []
    },
    [LIST_KEYS.READ_LIST]: {
        name: "Want to Read",
        description: "Books you plan to read in the future",
        create_date: new Date().toISOString(),
        books: []
    }
};

export function getLists() {
    try {
        const stored = localStorage.getItem(LISTS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') {
                let updated = false;

                // Ensure default lists exist and have descriptions
                for (const [key, defaultVal] of Object.entries(DEFAULT_LISTS)) {
                    if (!parsed[key]) {
                        parsed[key] = { ...defaultVal };
                        updated = true;
                    } else {
                        if (!parsed[key].description) {
                            parsed[key].description = defaultVal.description;
                            updated = true;
                        }
                        if (!parsed[key].name) {
                            parsed[key].name = defaultVal.name;
                            updated = true;
                        }
                        if (!parsed[key].create_date) {
                            parsed[key].create_date = defaultVal.create_date;
                            updated = true;
                        }
                        if (!Array.isArray(parsed[key].books)) {
                            parsed[key].books = [];
                            updated = true;
                        }
                    }
                }

                if (updated) saveLists(parsed);
                return parsed;
            }
        }
    } catch (e) {
        console.error("Error reading lists from localStorage", e);
    }

    // Fallback: Clone default structure
    const initialLists = structuredClone(DEFAULT_LISTS);
    saveLists(initialLists);
    return initialLists;
}

export function saveLists(lists) {
    try {
        localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    } catch (e) {
        console.error("Error saving lists to localStorage", e);
    }
}


function extractBookId(book) {
    if (!book) return null;
    return typeof book === 'string' ? book : (book.key || book.id || book.title || null);
}


export function getList(listKey) {
    const lists = getLists();
    return lists[listKey] || null;
}

export function isBookInList(listKey, book) {
    const bookId = extractBookId(book);
    if (!bookId) return false;

    const listObj = getList(listKey);
    if (!listObj || !Array.isArray(listObj.books)) return false;

    return listObj.books.some(item => {
        if (typeof item === 'string') return item === bookId;
        return extractBookId(item) === bookId;
    });
}

export function toggleBookInList(listKey, book) {
    const bookId = extractBookId(book);
    if (!bookId || !listKey) return { inList: false, bookId: null, count: 0, listKey };

    const lists = getLists();

    // Create list if missing
    if (!lists[listKey]) {
        lists[listKey] = {
            name: listKey,
            description: "",
            create_date: new Date().toISOString(),
            books: []
        };
    }

    const booksArr = lists[listKey].books;
    const existingIndex = booksArr.findIndex(item => {
        if (typeof item === 'string') return item === bookId;
        return extractBookId(item) === bookId;
    });

    let inList = false;
    if (existingIndex > -1) {
        booksArr.splice(existingIndex, 1);
        inList = false;
    } else {
        booksArr.push(bookId);
        inList = true;
    }

    saveLists(lists);

    const eventData = {
        inList,
        bookId,
        count: booksArr.length,
        listKey
    };

    // Dispatch global custom event for real-time UI updates across components
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookListUpdated', { detail: eventData }));
    }

    return eventData;
}


export function createList(name, description = "") {
    if (!name || !name.trim()) return null;
    
    const key = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
    const lists = getLists();
    
    lists[key] = {
        name: name.trim(),
        description: description.trim() || "",
        create_date: new Date().toISOString(),
        books: []
    };
    
    saveLists(lists);

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookListUpdated', { 
            detail: { listKey: key, name: name.trim(), action: 'create', count: 0 } 
        }));
    }

    return { key, ...lists[key] };
}

// ── Specific Shortcut Functions ──

export function getFavorites() {
    return getList(LIST_KEYS.FAVOURITES);
}

export function isBookFavorite(book) {
    return isBookInList(LIST_KEYS.FAVOURITES, book);
}

export function toggleFavoriteBook(book) {
    const res = toggleBookInList(LIST_KEYS.FAVOURITES, book);
    return {
        isFavorite: res.inList,
        bookId: res.bookId,
        count: res.count
    };
}

export function getReadList() {
    return getList(LIST_KEYS.READ_LIST);
}

export function isBookInReadList(book) {
    return isBookInList(LIST_KEYS.READ_LIST, book);
}

export function toggleReadListBook(book) {
    const res = toggleBookInList(LIST_KEYS.READ_LIST, book);
    return {
        inReadList: res.inList,
        bookId: res.bookId,
        count: res.count
    };
}

export function deleteList(key) {
    if (!key || key === LIST_KEYS.FAVOURITES || key === LIST_KEYS.READ_LIST) return false;
    const lists = getLists();
    if (!lists[key]) return false;
    delete lists[key];
    saveLists(lists);
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookListUpdated', {
            detail: { listKey: key, action: 'delete' }
        }));
    }
    return true;
}

export function updateList(key, nameOrObj, description = "") {
    if (!key) return null;
    const lists = getLists();
    if (!lists[key]) return null;

    let newName, newDesc;
    if (typeof nameOrObj === 'object' && nameOrObj !== null) {
        newName = nameOrObj.name;
        newDesc = nameOrObj.description;
    } else {
        newName = nameOrObj;
        newDesc = description;
    }

    if (newName !== undefined && newName.trim()) lists[key].name = newName.trim();
    if (newDesc !== undefined) lists[key].description = newDesc.trim();

    saveLists(lists);
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bookListUpdated', {
            detail: { listKey: key, action: 'update' }
        }));
    }
    return lists[key];
}
