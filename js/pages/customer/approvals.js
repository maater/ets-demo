/**
 * Customer Approvals & Suggestions — pending items + vendor suggestions with value/cost.
 */

import { getStories } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderReviewBar, bindReviewBars } from '../../components/review-approve-bar.js';

const SUGGESTIONS = [
  {
    id: 'sug-1',
    title: 'Automated PO Anomaly Alerts',
    description: 'Based on the procurement patterns we\'ve uncovered, we can flag purchase orders that deviate significantly from historical norms — catching pricing errors, duplicate orders, or unusual quantities before they\'re approved.',
    value: 'Catch procurement errors before they become costly. Similar clients saved $40K-$80K/year on average.',
    cost: '1 sprint',
    impact: 'Low — fits within existing data pipeline, no new SAP connections needed.',
    source: 'best-practice',
    sourceLabel: 'Axon Best Practice',
    sourceDetail: 'Pattern from 4 similar manufacturing engagements'
  },
  {
    id: 'sug-2',
    title: 'Supplier Diversity Scoring',
    description: 'Add a diversity dimension to your supplier risk model. Tracks geographic concentration, single-source dependencies, and recommends diversification targets.',
    value: 'Reduce supply chain disruption risk. Addresses the single-source steel supplier vulnerability Rachel flagged.',
    cost: '2 sprints',
    impact: 'Medium — requires new data enrichment from external sources.',
    source: 'customer-call',
    sourceLabel: 'From Discovery Call',
    sourceDetail: 'Rachel Torres raised supply chain concentration concern on Jan 8'
  },
  {
    id: 'sug-3',
    title: 'Weekly AI Executive Briefing Email',
    description: 'Auto-generated weekly email to Rachel (CFO) with top 5 procurement insights, risk changes, and recommended actions — no dashboard login required.',
    value: 'Keeps executive sponsors engaged without adding to their workload. Increases visibility of platform value at C-level.',
    cost: '0.5 sprints',
    impact: 'Low — leverages existing analytics, just adds a delivery channel.',
    source: 'customer',
    sourceLabel: 'Customer Request',
    sourceDetail: 'Sarah Chen mentioned this during Sprint 2 review'
  },
  {
    id: 'sug-4',
    title: 'Inventory Reorder Point Simulator',
    description: 'Interactive "what-if" tool that lets procurement managers simulate different reorder points and see predicted impact on stockouts, carrying costs, and order frequency.',
    value: 'Empower procurement team to make confident inventory decisions. Reduces dependency on gut-feel ordering.',
    cost: '3 sprints',
    impact: 'High — requires new ML model training and interactive UI.',
    source: 'best-practice',
    sourceLabel: 'Axon Best Practice',
    sourceDetail: 'High-impact feature from Sterling Corp engagement'
  },
  {
    id: 'sug-5',
    title: 'SAP Plant 3000 (Chicago) Data Integration',
    description: 'Extend current data extraction to include Plant 3000 (Chicago warehouse). Would give complete view across all manufacturing and distribution locations.',
    value: 'Complete data coverage — currently missing ~20% of procurement volume from Chicago operations.',
    cost: '1 sprint',
    impact: 'Low — same extraction pattern, just adding a new plant code.',
    source: 'customer-call',
    sourceLabel: 'From Sprint Review',
    sourceDetail: 'Identified as gap during Sprint 3 data quality review'
  }
];

const SOURCE_ICONS = {
  'best-practice': { icon: '🏆', color: 'var(--primary)' },
  'customer-call': { icon: '📞', color: 'var(--accent)' },
  'customer': { icon: '👤', color: 'var(--warning)' }
};

