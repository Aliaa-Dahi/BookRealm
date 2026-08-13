import "./book-card.css";

/**
 * Returns HTML string for a single Book Card Skeleton shimmer placeholder
 */
export function BookCardSkeleton() {
  return `
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card book-card book-skeleton-card shadow-sm h-100">
        <div class="position-relative">
          <div class="skeleton-box skeleton-cover"></div>
          <div class="skeleton-box skeleton-badge"></div>
        </div>
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <div class="skeleton-box skeleton-title-1 mb-2"></div>
            <div class="skeleton-box skeleton-title-2 mb-3"></div>
          </div>
          <div class="skeleton-box skeleton-author"></div>
        </div>
        <div class="card-footer">
          <div class="edition-info d-flex justify-content-between pt-2">
            <div class="skeleton-box skeleton-footer-item"></div>
            <div class="skeleton-box skeleton-footer-item"></div>
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
