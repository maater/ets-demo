/**
 * Main application entry point.
 * Initializes the nav, router, and state subscriptions.
 */

import { subscribe, getState, ROLES } from './store.js';
import { initRouter, handleRoute } from './router.js';
import { renderNav } from './components/nav.js?v=2';

function init() {
  // Render persistent UI
  renderNav(document.getElementById('top-nav'));

  // Subscribe to state changes to update nav
  subscribe((state, prev) => {
    // Re-render nav when role or page changes
    if (state.currentRole !== prev.currentRole || state.currentPage !== prev.currentPage) {
      renderNav(document.getElementById('top-nav'));
    }

    // Re-render current page when timeline changes
    if (state.currentTimePoint !== prev.currentTimePoint) {
      // Flash the content area to signal data refresh
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.transition = 'opacity 0.15s ease';
        mainContent.style.opacity = '0.4';
        setTimeout(() => { mainContent.style.opacity = '1'; }, 150);
      }

      // Update the timeline dropdown in demo controls
      const select = document.getElementById('demo-timeline-select');
      if (select) {
        select.value = state.currentTimePoint;
      }

      handleRoute();
    }
  });

  // Initialize router (handles first render)
  initRouter();
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
