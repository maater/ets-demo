import { ROLES, getState } from '../store.js';

export function renderNav(container) {
  const state = getState();
  const role = ROLES[state.currentRole];

  container.innerHTML = `
    <a href="index.html" class="nav-logo">
      <img src="assets/logo.svg" alt="Axon Labs">
    </a>

    <div style="display:flex; align-items:center; gap:12px; margin-left:auto;">
      <span style="font-size:12px; color:var(--text-muted);">
        ${role ? `${role.icon} ${role.label}` : ''} · ${state.currentPage}
      </span>
      <a href="index.html" class="demo-controls-toggle" style="text-decoration:none;">
        ← Value Stream
      </a>
    </div>
  `;
}
