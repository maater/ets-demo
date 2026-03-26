/**
 * Sprint Plan (formerly Backlog) — prioritizable stories with capacity indicator.
 * Customers can increase/decrease priority for the current sprint.
 */

import { getStories, getEpics, getStats } from '../../data/timeline.js';
import { users, engagement } from '../../data/mock-data.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderProgressBar } from '../../components/progress-gauge.js';

const SPRINT_CAPACITY = 30; // story points per sprint

export function render(container) {
  const stories = getStories();
  const epics = getEpics();
  const stats = getStats();

  // Split into sprint vs backlog
  const sprintItems = stories.filter(s => s.status !== 'backlog' && s.status !== 'done');
  const backlogItems = stories.filter(s => s.status === 'backlog');
  const doneItems = stories.filter(s => s.status === 'done');

  const sprintPoints = sprintItems.reduce((sum, s) => sum + (s.effort || 0), 0);
  const capacityPct = Math.round((sprintPoints / SPRINT_CAPACITY) * 100);
  const capacityStatus = capacityPct > 110 ? 'over' : capacityPct > 90 ? 'just-right' : 'under';
  const capacityColor = capacityStatus === 'over' ? 'var(--danger)' : capacityStatus === 'just-right' ? 'var(--accent)' : 'var(--warning)';
  const capacityLabel = capacityStatus === 'over' ? 'Over-subscribed' : capacityStatus === 'just-right' ? 'Just Right' : 'Under-subscribed';

  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Sprint Plan</h1>
            <p>Plan and prioritize work for the current sprint. Drag or use arrows to adjust priority.</p>
          </div>
          <div class="badge" style="font-size:var(--text-sm); padding:var(--space-2) var(--space-4);">
            Sprint ${stats.sprintNumber || Math.max(1, Math.floor(doneItems.length / 3) + 1)}
          </div>
        </div>
      </div>

      <!-- Capacity Indicator -->
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-3">
          <h4>Sprint Capacity</h4>
          <div class="flex items-center gap-3">
            <span class="text-sm" style="font-weight:600; color:${capacityColor};">${capacityLabel}</span>
            <span class="text-sm text-muted">${sprintPoints} / ${SPRINT_CAPACITY} pts</span>
          </div>
        </div>

        <!-- Capacity bar -->
        <div style="position:relative; height:32px; background:var(--bg-tertiary); border-radius:var(--radius); overflow:hidden;">
          <div style="height:100%; width:${Math.min(capacityPct, 100)}%; background:${capacityColor}; border-radius:var(--radius); transition:width 0.4s ease; opacity:0.2;"></div>
          <div style="position:absolute; top:0; left:0; height:100%; width:${Math.min(capacityPct, 100)}%; background:${capacityColor}; border-radius:var(--radius); opacity:0.6; display:flex; align-items:center; justify-content:center;">
            <span style="color:white; font-size:var(--text-xs); font-weight:700;">${capacityPct}%</span>
          </div>
          <!-- 100% marker -->
          <div style="position:absolute; top:0; left:100%; height:100%; border-left:2px dashed var(--text-muted); opacity:0.3; transform:translateX(-2px);"></div>
        </div>

        ${capacityStatus === 'over' ? `
          <div class="callout mt-3" style="background:var(--danger-bg); border-left-color:var(--danger);">
            <p class="text-xs">Sprint is over capacity by ${sprintPoints - SPRINT_CAPACITY} points. Consider moving items to backlog or activating a surge slot.</p>
          </div>
        ` : capacityStatus === 'under' ? `
          <div class="callout mt-3" style="background:var(--warning-bg); border-left-color:var(--warning);">
            <p class="text-xs">${SPRINT_CAPACITY - sprintPoints} points of capacity remaining. You can pull items from the backlog to maximize this sprint.</p>
          </div>
        ` : `
          <div class="callout mt-3" style="background:var(--accent-bg); border-left-color:var(--accent);">
            <p class="text-xs">Sprint is well-balanced. Current load is within optimal capacity range.</p>
          </div>
        `}
      </div>

      <!-- Epic summary -->
      <div class="grid gap-3 mb-6" style="grid-template-columns: repeat(${Math.min(epics.length, 5)}, 1fr);">
        ${epics.map(epic => `
          <div class="card card-compact">
            <div class="flex items-center gap-2 mb-2">
              <div style="width:8px; height:8px; border-radius:50%; background:${epic.color};"></div>
              <span class="text-xs" style="font-weight:600;">${epic.title}</span>
            </div>
            ${renderProgressBar({ value: epic.completedStories, max: epic.storyCount, label: `${epic.completedStories}/${epic.storyCount}` })}
          </div>
        `).join('')}
      </div>

      <!-- Sprint Items -->
      <div class="flex items-center justify-between mb-3">
        <h3>This Sprint (${sprintItems.length} items, ${sprintPoints} pts)</h3>
      </div>

      <div class="flex flex-col gap-2 mb-8" id="sprint-list">
        ${sprintItems.map((story, i) => renderPlanRow(story, i, epics, 'sprint')).join('')}
        ${sprintItems.length === 0 ? '<div class="text-sm text-muted p-4">No items in sprint. Pull from backlog below.</div>' : ''}
      </div>

      <!-- Backlog -->
      <div class="flex items-center justify-between mb-3">
        <h3>Backlog (${backlogItems.length} items)</h3>
        <span class="text-xs text-muted">Items here are not scheduled for this sprint</span>
      </div>

      <div class="flex flex-col gap-2 mb-6" id="backlog-list">
        ${backlogItems.map((story, i) => renderPlanRow(story, i, epics, 'backlog')).join('')}
        ${backlogItems.length === 0 ? '<div class="text-sm text-muted p-4">Backlog is empty — all items are scheduled!</div>' : ''}
      </div>

      <!-- Done -->
      <details class="mb-4">
        <summary class="text-sm text-muted" style="cursor:pointer; padding:var(--space-2) 0;">
          Completed (${doneItems.length} items) ▸
        </summary>
        <div class="flex flex-col gap-2 mt-2">
          ${doneItems.map((story, i) => renderPlanRow(story, i, epics, 'done')).join('')}
        </div>
      </details>
    </div>
  `;

  // Bind priority buttons
  container.querySelectorAll('.priority-up-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.plan-row');
      const prev = row.previousElementSibling;
      if (prev && prev.classList.contains('plan-row')) {
        row.parentNode.insertBefore(row, prev);
        flashRow(row, 'var(--accent-bg)');
      }
    });
  });

  container.querySelectorAll('.priority-down-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.plan-row');
      const next = row.nextElementSibling;
      if (next && next.classList.contains('plan-row')) {
        row.parentNode.insertBefore(next, row);
        flashRow(row, 'var(--warning-bg)');
      }
    });
  });

  // Pull to sprint / move to backlog
  container.querySelectorAll('.pull-to-sprint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.plan-row');
      const sprintList = container.querySelector('#sprint-list');
      sprintList.appendChild(row);
      btn.textContent = '↓ Move to Backlog';
      btn.classList.remove('pull-to-sprint-btn');
      btn.classList.add('move-to-backlog-btn');
      flashRow(row, 'var(--accent-bg)');
      updateCapacity(container);
    });
  });

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.move-to-backlog-btn');
    if (btn) {
      const row = btn.closest('.plan-row');
      const backlogList = container.querySelector('#backlog-list');
      backlogList.appendChild(row);
      btn.textContent = '↑ Pull to Sprint';
      btn.classList.remove('move-to-backlog-btn');
      btn.classList.add('pull-to-sprint-btn');
      flashRow(row, 'var(--warning-bg)');
      updateCapacity(container);
    }
  });
}

function renderPlanRow(story, index, epics, section) {
  const epic = epics.find(e => e.id === story.epicId);
  const isDone = story.status === 'done';
  const isBacklog = section === 'backlog';

  return `
    <div class="card card-compact flex items-center gap-3 plan-row" data-story-id="${story.id}" data-effort="${story.effort || 0}" style="${isDone ? 'opacity:0.5;' : ''}">
      <!-- Priority arrows -->
      ${!isDone ? `
        <div class="flex flex-col gap-0" style="flex-shrink:0;">
          <button class="btn btn-ghost priority-up-btn" style="padding:0; width:24px; height:18px; font-size:10px; line-height:1;" title="Increase priority">▲</button>
          <button class="btn btn-ghost priority-down-btn" style="padding:0; width:24px; height:18px; font-size:10px; line-height:1;" title="Decrease priority">▼</button>
        </div>
      ` : '<div style="width:24px;"></div>'}

      <!-- Epic color bar -->
      <div style="width:4px; height:36px; border-radius:2px; background:${epic?.color || 'var(--border)'}; flex-shrink:0;"></div>

      <!-- Content -->
      <div style="flex:1; min-width:0;">
        <div class="flex items-center gap-2">
          <span style="font-weight:500; ${isDone ? 'text-decoration:line-through;' : ''}">${story.title}</span>
          ${renderBadge(story.status)}
        </div>
        <div class="text-xs text-muted mt-1">${epic?.title || ''} • ${story.effort || 0}pt</div>
      </div>

      <!-- Points badge -->
      <div style="width:48px; text-align:center; flex-shrink:0;">
        <span style="font-weight:700; font-size:var(--text-sm);">${story.effort || 0}</span>
        <div class="text-xs text-muted">pts</div>
      </div>

      <!-- Actions -->
      ${isBacklog ? `
        <button class="btn btn-sm btn-ghost pull-to-sprint-btn" style="color:var(--accent); flex-shrink:0;">↑ Pull to Sprint</button>
      ` : ''}
      ${!isDone && !isBacklog ? `
        ${renderBadge(story.priority)}
      ` : ''}
    </div>
  `;
}

function flashRow(row, color) {
  row.style.transition = 'background 0.3s ease';
  row.style.background = color;
  setTimeout(() => { row.style.background = ''; }, 600);
}

function updateCapacity(container) {
  const sprintList = container.querySelector('#sprint-list');
  const rows = sprintList.querySelectorAll('.plan-row');
  let pts = 0;
  rows.forEach(r => { pts += parseInt(r.dataset.effort || '0', 10); });

  // Just flash the capacity section to indicate change
  const pct = Math.round((pts / SPRINT_CAPACITY) * 100);
  // Simple visual feedback
  const capacityStatus = pct > 110 ? 'over' : pct > 90 ? 'just-right' : 'under';
  console.log(`Sprint updated: ${pts}/${SPRINT_CAPACITY} pts (${pct}%) — ${capacityStatus}`);
}
