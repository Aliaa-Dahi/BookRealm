# Requirements Document

## Introduction

The User Book Rating feature allows any visitor of BookRealm to assign a personal 1–5 star rating to any book. Ratings are stored entirely in the browser's `localStorage` and are completely independent of the book's existing API/display rating (the Open Library `ratings_average`). The interactive star widget is shared between two host surfaces — the **Book Card** footer and the **Book Details** page — and supports hover preview and toggle-off (clicking the active star clears the rating).

---

## Glossary

- **Rating_Service**: The new `rating.service.js` module responsible for reading and writing user ratings to `localStorage`.
- **Star_Widget**: The reusable interactive star-rating UI component (`star-rating-widget.js`) rendered in both the Book Card and Book Details contexts.
- **User_Rating**: A 1–5 integer value chosen by the visitor for a specific book, stored in `localStorage` and scoped by `bookId`.
- **Display_Rating**: The read-only, API-sourced rating already shown on Book Cards via `renderStarRating()`. It is unaffected by this feature.
- **Book_Card**: The existing `BookCard` component rendered in book grids.
- **Book_Details**: The existing `BookDetails` component rendered on the book detail page.
- **bookId**: The unique book identifier — `book.key`, `book.id`, or `book.title` — consistent with the existing `list.service.js` pattern.
- **bookRatingsUpdated**: The `CustomEvent` dispatched on `window` whenever a rating is saved or cleared, enabling live UI updates.

---

## Requirements

### Requirement 1: Rating Storage Service

**User Story:** As a developer, I want a dedicated rating service that persists user ratings in `localStorage`, so that the rest of the application can read and write ratings through a clean, consistent API.

#### Acceptance Criteria

1. THE Rating_Service SHALL store all user ratings under a single `localStorage` key (`"userRatings"`).
2. THE Rating_Service SHALL represent the stored value as a JSON object whose keys are `bookId` strings and whose values are integers in the range 1–5.
3. WHEN a rating is saved for a `bookId`, THE Rating_Service SHALL persist the new value and dispatch a `bookRatingsUpdated` CustomEvent on `window` with a `detail` object containing `bookId` and `rating`.
4. WHEN a rating is cleared for a `bookId`, THE Rating_Service SHALL remove the entry for that `bookId` and dispatch a `bookRatingsUpdated` CustomEvent on `window` with a `detail` object containing `bookId` and `rating: null`.
5. WHEN `localStorage` is unavailable or throws, THE Rating_Service SHALL handle the error gracefully and return a safe fallback without crashing.
6. THE Rating_Service SHALL expose a `getRating(bookId)` function that returns the stored integer or `null` if none exists.
7. THE Rating_Service SHALL expose a `setRating(bookId, value)` function that accepts an integer 1–5 and saves it.
8. THE Rating_Service SHALL expose a `clearRating(bookId)` function that removes the rating for that book.

---

### Requirement 2: Shared Star Widget Component

**User Story:** As a developer, I want a single reusable star-rating widget, so that both the Book Card and Book Details surfaces share identical behaviour and styling without code duplication.

#### Acceptance Criteria

1. THE Star_Widget SHALL render five interactive star icons using Font Awesome classes consistent with the project's existing star rendering.
2. WHEN a `bookId` and an initial `rating` value are provided to the Star_Widget, THE Star_Widget SHALL reflect that value by highlighting the appropriate number of stars on initial render.
3. WHEN the visitor hovers over a star, THE Star_Widget SHALL highlight all stars up to and including the hovered star as a preview.
4. WHEN the visitor moves the cursor away from the widget without clicking, THE Star_Widget SHALL revert to displaying the previously saved rating (or empty if none).
5. WHEN the visitor clicks a star whose index differs from the current saved rating, THE Star_Widget SHALL save the new rating via the Rating_Service and update the display to reflect the new value.
6. WHEN the visitor clicks a star whose index equals the current saved rating, THE Star_Widget SHALL clear the rating via the Rating_Service and update the display to show no stars selected.
7. THE Star_Widget SHALL use Bootstrap utility classes for layout and spacing; custom CSS SHALL be limited to styling that Bootstrap utilities cannot provide.
8. THE Star_Widget SHALL expose a factory function `createStarWidget(bookId, containerEl)` that attaches the widget to a provided DOM element.
9. WHEN a `bookRatingsUpdated` event is received for the widget's `bookId`, THE Star_Widget SHALL re-render to reflect the updated rating, keeping multiple instances of the same book in sync.

---

### Requirement 3: Book Card Integration

**User Story:** As a visitor, I want to rate a book directly from the book grid card, so that I can quickly record my opinion without navigating to the book's detail page.

#### Acceptance Criteria

1. THE Book_Card SHALL render a Star_Widget in the card footer, positioned below the existing Display_Rating.
2. THE Star_Widget rendered inside a Book_Card SHALL use the card's `bookId` to read and write ratings.
3. WHEN a rating interaction occurs inside the Book_Card's Star_Widget, THE Book_Card SHALL NOT navigate to the book detail page (click propagation to the parent anchor SHALL be stopped).
4. THE Display_Rating shown on the Book_Card SHALL remain unchanged regardless of the User_Rating value.

---

### Requirement 4: Book Details Integration

**User Story:** As a visitor, I want to rate a book from its detail page with a clearly labelled "Your Rating" section, so that I can see and change my personal rating in context.

#### Acceptance Criteria

1. THE Book_Details SHALL render a dedicated "Your Rating" section that contains a Star_Widget and a text label (e.g. "Your Rating").
2. THE Star_Widget rendered inside Book_Details SHALL use the same `bookId` as the book being displayed.
3. WHEN the visitor sets or clears a rating on the Book_Details page, THE Star_Widget SHALL update its display immediately without a page reload.
4. THE "Your Rating" section in Book_Details SHALL be visually distinct from the existing API Display_Rating section.

---

### Requirement 5: Input Validation

**User Story:** As a developer, I want the rating service to reject invalid inputs, so that corrupt data never reaches `localStorage`.

#### Acceptance Criteria

1. IF `setRating` is called with a value outside the integer range 1–5, THEN THE Rating_Service SHALL reject the call and not modify stored data.
2. IF `setRating` or `clearRating` is called with a `bookId` that is `null`, `undefined`, or an empty string, THEN THE Rating_Service SHALL reject the call and not modify stored data.
3. IF the data stored at `"userRatings"` in `localStorage` cannot be parsed as valid JSON, THEN THE Rating_Service SHALL reset the entry to an empty object and continue operating normally.
