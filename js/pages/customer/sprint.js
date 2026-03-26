/**
 * Customer Sprint View — current sprint stories with burn-up chart.
 */

import { getStories, getStats } from '../../data/timeline.js';
import { users } from '../../data/mock-data.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderBurnUp } from '../../components/chart.js';

export function render(container) {
  const stories = getStories();
  const stats = getStats();

  // Simulate sprint stories (non-backlog items)
  const sprintStories = stories.filter(s => s.status !== 'backlog');

  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <h1>Sprint ${stats.sprintNumber || 1}</h1>
        <p>Current sprint progress and active workstreams.</p>
      </div>

      <div class="grid gap-6" style="grid-template-columns: 1fr 400px;">
        <!-- Sprint Stories -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3>Sprint Items</h3>
            <span class="text-sm text-muted">${sprintStories.length} items</span>
          </div>

          <div class="flex flex-col gap-2">
            ${sprintStories.map(story => {
              const assigneeNames = (story.assignedTo || []).map(id => {
                const u = users[id];
                return u ? u.name : id;
              });
              const isAgent = story.status.includes('agent');
              const isHuman = story.status.includes('human');

              return `
                <div class="card card-compact">
                  <div class="flex items-center gap-3">
                    <div style="flex:1;">
                      <div class="flex items-center gap-2 mb-1">
                        <span style="font-weight:500;">${story.title}</span>
                        ${renderBadge(story.status)}
                      </div>
                      <div class="text-xs text-muted">${assigneeNames.join(', ') || 'Unassigned'}</div>
                    </div>
                    <div class="flex items-center gap-2" style="width:150px;">
                      ${story.progress != null ? `
                        <div class="progress-bar" style="flex:1; height:6px;">
                          <div class="progress-bar-fill" style="width:${story.progress}%; background:${story.status === 'done' ? 'var(--accent)' : 'var(--primary)'};"></div>
                        </div>
                        <span class="text-xs text-muted" style="width:32px; text-align:right;">${story.progress}%</span>
                      ` : ''}
                    </div>
                    ${isAgent ? '<span title="AI Agent working">🤖</span>' : ''}
                    ${isHuman ? '<span title="Human working">👤</span>' : ''}
                  </div>
                </div>
              `;
            }).join('')}

            ${sprintStories.length === 0 ? `
              <div class="empty-state">
                <p class="text-muted">No active sprint items at this timeline point.</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Burn-up Chart & Stats -->
        <div>
          <div class="card mb-4">
            ${renderBurnUp({ total: stats.totalStories, completed: stats.doneStories })}
          </div>

          <div class="card">
            <h4 class="mb-3">Sprint Stats</h4>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between text-sm">
                <span class="text-muted">Total Items</span>
                <span style="font-weight:600;">${stats.totalStories}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">Completed</span>
                <span style="font-weight:600; color:var(--accent);">${stats.doneStories}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">In Progress</span>
                <span style="font-weight:600; color:var(--primary);">${stats.inProgressStories}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">In Review</span>
                <span style="font-weight:600; color:var(--warning);">${stats.reviewStories}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">Backlog</span>
                <span style="font-weight:600;">${stats.backlogStories}</span>
              </div>
              <div class="separator"></div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">Velocity</span>
                <span style="font-weight:600;">${stats.doneStories * 5} pts/sprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
