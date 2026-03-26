/**
 * Main application entry point.
 * Initializes the nav, timeline, router, and state subscriptions.
 */

import { subscribe, getState, ROLES } from './store.js';
import { initRouter, handleRoute } from './router.js';
import { renderNav } from './components/nav.js';
import { renderSubNav } from './components/sub-nav.js';
import { renderTimeline } from './components/timeline-slider.js';

function init() {
  // Render persistent UI
  renderNav(document.getElementById('top-nav'));
  renderSubNav(document.getElementById('sub-nav'));
  renderTimeline(document.getElementById('timeline-bar'));

  // Subscribe to state changes to update nav and timeline highlights
  subscribe((state, prev) => {
    // Update role switcher active state
    if (state.currentRole !== prev.currentRole) {
      document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.role === state.currentRole);
      });
    }

    // Update sub-nav when role or page changes
    if (state.currentRole !== prev.currentRole || state.currentPage !== prev.currentPage) {
      renderSubNav(document.getElementById('sub-nav'));
    }

    // Update timeline active state
    if (state.currentTimePoint !== prev.currentTimePoint) {
      document.querySelectorAll('.timeline-point').forEach(point => {
        point.classList.toggle('active', point.dataset.timepoint === state.currentTimePoint);
      });
      // Re-render current page when timeline changes
      handleRoute();
    }

    // Update nav context
    updateNavContext(state);
  });

  // Initialize router (handles first render)
  initRouter();
}

function updateNavContext(state) {
  const ctx = document.getElementById('nav-context');
  if (!ctx) return;

  const tp = state.currentTimePoint;
  const descriptions = {
    day1: 'Day 1 — Self-assessment just submitted',
    day3: 'Day 3 — Discovery call completed',
    day5: 'Day 5 — Proposal sent to Meridian',
    day7: 'Day 7 — Proposal approved, engagement begins',
    week2: 'Week 2 — First sprint in progress',
    week4: 'Week 4 — First milestone delivered',
    week6: 'Week 6 — Ongoing delivery loop',
    week12: 'Week 12 — Mature engagement'
  };

  ctx.textContent = `Meridian Partners SAP Intelligence Project — ${descriptions[tp] || tp}`;
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
