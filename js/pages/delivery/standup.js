/**
 * Daily Standup View — per-member summaries + today's priority queue with reordering.
 */

import { users, agents } from '../../data/mock-data.js';
import { getStories } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';

export function render(container) {
  const stories = getStories();
  const activeItems = stories.filter(s =>
    s.status !== 'backlog' && s.status !== 'done'
  );

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
    <div class="page page-wide">
      <div class="page-header">
        <h1>Daily Standup</h1>
        <p>Auto-generated standup summaries + today's priority queue.</p>
      </div>

      <!-- AI Highlights -->
      <div class="callout callout-accent mb-6">
        <div class="flex items-center gap-2 mb-2">
          <span class="badge badge-blue">AI Cross-Dependency Alert</span>
        </div>
        <p class="text-sm">David's architecture review for the inventory module depends on Atlas's demand pattern analysis. Atlas is estimated to complete by EOD — suggest David schedules review for tomorrow morning. Also: plant 3000 access is blocking Sprint 5 data pipeline work — escalate to James for customer follow-up.</p>
      </div>

      <div class="grid gap-6" style="grid-template-columns: 1fr 340px;">
        <!-- Team Standups -->
        <div>
          <h3 class="mb-3">Team Updates</h3>
          <div class="flex flex-col gap-4">
            ${teamMembers.map(m => `
              <div class="card">
                <div class="flex items-center gap-3 mb-4">
                  <div class="avatar" style="background:${m.user.color}20; color:${m.user.color}; font-size: ${m.isAgent ? 'var(--text-base)' : 'var(--text-xs)'};">
                    ${m.user.avatar}
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

        <!-- Today's Priority Queue -->
        <div>
          <div class="card" style="position:sticky; top:120px;">
            <div class="flex items-center justify-between mb-3">
              <h3>Today's Priorities</h3>
              <span class="text-xs text-muted">${activeItems.length} items</span>
            </div>
            <p class="text-xs text-muted mb-4">Reorder to adjust today's focus. Top = highest priority.</p>

            <div class="flex flex-col gap-2" id="priority-queue">
              ${activeItems.map((item, i) => `
                <div class="flex items-center gap-2 p-2 priority-item" data-id="${item.id}" style="background:var(--bg-secondary); border-radius:var(--radius); border:1px solid var(--border);">
                  <!-- Priority rank -->
                  <span class="text-xs text-muted" style="width:20px; text-align:center; font-weight:700;">${i + 1}</span>

                  <!-- Priority arrows -->
                  <div class="flex flex-col" style="flex-shrink:0;">
                    <button class="btn btn-ghost standup-up" style="padding:0; width:20px; height:14px; font-size:9px; line-height:1;">▲</button>
                    <button class="btn btn-ghost standup-down" style="padding:0; width:20px; height:14px; font-size:9px; line-height:1;">▼</button>
                  </div>

                  <!-- Item info -->
                  <div style="flex:1; min-width:0;">
                    <div class="text-xs" style="font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title}</div>
                    <div class="flex items-center gap-1 mt-1">
                      ${renderBadge(item.status)}
                      <span class="text-xs text-muted">${item.effort || 0}pt</span>
                    </div>
                  </div>
                </div>
              `).join('')}

              ${activeItems.length === 0 ? '<div class="text-sm text-muted text-center p-4">No active items</div>' : ''}
            </div>

            <div class="separator mt-4 mb-3"></div>
            <div class="text-xs text-muted">
              💡 Priority changes here affect today's work focus. Use Sprint Plan for longer-term sprint-level prioritization.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind priority arrow clicks
  container.querySelectorAll('.standup-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.priority-item');
      const prev = item.previousElementSibling;
      if (prev && prev.classList.contains('priority-item')) {
        item.parentNode.insertBefore(item, prev);
        renumberQueue(container);
        flashItem(item, 'var(--accent-bg)');
      }
    });
  });

  container.querySelectorAll('.standup-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.priority-item');
      const next = item.nextElementSibling;
      if (next && next.classList.contains('priority-item')) {
        item.parentNode.insertBefore(next, item);
        renumberQueue(container);
        flashItem(item, 'var(--warning-bg)');
      }
    });
  });
}

function renumberQueue(container) {
  const items = container.querySelectorAll('.priority-item');
  items.forEach((item, i) => {
    const rank = item.querySelector('.text-xs.text-muted');
    if (rank && rank.style.width === '20px') {
      rank.textContent = i + 1;
    }
  });
}

function flashItem(item, color) {
  item.style.transition = 'background 0.3s ease';
  item.style.background = color;
  setTimeout(() => { item.style.background = 'var(--bg-secondary)'; }, 500);
}
