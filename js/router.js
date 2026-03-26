/**
 * Simple hash-based router.
 * Routes: #/role/page (e.g., #/public/home, #/customer/dashboard)
 */

import { getState, setState, ROLES } from './store.js';

const pageCache = {};

function parseHash(hash) {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/');
  return {
    role: parts[0] || 'public',
    page: parts[1] || ROLES[parts[0]]?.defaultPage || 'home'
  };
}

async function loadPage(role, page) {
  const key = `${role}/${page}`;

  if (!pageCache[key]) {
    try {
      pageCache[key] = await import(`./pages/${key}.js`);
    } catch (e) {
      console.warn(`Page not found: ${key}`, e);
      pageCache[key] = {
        default: {
          render(container) {
            container.innerHTML = `
              <div class="page">
                <div class="empty-state">
                  <div class="empty-state-icon">📄</div>
                  <h3>Page Coming Soon</h3>
                  <p class="text-muted mt-2">${role} / ${page}</p>
                </div>
              </div>
            `;
          }
        }
      };
    }
  }

  return pageCache[key].default || pageCache[key];
}

async function handleRoute() {
  const { role, page } = parseHash(window.location.hash);

  // Update state without triggering another route
  const currentState = getState();
  if (currentState.currentRole !== role || currentState.currentPage !== page) {
    setState({ currentRole: role, currentPage: page });
  }

  const container = document.getElementById('main-content');
  if (!container) return;

  // Clear and show loading
  container.innerHTML = '<div class="page"><div class="animate-pulse text-muted text-center p-8">Loading...</div></div>';

  const pageModule = await loadPage(role, page);

  // Clear again in case of race condition
  container.innerHTML = '';

  if (typeof pageModule.render === 'function') {
    pageModule.render(container);
  }
}

function initRouter() {
  window.addEventListener('hashchange', handleRoute);

  // Set initial route if none
  if (!window.location.hash) {
    window.location.hash = '#/public/home';
  } else {
    handleRoute();
  }
}

// Clear page cache for a specific key (useful for re-rendering)
function invalidatePage(key) {
  delete pageCache[key];
}

export { initRouter, handleRoute, navigateTo, invalidatePage };

function navigateTo(role, page) {
  window.location.hash = `#/${role}/${page}`;
}