export function render(container) {
  const stories = getStories();
  const reviewItems = stories.filter(s =>
    s.status === 'customer-review' || s.status === 'human-review' || s.status === 'agent-review'
  );

  // Pending approval items
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
    }
  ];

  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <h1>Approvals & Requests</h1>
        <p>${pendingItems.length} items need your attention, plus ${SUGGESTIONS.length} suggestions from our team.</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button class="btn btn-sm btn-primary" id="tab-pending" data-tab="pending">
          Pending Approvals (${pendingItems.length})
        </button>
        <button class="btn btn-sm" id="tab-suggestions" data-tab="suggestions">
          Suggestions (${SUGGESTIONS.length})
        </button>
      </div>

      <!-- Pending Approvals -->
      <div id="panel-pending">
        <div class="flex flex-col gap-4">
          ${pendingItems.map((item, i) => `
            <div class="card" style="animation: slideUp 0.3s ease ${i * 0.05}s both;">
              <div class="flex items-center gap-3 mb-3">
                <span style="font-size: var(--text-lg);">${item.type === 'deliverable' ? '📦' : '❓'}</span>
                <div style="flex:1;">
                  <div class="flex items-center gap-2">
                    <h4>${item.title}</h4>
                    ${renderBadge(item.urgency)}
                    <span class="badge">${item.type === 'deliverable' ? 'Deliverable' : 'Question'}</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-secondary mb-3" style="line-height:1.6;">${item.description}</p>
              <div class="text-xs text-muted mb-4">⏱ ${item.timeImpact}</div>
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

      <!-- Suggestions Panel -->
      <div id="panel-suggestions" style="display:none;">
        <div class="callout callout-accent mb-4">
          <strong>How suggestions work:</strong> These are proactive recommendations from our team and AI agents — based on your data patterns, discovery calls, and best practices from similar engagements. Review the value and sprint cost, then add to your backlog if interested.
        </div>

        <div class="flex flex-col gap-4">
          ${SUGGESTIONS.map((sug, i) => {
            const src = SOURCE_ICONS[sug.source] || SOURCE_ICONS['best-practice'];
            const costColor = sug.cost.includes('0.5') ? 'var(--accent)' : sug.cost.includes('1') ? 'var(--primary)' : sug.cost.includes('2') ? 'var(--warning)' : 'var(--danger)';
            return `
              <div class="card" id="sug-card-${sug.id}" style="animation: slideUp 0.3s ease ${i * 0.06}s both;">
                <div class="flex items-center gap-3 mb-3">
                  <span style="font-size: var(--text-lg);">💡</span>
                  <div style="flex:1;">
                    <div class="flex items-center gap-2">
                      <h4>${sug.title}</h4>
                    </div>
                  </div>
                  <!-- Source badge -->
                  <div class="flex items-center gap-1" style="background:${src.color}10; border:1px solid ${src.color}30; padding:var(--space-1) var(--space-3); border-radius:var(--radius-sm);">
                    <span style="font-size:var(--text-sm);">${src.icon}</span>
                    <span class="text-xs" style="color:${src.color}; font-weight:500;">${sug.sourceLabel}</span>
                  </div>
                </div>

                <p class="text-sm text-secondary mb-4" style="line-height:1.6;">${sug.description}</p>

                <!-- Value & Cost Cards -->
                <div class="grid grid-2 gap-3 mb-4">
                  <div style="background:var(--accent-bg); border:1px solid var(--accent); border-radius:var(--radius); padding:var(--space-3);">
                    <div class="text-xs" style="font-weight:600; color:var(--accent); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:var(--space-1);">Value</div>
                    <p class="text-sm" style="line-height:1.5;">${sug.value}</p>
                  </div>
                  <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius); padding:var(--space-3);">
                    <div class="text-xs text-muted" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:var(--space-1);">Cost</div>
                    <div class="flex items-center gap-2 mb-1">
                      <span style="font-size:var(--text-lg); font-weight:700; color:${costColor};">${sug.cost}</span>
                    </div>
                    <p class="text-xs text-muted">${sug.impact}</p>
                  </div>
                </div>

                <!-- Source detail -->
                <div class="text-xs text-muted mb-4" style="display:flex; align-items:center; gap:var(--space-2);">
                  <span>${src.icon}</span>
                  <span>${sug.sourceDetail}</span>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-accent add-to-backlog-btn" data-sug-id="${sug.id}">
                    + Add to Backlog
                  </button>
                  <button class="btn btn-sm" data-sug-id="${sug.id}" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
                    💬 Discuss
                  </button>
                  <button class="btn btn-sm btn-ghost dismiss-btn" data-sug-id="${sug.id}">
                    Not Interested
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  bindReviewBars(container);

  // Tab switching
  const tabs = container.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('btn-primary'); t.classList.add('btn'); });
      tab.classList.add('btn-primary');
      const target = tab.dataset.tab;
      container.querySelector('#panel-pending').style.display = target === 'pending' ? '' : 'none';
      container.querySelector('#panel-suggestions').style.display = target === 'suggestions' ? '' : 'none';
    });
  });

  // Add to backlog
  container.querySelectorAll('.add-to-backlog-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = container.querySelector(`#sug-card-${btn.dataset.sugId}`);
      if (card) {
        card.style.borderColor = 'var(--accent)';
        card.style.background = 'var(--accent-bg)';
        btn.innerHTML = '✓ Added to Backlog';
        btn.disabled = true;
        btn.style.background = 'var(--accent)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--accent)';
      }
    });
  });

  // Dismiss
  container.querySelectorAll('.dismiss-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = container.querySelector(`#sug-card-${btn.dataset.sugId}`);
      if (card) {
        card.style.opacity = '0.4';
        card.style.pointerEvents = 'none';
        card.querySelector('h4').style.textDecoration = 'line-through';
      }
    });
  });
}
