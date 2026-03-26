/**
 * Customer Backlog — prioritizable list of stories with AI trade-off callouts.
 */

import { getStories, getEpics } from '../../data/timeline.js';
import { users } from '../../data/mock-data.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderProgressBar } from '../../components/progress-gauge.js';

export function render(container) {
  const stories = getStories();
  const epics = getEpics();

  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Backlog</h1>
            <p>Drag to reprioritize. AI will show trade-offs.</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm" id="view-by-epic">By Epic</button>
            <button class="btn btn-sm btn-primary" id="view-all">All Stories</button>
          </div>
        </div>
      </div>

      <!-- Epic summary cards -->
      <div class="grid gap-4 mb-6" style="grid-template-columns: repeat(${epics.length}, 1fr);">
        ${epics.map(epic => `
          <div class="card card-compact">
            <div class="flex items-center gap-2 mb-2">
              <div style="width:8px; height:8px; border-radius:50%; background:${epic.color};"></div>
              <h4 style="font-size: var(--text-sm);">${epic.title}</h4>
            </div>
            ${renderProgressBar({ value: epic.completedStories, max: epic.storyCount, label: `${epic.completedStories}/${epic.storyCount} stories` })}
          </div>
        `).join('')}
      </div>

      <!-- AI Trade-off callout -->
      <div id="ai-tradeoff" class="callout mb-4" style="display:none;"></div>

      <!-- Story list -->
      <div id="story-list" class="flex flex-col gap-2">
        ${stories.map((story, i) => renderStoryRow(story, i, epics)).join('')}
      </div>
    </div>
  `;

  // Make rows draggable
  bindDragReorder(container);
}

function renderStoryRow(story, index, epics) {
  const epic = epics.find(e => e.id === story.epicId);
  const assignees = (story.assignedTo || []).map(id => {
    const user = users[id];
    return user ? user.name : id;
  }).join(', ');

  return `
    <div class="card card-compact flex items-center gap-4 story-row" draggable="true" data-story-id="${story.id}" data-index="${index}" style="cursor: grab;">
      <div class="text-muted" style="width: 24px; text-align: center; cursor: grab;">⠿</div>
      <div style="width: 8px; height: 32px; border-radius: 4px; background: ${epic?.color || 'var(--border)'}; flex-shrink:0;"></div>
      <div style="flex:1; min-width:0;">
        <div class="flex items-center gap-2">
          <span style="font-weight:500;">${story.title}</span>
          ${renderBadge(story.status)}
        </div>
        <div class="text-xs text-muted mt-1">${epic?.title || ''} • ${story.effort}pt${assignees ? ` • ${assignees}` : ''}</div>
      </div>
      <div style="width:100px;">
        ${story.progress != null ? `
          <div class="progress-bar" style="height:4px;">
            <div class="progress-bar-fill" style="width:${story.progress}%; background:${story.status === 'done' ? 'var(--accent)' : 'var(--primary)'};"></div>
          </div>
        ` : ''}
      </div>
      ${renderBadge(story.priority)}
    </div>
  `;
}

function bindDragReorder(container) {
  const list = container.querySelector('#story-list');
  let draggedEl = null;

  list.addEventListener('dragstart', (e) => {
    draggedEl = e.target.closest('.story-row');
    if (draggedEl) {
      draggedEl.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
    }
  });

  list.addEventListener('dragend', () => {
    if (draggedEl) draggedEl.style.opacity = '1';
    draggedEl = null;
    list.querySelectorAll('.story-row').forEach(r => r.style.borderTop = '');
  });

  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('.story-row');
    if (target && target !== draggedEl) {
      list.querySelectorAll('.story-row').forEach(r => r.style.borderTop = '');
      target.style.borderTop = '2px solid var(--primary)';
    }
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target.closest('.story-row');
    if (target && draggedEl && target !== draggedEl) {
      list.insertBefore(draggedEl, target);
      target.style.borderTop = '';

      // Show AI trade-off callout
      const tradeoff = container.querySelector('#ai-tradeoff');
      tradeoff.style.display = 'block';
      tradeoff.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="badge badge-blue">AI Analysis</span>
          <span class="text-sm">Moving <strong>"${draggedEl.querySelector('[style*="font-weight"]')?.textContent || 'this item'}"</strong> up may push downstream items to the next sprint due to dependencies. Estimated impact: 1-2 day delay on dependent stories.</span>
        </div>
      `;

      setTimeout(() => { tradeoff.style.display = 'none'; }, 6000);
    }
  });
}
