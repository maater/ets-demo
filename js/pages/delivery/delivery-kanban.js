/**
 * Delivery Kanban — 8-column board for delivery team.
 */

import { renderKanbanBoard, bindKanbanEvents } from '../../components/kanban-board.js';
import { getStories } from '../../data/timeline.js';
import { navigateTo } from '../../store.js';

export function render(container) {
  const stories = getStories();

  const columnDefs = [
    { id: 'backlog', title: 'Backlog', statuses: ['backlog'] },
    { id: 'sprint-ready', title: 'Sprint Ready', statuses: ['sprint-ready'] },
    { id: 'in-progress-agent', title: 'In Progress (Agent)', statuses: ['in-progress-agent'] },
    { id: 'in-progress-human', title: 'In Progress (Human)', statuses: ['in-progress-human'] },
    { id: 'agent-review', title: 'Agent Review', statuses: ['agent-review'] },
    { id: 'human-review', title: 'Human Review / PR', statuses: ['human-review'] },
    { id: 'customer-review', title: 'Customer Review', statuses: ['customer-review'] },
    { id: 'done', title: 'Done', statuses: ['done'] }
  ];

  const columns = columnDefs.map(col => ({
    ...col,
    items: stories.filter(s => col.statuses.includes(s.status))
  }));

  container.innerHTML = `
    <div class="page-full">
      <div class="flex items-center justify-between mb-4 px-6">
        <div>
          <h1>Delivery Board</h1>
          <p class="text-secondary">Sprint ${Math.max(1, Math.floor(stories.filter(s => s.status === 'done').length / 3) + 1)} — Meridian Partners</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm" data-nav="standup">📋 Standup View</button>
          <button class="btn btn-sm" data-nav="sme-portal">👤 SME Portal</button>
          <button class="btn btn-sm" data-nav="pr-review">📝 PR Queue</button>
        </div>
      </div>
      ${renderKanbanBoard({ columns, id: 'delivery-board' })}
    </div>
  `;

  bindKanbanEvents('delivery-board', {
    onCardClick(cardId) {
      navigateTo('delivery', 'story-detail');
    }
  });

  container.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo('delivery', btn.dataset.nav));
  });
}
