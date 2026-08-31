import "./book-card.css";

/**
 * Returns HTML string for a single Book Card Skeleton shimmer placeholder
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
          <div class="skeleton-box skeleton-author mt-2"></div>
        </div>
        <div class="card-footer bg-transparent border-0 p-0 pb-1 pt-2">
          <div class="book-card-rating d-flex align-items-center">
            <div class="skeleton-box skeleton-rating-stars"></div>
            <div class="skeleton-box skeleton-rating-number ms-2"></div>
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
