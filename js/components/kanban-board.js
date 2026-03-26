/**
 * Generic Kanban board with HTML5 drag-and-drop.
 */

import { users } from '../data/mock-data.js';
import { renderBadge } from './status-badge.js';

/**
 * Render a kanban board.
 * @param {Object} options
 * @param {Array} options.columns - [{ id, title, items }]
 * @param {Function} options.onCardClick - callback(item)
 * @param {string} options.id - board id
 */
export function renderKanbanBoard({ columns, id = 'kanban', onCardClick } = {}) {
  return `
    <div class="kanban-board" id="${id}">
      ${columns.map(col => `
        <div class="kanban-column" data-column="${col.id}" id="${id}-col-${col.id}">
          <div class="kanban-column-header">
            <span>${col.title}</span>
            <span class="kanban-column-count">${col.items.length}</span>
          </div>
          <div class="kanban-column-body" data-column="${col.id}">
            ${col.items.map(item => renderKanbanCard(item)).join('')}
            ${col.items.length === 0 ? '<div class="text-xs text-muted text-center p-4" style="opacity:0.5;">No items</div>' : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderKanbanCard(item) {
  const assignees = (item.assignedTo || []).map(id => {
    const user = users[id];
    if (user) {
      return `<div class="avatar avatar-sm" title="${user.name}" style="background: ${user.color}20; color: ${user.color};">${user.avatar}</div>`;
    }
    // Agent
    return `<div class="avatar avatar-sm" title="${id}" style="background: var(--primary-bg); color: var(--primary);">🤖</div>`;
  }).join('');

  const priorityClass = item.priority ? `priority-${item.priority}` : '';

  return `
    <div class="kanban-card ${priorityClass}" draggable="true" data-card-id="${item.id}" data-story-id="${item.id}">
      <div class="kanban-card-priority"></div>
      <div class="kanban-card-title">${item.title}</div>
      <div class="kanban-card-meta">
        ${item.epicId ? `<span class="chip" style="font-size:10px;">${getEpicName(item.epicId)}</span>` : ''}
        ${item.effort ? `<span title="Story points">${item.effort}pt</span>` : ''}
        <div class="kanban-card-assignees">${assignees}</div>
      </div>
    </div>
  `;
}

function getEpicName(epicId) {
  const names = {
    'epic-1': 'Procurement',
    'epic-2': 'Supplier Risk',
    'epic-3': 'Inventory',
    'epic-4': 'Executive',
    'epic-5': 'API'
  };
  return names[epicId] || epicId;
}

/**
 * Bind drag-and-drop and click events to a kanban board.
 */
export function bindKanbanEvents(containerId, { onCardClick, onCardMove } = {}) {
  const board = document.getElementById(containerId);
  if (!board) return;

  let draggedCard = null;

  board.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.kanban-card');
    if (!card) return;
    draggedCard = card;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.dataset.cardId);
  });

  board.addEventListener('dragend', (e) => {
    const card = e.target.closest('.kanban-card');
    if (card) card.classList.remove('dragging');
    document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    draggedCard = null;
  });

  board.addEventListener('dragover', (e) => {
    e.preventDefault();
    const column = e.target.closest('.kanban-column-body');
    if (column) {
      column.closest('.kanban-column').classList.add('drag-over');
    }
  });

  board.addEventListener('dragleave', (e) => {
    const column = e.target.closest('.kanban-column');
    if (column && !column.contains(e.relatedTarget)) {
      column.classList.remove('drag-over');
    }
  });

  board.addEventListener('drop', (e) => {
    e.preventDefault();
    const columnBody = e.target.closest('.kanban-column-body');
    if (columnBody && draggedCard) {
      columnBody.appendChild(draggedCard);
      // Update counts
      document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
        const body = col.querySelector('.kanban-column-body');
        const count = col.querySelector('.kanban-column-count');
        if (body && count) {
          count.textContent = body.querySelectorAll('.kanban-card').length;
        }
      });
      if (onCardMove) {
        onCardMove(draggedCard.dataset.cardId, columnBody.dataset.column);
      }
    }
  });

  // Card click
  if (onCardClick) {
    board.addEventListener('click', (e) => {
      const card = e.target.closest('.kanban-card');
      if (card && !e.target.closest('[draggable]')?.classList.contains('dragging')) {
        onCardClick(card.dataset.cardId || card.dataset.storyId);
      }
    });
  }
}
