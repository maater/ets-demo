/**
 * Sub-navigation bar — contextual page links per role.
 */

import { getState } from '../store.js';

const SUB_NAV_LINKS = {
  public: [
    { page: 'home', label: 'Home' },
    { page: 'blog', label: 'Education Hub' },
    { page: 'how-we-work', label: 'How We Work' },
    { page: 'case-studies', label: 'Case Studies' },
    { page: 'self-assessment', label: 'Self-Assessment' }
  ],
  customer: [
    { page: 'dashboard', label: 'Dashboard' },
    { page: 'backlog', label: 'Backlog' },
    { page: 'sprint', label: 'Sprint' },
    { page: 'approvals', label: 'Approvals' },
    { page: 'proposal-viewer', label: 'Proposal' },
    { page: 'invoicing', label: 'Invoicing' }
  ],
  sales: [
    { page: 'intake-pipeline', label: 'Pipeline' },
    { page: 'submission-detail', label: 'Submission Detail' },
    { page: 'discovery-prep', label: 'Discovery Prep' },
    { page: 'proposal-creator', label: 'Proposal Creator' },
    { page: 'crm', label: 'CRM' },
    { page: 'sales-dashboard', label: 'Sales Dashboard' }
  ],
  delivery: [
    { page: 'delivery-kanban', label: 'Board' },
    { page: 'story-detail', label: 'Story Detail' },
    { page: 'pr-review', label: 'PR Review' },
    { page: 'standup', label: 'Standup' },
    { page: 'sme-portal', label: 'SME Portal' }
  ],
  admin: [
    { page: 'agent-monitoring', label: 'Agents' },
    { page: 'knowledge-base', label: 'Knowledge Base' },
    { page: 'rate-limit', label: 'Rate Limits' },
    { page: 'invoicing-admin', label: 'Invoicing' }
  ]
};

export function renderSubNav(container) {
  const state = getState();
  const role = state.currentRole;
  const page = state.currentPage;
  const links = SUB_NAV_LINKS[role] || [];

  if (links.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = '';
  container.innerHTML = `
    ${links.map(link => `
      <a href="#/${role}/${link.page}" class="sub-nav-link ${page === link.page ? 'active' : ''}">${link.label}</a>
    `).join('')}
  `;
}
