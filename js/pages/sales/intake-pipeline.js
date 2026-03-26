/**
 * Intake Pipeline — Kanban board for sales submissions.
 */

import { renderKanbanBoard, bindKanbanEvents } from '../../components/kanban-board.js';
import { getPipelineStage } from '../../data/timeline.js';
import { selfAssessment, companies, users } from '../../data/mock-data.js';
import { navigateTo } from '../../store.js';

export function render(container) {
  const stage = getPipelineStage();

  // Build the Meridian submission card
  const meridianCard = {
    id: 'meridian-submission',
    title: 'Meridian Partners — SAP Intelligence',
    assignedTo: ['james'],
    priority: 'high',
    effort: null,
    epicId: null
  };

  // Some additional mock submissions
  const otherCards = [
    { id: 'sub-2', title: 'Cascade Industries — Inventory Analytics', assignedTo: ['james'], priority: 'medium' },
    { id: 'sub-3', title: 'Summit Foods — Supplier Portal', assignedTo: [], priority: 'low' },
    { id: 'sub-4', title: 'Ironbridge Mfg — Procurement Dashboard', assignedTo: ['james'], priority: 'medium' },
  ];

  const columns = [
    { id: 'new', title: 'New Submissions', items: stage === 'new' ? [meridianCard, ...otherCards.slice(0, 1)] : otherCards.slice(0, 1) },
    { id: 'pre-qualifying', title: 'Agent Pre-Qualifying', items: [] },
    { id: 'ready-review', title: 'Ready for Review', items: stage === 'new' ? [] : [] },
    { id: 'discovery', title: 'Discovery Scheduled', items: stage === 'discovery-scheduled' ? [meridianCard] : [] },
    { id: 'proposal-sent', title: 'Proposal Sent', items: stage === 'proposal-sent' ? [meridianCard] : [otherCards[1]] },
    { id: 'active', title: 'Active Engagement', items: stage === 'active' ? [meridianCard] : [] },
    { id: 'churned', title: 'Churned / Declined', items: [otherCards[2]] },
  ];

  container.innerHTML = `
    <div class="page-full">
      <div class="flex items-center justify-between mb-4 px-6">
        <div>
          <h1>Intake Pipeline</h1>
          <p class="text-secondary">Track submissions from self-assessment to active engagement.</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">+ New Submission</button>
          <button class="btn btn-sm btn-ghost" data-nav="crm">CRM View →</button>
        </div>
      </div>
      ${renderKanbanBoard({ columns, id: 'pipeline-board' })}
    </div>
  `;

  bindKanbanEvents('pipeline-board', {
    onCardClick(cardId) {
      if (cardId === 'meridian-submission') {
        navigateTo('sales', 'submission-detail');
      } else {
        document.getElementById('not-implemented-modal').style.display = 'flex';
      }
    }
  });

  container.querySelector('[data-nav="crm"]')?.addEventListener('click', () => navigateTo('sales', 'crm'));
}
