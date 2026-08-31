/**
 * Book Data Mapper
 *
 * Pure normalization functions that convert raw Open Library API responses
 * into the consistent internal book object shape used throughout the app:
 * { key, title, cover_id, author_name, first_publish_year, edition_count, rating, ...extras }
 *
 * Each function corresponds to a specific API endpoint's response shape.
 * Keeping this separate means API field changes only need to be fixed here.
 */

/**
 * Maps a doc from /search.json (used by genre, search, language strategies).
 * @param {Object} doc - Raw doc from data.docs[]
 * @returns {Object} Normalized book object
 */
export function mapSearchDoc(doc) {
  return {
    key: doc.key,
    title: doc.title,
    cover_id: doc.cover_i || null,
    author_name: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
    first_publish_year: doc.first_publish_year || 'N/A',
    edition_count: doc.edition_count || 0,
    rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : null,
  };
}

/**
 * Maps an entry from /authors/:id/works.json (author strategy).
 * @param {Object} entry - Raw entry from data.entries[]
 * @returns {Object} Normalized book object
 */
export function mapAuthorEntry(entry) {
  return {
    key: entry.key,
    title: entry.title,
    cover_id: entry.covers ? entry.covers[0] : null,
    author_name: 'Author Works',
    first_publish_year:
      entry.first_publish_year ||
      (entry.created?.value ? new Date(entry.created.value).getFullYear() : 'N/A'),
    edition_count: entry.revision || 0,
    rating: null,
  };
}

/**
 * Maps a doc from /search.json for the bookDetails strategy.
 * Includes extra fields (subjects, publishers, languages, pages) that regular
 * list views don't need.
 * @param {Object} doc - Raw doc from data.docs[]
 * @returns {Object} Normalized book object with detail-specific extras
 */
export function mapBookDetailDoc(doc) {
  return {
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
    pages: doc.number_of_pages_median || null,
  };
}

/**
 * Maps a work from /subjects/:subject.json (legacy subject endpoint fallback).
 * Used by fetchTopRated's fallback in book.service.js.
 * @param {Object} work - Raw work from data.works[]
 * @returns {Object} Normalized book object
 */
export function mapSubjectWork(work) {
  return {
    key: work.key,
    title: work.title,
    cover_id: work.cover_id || null,
    author_name: work.authors ? work.authors.map(a => a.name).join(', ') : 'Unknown Author',
    first_publish_year: work.first_publish_year || 'N/A',
    edition_count: work.edition_count || 0,
    rating: null,
  };
}
