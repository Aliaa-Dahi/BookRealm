import "./book-card.css";

/**
 * Returns HTML string for a single Book Card Skeleton shimmer placeholder.
 * Structure mirrors the real BookCard exactly — cover, title, author, 
 * API rating row, divider, user rating row.
 */
export function BookCardSkeleton() {
  return `
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card book-card book-skeleton-card h-100 border-0">

        <div class="position-relative">
          <div class="img-holder">
            <div class="skeleton-box skeleton-cover w-100 h-100"></div>
          </div>
        </div>

        <div class="card-body d-flex flex-column justify-content-between p-0 pt-3">
          <div>
            <div class="skeleton-box skeleton-title-1 mb-2"></div>
            <div class="skeleton-box skeleton-title-2 mb-3"></div>
          </div>
          <div class="skeleton-box skeleton-author mt-1"></div>
        </div>

        <div class="card-footer bg-transparent border-0 px-0 pb-0 pt-0">
          <div class="card-rating-block">
            <!-- API rating row -->
            <div class="d-flex align-items-center gap-2">
              <div class="skeleton-box skeleton-stars"></div>
              <div class="skeleton-box skeleton-rating-num"></div>
            </div>
            <!-- divider -->
            <div class="card-rating-divider"></div>
            <!-- user rating row -->
            <div class="d-flex align-items-center gap-2">
              <div class="skeleton-box skeleton-you-label"></div>
              <div class="skeleton-box skeleton-stars"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Returns HTML grid string containing multiple book skeleton cards
 * @param {number} count Number of skeletons to render
 */
export function createSkeletonGrid(count = 8) {
  let skeletonsHTML = `<div class="row g-4">`;
  for (let i = 0; i < count; i++) {
    skeletonsHTML += BookCardSkeleton();
  }
  skeletonsHTML += `</div>`;
  return skeletonsHTML;
}
