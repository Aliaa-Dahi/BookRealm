const LISTS_KEY = "lists";

const DEFAULT_LISTS = {
    favourites: {
        name: "Favorites",
        description: "Your favorite books collection",
        create_date: new Date().toISOString(),
        books: []
    },
    readList: {
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

    return {
        inList,
        bookId,
        count: booksArr.length,
        listKey
    };
}


export function createList(listKey, name, description = "") {
    const lists = getLists();
    lists[listKey] = {
        name: name || listKey,
        description: description || "",
        create_date: new Date().toISOString(),
        books: []
    };
    saveLists(lists);
    return lists[listKey];
}

// ── Specific Shortcut Functions ──

export function getFavorites() {
    return getList("favourites");
}

export function isBookFavorite(book) {
    return isBookInList("favourites", book);
}

export function toggleFavoriteBook(book) {
    const res = toggleBookInList("favourites", book);
    return {
        isFavorite: res.inList,
        bookId: res.bookId,
        count: res.count
    };
}

export function getReadList() {
    return getList("readList");
}

export function isBookInReadList(book) {
    return isBookInList("readList", book);
}

export function toggleReadListBook(book) {
    const res = toggleBookInList("readList", book);
    return {
        inReadList: res.inList,
        bookId: res.bookId,
        count: res.count
    };
}
