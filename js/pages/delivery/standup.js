/**
 * Daily Standup View — per-member summaries.
 */

import { users, agents } from '../../data/mock-data.js';

export function render(container) {
  const teamMembers = [
    {
      user: users.maria,
      isAgent: false,
      yesterday: ['Reviewed and approved Vendor Scorecard v2', 'Sprint planning for Sprint 5'],
      today: ['Review Risk Scoring Algorithm PR', 'Customer check-in with Sarah'],
      blockers: []
    },
    {
      user: users.david,
      isAgent: false,
      yesterday: ['Validated SAP RFC connection performance', 'Provided feedback on risk factor weighting'],
      today: ['Architecture review for inventory module', 'Data quality assessment for new plant codes'],
      blockers: ['Waiting on IT security approval for plant 3000 access']
    },
    {
      user: { name: 'Atlas (Research Agent)', avatar: '🔍', color: '#2563eb' },
      isAgent: true,
      yesterday: ['Completed procurement anomaly pattern analysis', 'Generated supplier risk factor research report'],
      today: ['Analyzing demand patterns for inventory forecasting', 'Literature review on reorder point optimization'],
      blockers: []
    },
    {
      user: { name: 'Forge (Coding Agent)', avatar: '⚡', color: '#059669' },
      isAgent: true,
      yesterday: ['Implemented 6-factor risk scoring model', 'Updated unit tests for scoring module'],
      today: ['Building procurement dashboard chart components', 'API endpoint for risk score queries'],
      blockers: []
    },
    {
      user: { name: 'Pipeline (Data Agent)', avatar: '🔄', color: '#d97706' },
      isAgent: true,
      yesterday: ['Ran daily supplier data aggregation', 'Data quality check — 98.2% pass rate'],
      today: ['Incremental SAP MM extraction', 'Historical data backfill for Q3-Q4 2025'],
      blockers: []
    }
  ];

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Daily Standup</h1>
        <p>Auto-generated standup summaries for humans and agents.</p>
      </div>

      <!-- AI Highlights -->
      <div class="callout callout-accent mb-6">
        <div class="flex items-center gap-2 mb-2">
          <span class="badge badge-blue">AI Cross-Dependency Alert</span>
        </div>
        <p class="text-sm">David's architecture review for the inventory module depends on Atlas's demand pattern analysis. Atlas is estimated to complete by EOD — suggest David schedules review for tomorrow morning. Also: plant 3000 access is blocking Sprint 5 data pipeline work — escalate to James for customer follow-up.</p>
      </div>

      <div class="flex flex-col gap-4">
        ${teamMembers.map(m => `
          <div class="card">
            <div class="flex items-center gap-3 mb-4">
              <div class="avatar" style="background:${m.user.color}20; color:${m.user.color}; font-size: ${m.isAgent ? 'var(--text-base)' : 'var(--text-xs)'};">
                ${m.isAgent ? m.user.avatar : m.user.avatar}
              </div>
              <div>
                <div style="font-weight:600;">${m.user.name}</div>
                ${m.isAgent ? '<span class="badge badge-blue">AI Agent</span>' : `<span class="text-xs text-muted">${m.user.role || ''}</span>`}
              </div>
            </div>
            <div class="grid grid-3 gap-4">
              <div>
                <div class="text-xs text-muted mb-2" style="text-transform:uppercase; letter-spacing:0.05em;">Yesterday</div>
                ${m.yesterday.map(t => `<div class="flex items-start gap-2 mb-1"><span style="color:var(--accent);">✓</span><span class="text-sm">${t}</span></div>`).join('')}
              </div>
              <div>
                <div class="text-xs text-muted mb-2" style="text-transform:uppercase; letter-spacing:0.05em;">Today</div>
                ${m.today.map(t => `<div class="flex items-start gap-2 mb-1"><span style="color:var(--primary);">→</span><span class="text-sm">${t}</span></div>`).join('')}
              </div>
              <div>
                <div class="text-xs text-muted mb-2" style="text-transform:uppercase; letter-spacing:0.05em;">Blockers</div>
                ${m.blockers.length > 0
                  ? m.blockers.map(b => `<div class="flex items-start gap-2 mb-1"><span style="color:var(--danger);">⚠</span><span class="text-sm">${b}</span></div>`).join('')
                  : '<span class="text-sm text-muted">None</span>'
                }
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
