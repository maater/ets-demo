/**
 * Customer Approvals — pending items needing customer action.
 */

import { getStories } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderReviewBar, bindReviewBars } from '../../components/review-approve-bar.js';

export function render(container) {
  const stories = getStories();
  const reviewItems = stories.filter(s =>
    s.status === 'customer-review' || s.status === 'human-review' || s.status === 'agent-review'
  );

  // Add some mock pending items
  const pendingItems = [
    ...reviewItems.map(s => ({
      id: s.id,
      type: 'deliverable',
      title: s.title,
      description: `Review and approve the completed deliverable for "${s.title}".`,
      urgency: 'medium',
      timeImpact: 'Delays next sprint by 1-2 days if not reviewed within 48 hours'
    })),
    {
      id: 'q-1',
      type: 'question',
      title: 'Data Access Confirmation',
      description: 'We need confirmation on which SAP plant codes should be included in the initial data extraction. Currently scoped to plants 1000 and 2000 — should we include plant 3000 (Chicago warehouse)?',
      urgency: 'high',
      timeImpact: 'Blocking Sprint 3 data pipeline work'
    },
    {
      id: 'q-2',
      type: 'change-request',
      title: 'Supplier Risk Weighting Adjustment',
      description: 'Based on your feedback, we propose adjusting the financial health weighting from 20% to 25% and reducing geographic risk from 15% to 10%. This better reflects your domestic-focused supply chain.',
      urgency: 'low',
      timeImpact: 'Non-blocking — can be incorporated in next sprint'
    }
  ];

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Approvals & Requests</h1>
        <p>${pendingItems.length} items need your attention.</p>
      </div>

      <div class="flex flex-col gap-4" id="approvals-list">
        ${pendingItems.map((item, i) => `
          <div class="card animate-slide-up" style="animation-delay: ${i * 0.05}s;">
            <div class="flex items-center gap-3 mb-3">
              <span style="font-size: var(--text-lg);">${item.type === 'deliverable' ? '📦' : item.type === 'question' ? '❓' : '🔄'}</span>
              <div style="flex:1;">
                <div class="flex items-center gap-2">
                  <h4>${item.title}</h4>
                  ${renderBadge(item.urgency)}
                  <span class="badge">${item.type === 'deliverable' ? 'Deliverable' : item.type === 'question' ? 'Question' : 'Change Request'}</span>
                </div>
              </div>
            </div>
            <p class="text-sm text-secondary mb-3" style="line-height:1.6;">${item.description}</p>
            <div class="text-xs text-muted mb-4">
              ⏱ ${item.timeImpact}
            </div>
            ${renderReviewBar({ id: `review-${item.id}` })}
          </div>
        `).join('')}

        ${pendingItems.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">✅</div>
            <h3>All Clear</h3>
            <p class="text-muted mt-2">No items need your attention right now.</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  bindReviewBars(container);
}
