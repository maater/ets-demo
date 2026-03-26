/**
 * Simple pub/sub state store for the demo app.
 * Manages current role, timeline point, and active sub-page.
 */

const ROLES = {
  public: { label: 'Public Site', icon: '🌐', defaultPage: 'home' },
  customer: { label: 'Customer', icon: '👤', defaultPage: 'dashboard' },
  sales: { label: 'Sales', icon: '📈', defaultPage: 'intake-pipeline' },
  delivery: { label: 'Delivery', icon: '🔧', defaultPage: 'delivery-kanban' },
  admin: { label: 'Admin', icon: '🤖', defaultPage: 'agent-monitoring' }
};

const TIMELINE_POINTS = [
  { id: 'day1', label: 'Day 1', description: 'Self-assessment submitted' },
  { id: 'day3', label: 'Day 3', description: 'Discovery call completed' },
  { id: 'day5', label: 'Day 5', description: 'Proposal sent' },
  { id: 'day7', label: 'Day 7', description: 'Proposal approved' },
  { id: 'week2', label: 'Week 2', description: 'First sprint in progress' },
  { id: 'week4', label: 'Week 4', description: 'First milestone delivered' },
  { id: 'week6', label: 'Week 6', description: 'Ongoing delivery loop' },
  { id: 'week12', label: 'Week 12', description: 'Mature engagement' }
];

let state = {
  currentRole: 'public',
  currentTimePoint: 'week6',
  currentPage: 'home'
};

const listeners = new Set();

function getState() {
  return { ...state };
}

function setState(partial) {
  const prev = { ...state };
  state = { ...state, ...partial };

  // Notify listeners if something actually changed
  const changed = Object.keys(partial).some(k => prev[k] !== state[k]);
  if (changed) {
    listeners.forEach(fn => fn(state, prev));
  }
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function switchRole(role) {
  if (!ROLES[role]) return;
  const defaultPage = ROLES[role].defaultPage;
  setState({ currentRole: role, currentPage: defaultPage });
  window.location.hash = `#/${role}/${defaultPage}`;
}

function switchTimePoint(timePointId) {
  if (TIMELINE_POINTS.find(tp => tp.id === timePointId)) {
    setState({ currentTimePoint: timePointId });
  }
}

function navigateTo(role, page) {
  setState({ currentRole: role, currentPage: page });
  window.location.hash = `#/${role}/${page}`;
}

export {
  ROLES,
  TIMELINE_POINTS,
  getState,
  setState,
  subscribe,
  switchRole,
  switchTimePoint,
  navigateTo
};
