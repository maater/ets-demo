/**
 * Status badge rendering helpers.
 */

const STATUS_CONFIG = {
  'done': { label: 'Done', class: 'badge-green' },
  'in-progress': { label: 'In Progress', class: 'badge-blue' },
  'in-progress-agent': { label: 'Agent Working', class: 'badge-blue' },
  'in-progress-human': { label: 'Human Working', class: 'badge-blue' },
  'agent-review': { label: 'Agent Review', class: 'badge-amber' },
  'human-review': { label: 'Human Review', class: 'badge-amber' },
  'customer-review': { label: 'Customer Review', class: 'badge-amber' },
  'sprint-ready': { label: 'Sprint Ready', class: '' },
  'backlog': { label: 'Backlog', class: '' },
  'blocked': { label: 'Blocked', class: 'badge-red' },

  // Pipeline stages
  'new': { label: 'New', class: 'badge-blue' },
  'pre-qualifying': { label: 'Pre-Qualifying', class: 'badge-blue' },
  'ready-for-review': { label: 'Ready for Review', class: 'badge-amber' },
  'discovery-scheduled': { label: 'Discovery Scheduled', class: 'badge-green' },
  'proposal-sent': { label: 'Proposal Sent', class: 'badge-green' },
  'active': { label: 'Active', class: 'badge-green' },
  'churned': { label: 'Churned', class: 'badge-red' },

  // Agent statuses
  'working': { label: 'Working', class: 'badge-green' },
  'idle': { label: 'Idle', class: '' },
  'waiting': { label: 'Waiting', class: 'badge-amber' },
  'error': { label: 'Error', class: 'badge-red' },

  // Invoice statuses
  'paid': { label: 'Paid', class: 'badge-green' },
  'pending': { label: 'Pending', class: 'badge-amber' },
  'overdue': { label: 'Overdue', class: 'badge-red' },

  // Priorities
  'high': { label: 'High', class: 'badge-red' },
  'medium': { label: 'Medium', class: 'badge-amber' },
  'low': { label: 'Low', class: '' },

  // Proposal
  'approved': { label: 'Approved', class: 'badge-green' },
  'draft': { label: 'Draft', class: '' },
  'sent': { label: 'Sent', class: 'badge-blue' },
  'planned': { label: 'Planned', class: '' }
};

export function renderBadge(status, dot = false) {
  const config = STATUS_CONFIG[status] || { label: status, class: '' };
  return `<span class="badge ${config.class} ${dot ? 'badge-dot' : ''}">${config.label}</span>`;
}

export function getStatusLabel(status) {
  return STATUS_CONFIG[status]?.label || status;
}
