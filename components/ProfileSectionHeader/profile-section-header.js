/**
 * ProfileSectionHeader
 * Renders the consistent section title row used across all profile tabs.
 * Produces the uppercase small-label style with a bottom border, matching
 * Favourites, Read List, My Lists, and individual list pages.
 *
 * @param {string} icon       - FontAwesome icon class (e.g. 'fa-solid fa-heart')
 * @param {string} title      - Section title text
 * @param {string} [rightHtml] - Optional HTML string for the right side (e.g. a ViewAll link or a button)
 * @returns {string} HTML string
 */
export default function ProfileSectionHeader(icon, title, rightHtml = '') {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3 profile-section-header pb-2">
            <h6 class="profile-section-title mb-0 d-flex align-items-center gap-2">
                <i class="${icon}" style="color: var(--secondary);"></i> ${title}
            </h6>
            ${rightHtml ? `<div>${rightHtml}</div>` : ''}
        </div>
    `;
}
