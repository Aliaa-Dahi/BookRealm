export function renderProfile(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="container my-5 pt-5">
      <h1 class="playfair playfair-900 mb-4">User Profile</h1>
      <div class="card p-4 shadow-sm border-0 bg-light">
        <p class="inter fs-5">Welcome to your BookRealm profile!</p>
      </div>
    </div>
  `;
}