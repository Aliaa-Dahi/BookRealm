import {
  mapSearchDoc,
  mapAuthorEntry,
  mapBookDetailDoc,
  mapSubjectWork,
} from './book-data-mapper.js';

const API_BASE = 'https://openlibrary.org';

/**
 * Strategy Pattern for fetching books from Open Library.
 * All response normalization is delegated to book-data-mapper.js.
 */
export const fetchStrategies = {
  // Fetch by Subject/Genre
  genre: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(
      `${API_BASE}/search.json?subject=${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`
    );
    const data = await response.json();
    return {
      works:      (data.docs || []).map(mapSearchDoc),
      work_count: data.numFound || 0,
    };
  },

  // Fetch by Search Query (Keyword/Title/Author search)
  search: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(
      `${API_BASE}/search.json?q=${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`
    );
    const data = await response.json();
    return {
      works:      (data.docs || []).map(mapSearchDoc),
      work_count: data.numFound || 0,
    };
  },

  // Fetch by Author ID
  author: async (param, limit, offset) => {
    const response = await fetch(
      `${API_BASE}/authors/${param}/works.json?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    return {
      works:      (data.entries || []).map(mapAuthorEntry),
      work_count: data.size || 0,
    };
  },

  // Fetch by Language
  language: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(
      `${API_BASE}/search.json?q=language:${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`
    );
    const data = await response.json();
    return {
      works:      (data.docs || []).map(mapSearchDoc),
      work_count: data.numFound || 0,
    };
  },

  // Fetch details for a single book by title
  bookDetails: async (param) => {
    const fields =
      'key,title,author_name,cover_i,first_publish_year,edition_count,ratings_average,ratings_count,subject,publisher,language,number_of_pages_median';
    const response = await fetch(
      `${API_BASE}/search.json?title=${encodeURIComponent(param)}&limit=1&fields=${fields}`
    );
    const data = await response.json();
    return {
      works:      (data.docs || []).map(mapBookDetailDoc),
      work_count: data.numFound || 0,
    };
  },
};

/**
 * Fetches the top-rated / featured books for the home page.
 * Tries the search endpoint first; falls back to the subjects endpoint.
 *
 * @returns {Promise<Object[]>} Array of normalized book objects
 */
export async function fetchTopRated() {
  try {
    const response = await fetch(
      `${API_BASE}/search.json?q=dragon&sort=rating&limit=8`
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return (data.docs || []).map(mapSearchDoc);
  } catch (err) {
    console.warn('Primary fetchTopRated failed, using subject fallback:', err);
    try {
      const fallback = await fetch(`${API_BASE}/subjects/fantasy.json?limit=8`);
      const data = await fallback.json();
      return (data.works || []).map(mapSubjectWork);
    } catch (fallbackErr) {
      console.error('Fallback fetchTopRated also failed:', fallbackErr);
      throw fallbackErr;
    }
  }
}

/**
 * Inspects the current URL path and query parameters to determine:
 * 1. Which fetch strategy to use.
 * 2. The parameter to pass to it.
 * 3. The user-friendly title to display.
 */
export function getFetchStrategy() {
  const pathParts   = location.pathname.split('/');
  const queryParams = new URLSearchParams(window.location.search);

  // 1. Search Strategy
  if (queryParams.has('q')) {
    const query = queryParams.get('q');
    return {
      strategy:    'search',
      param:       query,
      displayName: `Search results for "${query}"`,
    };
  }

  // 2. Author Strategy
  if (pathParts[2] === 'author' && pathParts[3]) {
    return {
      strategy:    'author',
      param:       pathParts[3],
      displayName: 'Author Works',
    };
  }

  // 3. Book Details / Language / Genre Strategy
  if (pathParts[2] && pathParts[2] !== 'author') {
    const slug        = pathParts[2];
    const isBookSlug  = slug.includes('-');

    if (isBookSlug) {
      const titleFromSlug = slug.replace(/-/g, ' ');
      return {
        strategy:    'bookDetails',
        param:       titleFromSlug,
        displayName: titleFromSlug.replace(/\b\w/g, c => c.toUpperCase()),
      };
    }

    if (slug.length === 3 && /^[a-z]{3}$/.test(slug)) {
      return {
        strategy:    'language',
        param:       slug,
        displayName: `${slug.toUpperCase()} Books`,
      };
    }

    const formattedGenre = slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      strategy:    'genre',
      param:       slug,
      displayName: `${formattedGenre} Collection`,
    };
  }

  // 4. Default Fallback
  return {
    strategy:    'genre',
    param:       'books',
    displayName: 'All Books Collection',
  };
}

/**
 * Fetches full book objects for an array of book IDs or existing book objects.
 */
export async function fetchBooksByIds(bookIds = []) {
  if (!Array.isArray(bookIds) || bookIds.length === 0) return [];

  const promises = bookIds.map(async (id) => {
    if (!id) return null;

    // If already a full book object, return directly
    if (typeof id === 'object' && (id.title || id.key)) return id;

    try {
      const idStr = String(id);
      let url;

      if (idStr.startsWith('/works/') || idStr.startsWith('OL')) {
        const workKey = idStr.startsWith('/works/') ? idStr : `/works/${idStr}`;
        url = `${API_BASE}/search.json?q=${encodeURIComponent(workKey)}&limit=1&fields=*,ratings_average`;
      } else {
        url = `${API_BASE}/search.json?title=${encodeURIComponent(idStr)}&limit=1&fields=*,ratings_average`;
      }

      const res  = await fetch(url);
      const data = await res.json();
      const doc  = data.docs && data.docs[0];

      if (doc) return mapSearchDoc(doc);

      // Fallback object if API record wasn't found
      return {
        key:               idStr,
        title:             idStr.replace(/^\/works\//, '').replace(/-/g, ' '),
        cover_id:          null,
        author_name:       'Unknown Author',
        first_publish_year: 'N/A',
        edition_count:     0,
        rating:            null,
      };
    } catch (e) {
      console.error(`Error fetching book for ID: ${id}`, e);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}
