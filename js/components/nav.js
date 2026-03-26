import { ROLES, TIMELINE_POINTS, getState, switchRole, switchTimePoint, navigateTo } from '../store.js';
import { getSubNavLinks } from './sub-nav.js';

let panelExpanded = true;

export function renderNav(container) {
  const state = getState();
  const subNavLinks = getSubNavLinks(state.currentRole);

  container.innerHTML = `
    <a href="#/${state.currentRole}/${state.currentPage}" class="nav-logo">
      <img src="assets/logo.svg" alt="Axon Labs">
    </a>

    <button class="demo-controls-toggle" id="demo-controls-toggle">
      <span>🎛️</span>
      <span>Demo Controls</span>
    </button>
  `;

  // Demo controls panel (rendered after the nav element)
  let panel = document.getElementById('demo-controls-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'demo-controls-panel';
    panel.className = 'demo-controls-panel';
    container.parentNode.insertBefore(panel, container.nextSibling);
  }

  panel.className = `demo-controls-panel${panelExpanded ? '' : ' collapsed'}`;
  panel.innerHTML = `
    <span class="demo-controls-label">Demo Controls — Switch views to explore the platform</span>

    <div class="role-switcher">
      ${Object.entries(ROLES).map(([key, role]) => `
        <button class="role-btn ${state.currentRole === key ? 'active' : ''}" data-role="${key}">
          <span class="role-btn-icon">${role.icon}</span>
          <span>${role.label}</span>
        </button>
      `).join('')}
    </div>

    <div class="demo-nav-links">
      ${subNavLinks.map(link => `
        <a href="#/${state.currentRole}/${link.page}" class="demo-nav-link ${state.currentPage === link.page ? 'active' : ''}" data-page="${link.page}">${link.label}</a>
      `).join('')}
    </div>

    <select class="demo-timeline-select" id="demo-timeline-select">
      ${TIMELINE_POINTS.map(tp => `
        <option value="${tp.id}" ${state.currentTimePoint === tp.id ? 'selected' : ''}>${tp.label} — ${tp.description}</option>
      `).join('')}
    </select>
  `;

  // Bind toggle
  document.getElementById('demo-controls-toggle').addEventListener('click', () => {
    panelExpanded = !panelExpanded;
    const p = document.getElementById('demo-controls-panel');
    if (p) {
      p.className = `demo-controls-panel${panelExpanded ? '' : ' collapsed'}`;
    }
  });

  // Bind role switcher clicks
  panel.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchRole(btn.dataset.role);
    });
  });

  // Bind sub-nav link clicks
  panel.querySelectorAll('.demo-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(state.currentRole, link.dataset.page);
    });
  });

  // Bind timeline selector
  document.getElementById('demo-timeline-select').addEventListener('change', (e) => {
    switchTimePoint(e.target.value);
  });
}
