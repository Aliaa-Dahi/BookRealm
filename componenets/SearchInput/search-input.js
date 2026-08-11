import "./search-input.css";

/**
 * SearchInput
 * Returns the HTML string for a beautifully styled search input field.
 *
 * @param {string} placeholder - The placeholder text for the input
 * @param {string} classNames - Additional class names for the input element (default: 'search-element')
 * @returns {string} HTML string
 */
export default function SearchInput(placeholder = "Search...", classNames = "search-element") {
    return `
        <div class="search-wrapper">
            <input type="search" class="search-input ${classNames}" placeholder="${placeholder}" autocomplete="off">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
        </div>
    `;
}
