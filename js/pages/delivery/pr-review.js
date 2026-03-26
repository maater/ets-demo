/**
 * PR Review — diff viewer with approval flow.
 */

import { renderDiffViewer, getMockDiff } from '../../components/diff-viewer.js';
import { renderReviewBar, bindReviewBars } from '../../components/review-approve-bar.js';
import { renderBadge } from '../../components/status-badge.js';
import { navigateTo } from '../../store.js';

export function render(container) {
  const codeDiff = getMockDiff('code');
  const docDiff = getMockDiff('doc');

  container.innerHTML = `
    <div class="page page-wide">
      <div class="flex items-center gap-2 mb-4">
        <button class="btn btn-ghost btn-sm" id="back-btn">← Board</button>
        <span class="text-muted">/</span>
        <span class="text-sm">PR Review Queue</span>
      </div>

      <div class="page-header">
        <h1>Review Queue</h1>
        <p>Agent outputs waiting for human review and approval.</p>
      </div>

      <!-- PR Item 1: Code -->
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <h3>Risk Scoring Algorithm Update</h3>
            ${renderBadge('human-review')}
          </div>
          <div class="flex items-center gap-2 text-sm text-muted">
            <span>🤖 Forge</span>
            <span>•</span>
            <span>2 hours ago</span>
          </div>
        </div>

        <div class="callout mb-4">
          <strong>Context:</strong> Expanded risk scoring from 2-factor to 6-factor model per David's review feedback. Added price stability, geographic risk, concentration risk, and quality metrics.
        </div>

        <!-- Review Checklist -->
        <div class="mb-4">
          <h4 class="mb-2">Review Checklist</h4>
          <div class="flex flex-col gap-2">
            ${['Logic correctness verified', 'Edge cases handled', 'Weight normalization (sum to 1.0)', 'Performance acceptable', 'Test coverage adequate'].map(item => `
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" /> ${item}
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Diff Viewer -->
        ${renderDiffViewer(codeDiff)}

        <div class="mt-4">
          ${renderReviewBar({ id: 'pr-code-review' })}
        </div>
      </div>

      <!-- PR Item 2: Document -->
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <h3>Executive Summary — Risk Assessment</h3>
            ${renderBadge('agent-review')}
          </div>
          <div class="flex items-center gap-2 text-sm text-muted">
            <span>🤖 Atlas</span>
            <span>•</span>
            <span>5 hours ago</span>
          </div>
        </div>

        <div class="callout mb-4">
          <strong>Context:</strong> Updated risk assessment based on new supplier data aggregation results. Elevated risk level from moderate to elevated due to single-source supplier concentration.
        </div>

        ${renderDiffViewer(docDiff)}

        <div class="mt-4">
          ${renderReviewBar({ id: 'pr-doc-review' })}
        </div>
      </div>

      <!-- Audit Trail -->
      <div class="card">
        <h3 class="mb-4">Recent Approvals</h3>
        <div class="flex flex-col gap-2">
          ${[
            { item: 'Spend Category Classifier v2', reviewer: 'Maria Lopez', action: 'Approved', time: '3 days ago' },
            { item: 'Vendor Scorecard Algorithm', reviewer: 'David Kim', action: 'Approved with Notes', time: '5 days ago' },
            { item: 'SAP RFC Connection Module', reviewer: 'David Kim', action: 'Approved', time: '2 weeks ago' }
          ].map(a => `
            <div class="flex items-center justify-between p-3" style="background:var(--bg-secondary); border-radius:var(--radius);">
              <div>
                <div class="text-sm" style="font-weight:500;">${a.item}</div>
                <div class="text-xs text-muted">${a.reviewer} • ${a.time}</div>
              </div>
              <span class="badge badge-green">${a.action}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  bindReviewBars(container);
  container.querySelector('#back-btn').addEventListener('click', () => navigateTo('delivery', 'delivery-kanban'));
}
