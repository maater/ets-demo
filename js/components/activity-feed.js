/**
 * Activity feed — timestamped event list.
 */

import { users } from '../data/mock-data.js';

const TYPE_ICONS = {
  submission: '📋',
  qualification: '🤖',
  review: '👁️',
  call: '📞',
  proposal: '📄',
  question: '❓',
  approval: '✅',
  sprint: '🏃',
  delivery: '📦',
  milestone: '🎯',
  insight: '💡',
  suggestion: '✨'
};

export function renderActivityFeed(activities, { maxItems = 10, compact = false } = {}) {
  const items = activities.slice(0, maxItems);

  if (items.length === 0) {
    return '<div class="text-sm text-muted p-4">No activity yet</div>';
  }

  return `
    <div class="activity-feed" style="display:flex; flex-direction:column; gap: ${compact ? '2px' : 'var(--space-2)'};">
      ${items.map(item => {
        const icon = TYPE_ICONS[item.type] || '•';
        const user = item.user ? users[item.user] : null;
        const date = formatDate(item.date);

        return `
          <div class="flex gap-3 ${compact ? 'py-2' : 'p-3'}" style="border-radius: var(--radius); transition: background 0.15s;" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
            <span style="font-size: ${compact ? 'var(--text-sm)' : 'var(--text-base)'}; flex-shrink:0; width:24px; text-align:center;">${icon}</span>
            <div style="flex:1; min-width:0;">
              <div class="text-sm" style="line-height:1.4;">${item.text}</div>
              <div class="flex items-center gap-2 mt-1">
                ${user ? `<span class="text-xs text-muted">${user.name}</span>` : ''}
                <span class="text-xs text-muted">${date}</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date('2026-03-26');
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
