import './button.css';

export function MainBtn(label, icon = '', extraClass = '', type = 'button', attrs = '') {
  const iconHtml = icon ? `<i class="${icon}"></i>` : '';
  return `<button type="${type}" class="btn main-btn d-inline-flex align-items-center gap-2 ${extraClass}" ${attrs}>${iconHtml}${label}</button>`;
}

export function SubBtn(label, icon = '', extraClass = '', type = 'button', attrs = '') {
  const iconHtml = icon ? `<i class="${icon}"></i>` : '';
  return `<button type="${type}" class="btn sub-btn d-inline-flex align-items-center gap-2 ${extraClass}" ${attrs}>${iconHtml}${label}</button>`;
}
