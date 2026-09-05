import "../BookCard/book-card.css"; // reuses .skeleton-box and animation

/**
 * Returns the HTML string for the Book Details page skeleton.
 * Structure mirrors BookDetails exactly:
 *   - Left col: tall cover image
 *   - Right col: overline, title (2 lines), author, meta row,
 *                user-rating row, stats grid, action buttons
 */
export function BookDetailsSkeleton() {
    return `
        <div class="book-details-page container mt-4 pt-5">
            <div class="row gx-5 mt-4">

                <!-- Left: cover -->
                <div class="col-md-5 mb-4 mb-md-0">
                    <div class="bd-cover-wrapper rounded-4 overflow-hidden">
                        <div class="skeleton-box skeleton-bd-cover h-100"></div>
                    </div>
                </div>

                <!-- Right: info -->
                <div class="col-md-6 d-flex flex-column gap-3 pt-2">

                    <!-- Overline (subjects) -->
                    <div class="skeleton-box skeleton-bd-overline"></div>

                    <!-- Title — two lines -->
                    <div class="d-flex flex-column gap-2">
                        <div class="skeleton-box skeleton-bd-title-1"></div>
                        <div class="skeleton-box skeleton-bd-title-2"></div>
                    </div>

                    <!-- Author -->
                    <div class="skeleton-box skeleton-bd-author"></div>

                    <!-- Meta row: stars + publish date -->
                    <div class="d-flex align-items-center gap-3">
                        <div class="skeleton-box skeleton-bd-meta" style="width:120px"></div>
                        <div class="skeleton-box skeleton-bd-meta" style="width:140px"></div>
                    </div>

                    <!-- User rating row -->
                    <div class="skeleton-box skeleton-bd-rating-row"></div>

                    <!-- Stats grid: pages / languages / ratings count -->
                    <div class="d-flex gap-4 py-3" style="border-top:1px solid var(--paper-line); border-bottom:1px solid var(--paper-line)">
                        <div class="skeleton-box skeleton-bd-stat"></div>
                        <div class="skeleton-box skeleton-bd-stat"></div>
                        <div class="skeleton-box skeleton-bd-stat"></div>
                    </div>

                    <!-- Action buttons: eye + heart + dots -->
                    <div class="d-flex align-items-center gap-3 mt-2">
                        <div class="skeleton-box skeleton-bd-btn"></div>
                        <div class="skeleton-box skeleton-bd-btn"></div>
                        <div class="skeleton-box skeleton-bd-btn"></div>
                    </div>

                </div>
            </div>
        </div>
    `;
}
