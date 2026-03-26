/**
 * SME Portal — lightweight view for subject-matter experts.
 */

import { getStories } from '../../data/timeline.js';
import { users } from '../../data/mock-data.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderReviewBar, bindReviewBars } from '../../components/review-approve-bar.js';
import { navigateTo } from '../../store.js';

export function render(container) {
  const stories = getStories();
  const reviewItems = stories.filter(s => s.status === 'human-review' || s.status === 'agent-review');
  const myItems = stories.filter(s => (s.assignedTo || []).includes('david') || (s.assignedTo || []).includes('maria'));

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>SME Portal</h1>
            <p>Items assigned to you or awaiting your review.</p>
          </div>
          <button class="btn btn-ghost btn-sm" id="back-btn">← Full Board</button>
        </div>
      </div>

      <!-- Pending Reviews -->
      <h3 class="mb-3">Pending Reviews (${reviewItems.length})</h3>
      ${reviewItems.length > 0 ? `
        <div class="flex flex-col gap-3 mb-8">
          ${reviewItems.map(item => `
            <div class="card">
              <div class="flex items-center gap-3 mb-2">
                <h4>${item.title}</h4>
                ${renderBadge(item.status)}
                ${renderBadge(item.priority)}
              </div>
              <p class="text-sm text-secondary mb-3">${item.description}</p>
              ${renderReviewBar({ id: `sme-review-${item.id}` })}
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="callout callout-accent mb-8">
          <p class="text-sm">No items pending review right now. Check back later or move the timeline forward.</p>
        </div>
      `}

      <!-- My Active Items -->
      <h3 class="mb-3">My Active Items (${myItems.length})</h3>
      <div class="flex flex-col gap-2">
        ${myItems.map(item => `
          <div class="card card-compact flex items-center gap-3 cursor-pointer" onclick="window.location.hash='#/delivery/story-detail'">
            <div style="flex:1;">
              <div class="flex items-center gap-2">
                <span style="font-weight:500;">${item.title}</span>
                ${renderBadge(item.status)}
              </div>
              <div class="text-xs text-muted mt-1">${item.effort}pt • ${item.progress || 0}% complete</div>
            </div>
            <div style="width:120px;">
              <div class="progress-bar" style="height:4px;">
                <div class="progress-bar-fill" style="width:${item.progress || 0}%; background:${item.status === 'done' ? 'var(--accent)' : 'var(--primary)'};"></div>
              </div>
            </div>
          </div>
        `).join('')}
        ${myItems.length === 0 ? '<p class="text-sm text-muted">No items assigned to you at this timeline point.</p>' : ''}
      </div>
    </div>
  `;

  bindReviewBars(container);
  container.querySelector('#back-btn').addEventListener('click', () => navigateTo('delivery', 'delivery-kanban'));
}
