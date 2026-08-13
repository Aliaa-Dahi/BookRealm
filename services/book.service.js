/**
 * Strategy Pattern for fetching books from Open Library.
 * Handles data fetching and normalization for various endpoints.
 */

export const fetchStrategies = {
  // Fetch by Subject/Genre
  genre: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(`https://openlibrary.org/search.json?subject=${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`);
    const data = await response.json();
    
    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : null
    }));

    return {
      works: works,
      work_count: data.numFound || 0
    };
  },

  // Fetch by Search Query (Keyword/Title/Author search)
  search: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`);
    const data = await response.json();
    
    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : null
    }));

    return {
      works: works,
      work_count: data.numFound || 0
    };
  },

  // Fetch by Author ID
  author: async (param, limit, offset) => {
    const response = await fetch(`https://openlibrary.org/authors/${param}/works.json?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    const works = (data.entries || []).map(entry => ({
      key: entry.key,
      title: entry.title,
      cover_id: entry.covers ? entry.covers[0] : null,
      author_name: 'Author Works',
      first_publish_year: entry.first_publish_year || (entry.created?.value ? new Date(entry.created.value).getFullYear() : 'N/A'),
      edition_count: entry.revision || 0,
      rating: null
    }));

    return {
      works: works,
      work_count: data.size || 0
    };
  },

  // Fetch by Language
  language: async (param, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const response = await fetch(`https://openlibrary.org/search.json?q=language:${encodeURIComponent(param)}&limit=${limit}&page=${page}&fields=*,ratings_average`);
    const data = await response.json();
    
    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : null
    }));

    return {
      works: works,
      work_count: data.numFound || 0
    };
  },

  // Fetch details for a single book by title
  bookDetails: async (param) => {
    const fields = 'key,title,author_name,cover_i,first_publish_year,edition_count,ratings_average,ratings_count,subject,publisher,language,number_of_pages_median';
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(param)}&limit=1&fields=${fields}`);
    const data = await response.json();

    const works = (data.docs || []).map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_id: doc.cover_i || null,
      author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      first_publish_year: doc.first_publish_year || 'N/A',
      edition_count: doc.edition_count || 0,
      rating: doc.ratings_average ? parseFloat(doc.ratings_average.toFixed(1)) : null,
      ratings_count: doc.ratings_count || 0,
      subjects: doc.subject ? doc.subject.slice(0, 3) : [],
      publishers: doc.publisher ? doc.publisher.slice(0, 2) : [],
      languages: doc.language || [],
      pages: doc.number_of_pages_median || null
    }));

    return {
      works: works,
      work_count: data.numFound || 0
    };
  }
};

/**
 * Inspects the current URL path and query parameters to determine:
 * 1. Which fetch strategy to use.
 * 2. The parameter to pass to it.
 * 3. The user-friendly title to display.
 */
export function getFetchStrategy() {
  const pathParts = location.pathname.split('/');
  const queryParams = new URLSearchParams(window.location.search);

  // 1. Search Strategy
  if (queryParams.has('q')) {
    const query = queryParams.get('q');
    return {
      strategy: 'search',
      param: query,
      displayName: `Search results for "${query}"`
    };
  }

  // 2. Author Strategy
  if (pathParts[2] === 'author' && pathParts[3]) {
    return {
      strategy: 'author',
      param: pathParts[3],
      displayName: 'Author Works'
    };
  }

  // 3. Book Details / Language / Genre Strategy
  if (pathParts[2] && pathParts[2] !== 'author') {
    const slug = pathParts[2];
    const isBookSlug = slug.includes('-');
    if (isBookSlug) {
      const titleFromSlug = slug.replace(/-/g, ' ');
      return {
        strategy: 'bookDetails',
        param: titleFromSlug,
        displayName: titleFromSlug.replace(/\b\w/g, c => c.toUpperCase())
      };
    }

    if (slug.length === 3 && /^[a-z]{3}$/.test(slug)) {
      return {
        strategy: 'language',
        param: slug,
        displayName: `${slug.toUpperCase()} Books`
      };
    }

    const genre = slug;
    const formattedGenre = genre.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      strategy: 'genre',
      param: genre,
      displayName: `${formattedGenre} Collection`
    };
  }

  // 4. Default Fallback
  return {
    strategy: 'genre',
    param: 'books',
    displayName: 'All Books Collection'
  };
}
