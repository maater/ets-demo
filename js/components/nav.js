import { ROLES, getState, switchRole } from '../store.js';

export function renderNav(container) {
  const state = getState();

  container.innerHTML = `
    <a href="#/public/home" class="nav-logo">
      <img src="assets/logo.svg" alt="Axon Labs">
    </a>

    <div class="nav-center">
      <div class="role-switcher">
        ${Object.entries(ROLES).map(([key, role]) => `
          <button class="role-btn ${state.currentRole === key ? 'active' : ''}" data-role="${key}">
            <span class="role-btn-icon">${role.icon}</span>
            <span>${role.label}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div id="nav-context" class="nav-context">
      Meridian Partners SAP Intelligence Project
    </div>
  `;

  // Bind role switcher clicks
  container.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchRole(btn.dataset.role);
    });
  });
}
