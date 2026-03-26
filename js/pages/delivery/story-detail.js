/**
 * Story Detail — full story view with chat, artifacts, and acceptance criteria.
 */

import { stories, users } from '../../data/mock-data.js';
import { getStories } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderReviewBar, bindReviewBars } from '../../components/review-approve-bar.js';
import { openChatSidebar } from '../../components/ai-chat-sidebar.js';
import { navigateTo } from '../../store.js';

export function render(container) {
  // Get a representative story (the risk scoring one is most interesting)
  const allStories = getStories();
  const story = allStories.find(s => s.id === 'story-8') || allStories.find(s => s.status !== 'backlog' && s.status !== 'done') || allStories[0];

  const assignees = (story.assignedTo || []).map(id => {
    const u = users[id];
    return u ? { ...u, isAgent: false } : { name: id, avatar: '🤖', color: '#2563eb', isAgent: true };
  });

  container.innerHTML = `
    <div class="page page-wide">
      <div class="flex items-center gap-2 mb-4">
        <button class="btn btn-ghost btn-sm" id="back-btn">← Board</button>
        <span class="text-muted">/</span>
        <span class="text-sm">${story.id}</span>
      </div>

      <div class="grid gap-6" style="grid-template-columns: 1fr 320px;">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 style="font-size:var(--text-2xl);">${story.title}</h1>
            ${renderBadge(story.status)}
            ${renderBadge(story.priority)}
          </div>
          <p class="text-secondary mb-6">${story.description}</p>

          <!-- Acceptance Criteria -->
          <div class="card mb-6">
            <h3 class="mb-3">Acceptance Criteria</h3>
            ${(story.acceptanceCriteria || []).map(ac => `
              <div class="flex items-start gap-2 mb-2">
                <input type="checkbox" ${story.status === 'done' ? 'checked' : ''} style="margin-top:3px;" />
                <span class="text-sm">${ac}</span>
              </div>
            `).join('')}
          </div>

          <!-- Chat Thread -->
          <div class="card mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3>Discussion</h3>
              <button class="btn btn-sm btn-primary" id="ai-assist-btn">💬 AI Assist</button>
            </div>
            <div class="flex flex-col gap-3">
              ${[
                { user: 'maria', text: 'Atlas has completed the initial research phase. The 6-factor model looks solid based on academic literature review.', time: '2 days ago' },
                { user: 'david', text: 'I reviewed the factor selection. Suggest adding price stability as a 6th factor — it was a key indicator in the Sterling Corp engagement.', time: '1 day ago' },
                { user: null, text: 'Forge has implemented the 6-factor scoring model. Ready for human review. Revision includes price stability factor per David\'s feedback.', time: '5 hours ago', isAgent: true }
              ].map(msg => `
                <div class="flex gap-3">
                  ${msg.isAgent
                    ? '<div class="avatar avatar-sm" style="background:var(--primary-bg); color:var(--primary);">🤖</div>'
                    : `<div class="avatar avatar-sm" style="background:${users[msg.user]?.color}20; color:${users[msg.user]?.color};">${users[msg.user]?.avatar || '?'}</div>`
                  }
                  <div style="flex:1;">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-sm" style="font-weight:500;">${msg.isAgent ? 'Forge (Coding Agent)' : users[msg.user]?.name}</span>
                      <span class="text-xs text-muted">${msg.time}</span>
                    </div>
                    <p class="text-sm text-secondary">${msg.text}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="flex gap-2 mt-4">
              <input type="text" class="input" placeholder="Add a comment..." />
              <button class="btn btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Send</button>
            </div>
          </div>

          <!-- Review Bar -->
          <div class="card">
            <h3 class="mb-3">Review & Approval</h3>
            ${story.status === 'done'
              ? renderReviewBar({ id: 'story-review', status: 'approved', reviewer: 'Maria Lopez — 3 days ago' })
              : renderReviewBar({ id: 'story-review' })
            }
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="card mb-4">
            <h4 class="mb-3">Details</h4>
            <div class="flex flex-col gap-3 text-sm">
              <div class="flex justify-between"><span class="text-muted">Status</span>${renderBadge(story.status)}</div>
              <div class="flex justify-between"><span class="text-muted">Priority</span>${renderBadge(story.priority)}</div>
              <div class="flex justify-between"><span class="text-muted">Effort</span><span style="font-weight:600;">${story.effort} points</span></div>
              <div class="flex justify-between"><span class="text-muted">Progress</span><span style="font-weight:600;">${story.progress || 0}%</span></div>
            </div>
            <div class="separator"></div>
            <div class="text-xs text-muted mb-2">Assigned To</div>
            <div class="flex flex-col gap-2">
              ${assignees.map(a => `
                <div class="flex items-center gap-2">
                  <div class="avatar avatar-sm" style="background:${a.color}20; color:${a.color};">${a.isAgent ? '🤖' : a.avatar}</div>
                  <span class="text-sm">${a.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card mb-4">
            <h4 class="mb-3">Artifacts</h4>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 p-2" style="background:var(--bg-secondary); border-radius:var(--radius); cursor:pointer;" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
                <span>📄</span>
                <div class="text-sm">risk_scoring_model.py</div>
              </div>
              <div class="flex items-center gap-2 p-2" style="background:var(--bg-secondary); border-radius:var(--radius); cursor:pointer;" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
                <span>📊</span>
                <div class="text-sm">factor_analysis.csv</div>
              </div>
              <div class="flex items-center gap-2 p-2" style="background:var(--bg-secondary); border-radius:var(--radius); cursor:pointer;" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
                <span>📝</span>
                <div class="text-sm">test_results.md</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h4 class="mb-3">Version History</h4>
            <div class="flex flex-col gap-2 text-xs">
              <div class="flex gap-2"><span class="text-muted">v3</span><span>Added price stability factor</span></div>
              <div class="flex gap-2"><span class="text-muted">v2</span><span>Expanded to 5-factor model</span></div>
              <div class="flex gap-2"><span class="text-muted">v1</span><span>Initial 2-factor implementation</span></div>
            </div>
            <button class="btn btn-sm btn-ghost w-full mt-3" onclick="window.location.hash='#/delivery/pr-review'">View Diff →</button>
          </div>
        </div>
      </div>
    </div>
  `;

  bindReviewBars(container);
  container.querySelector('#back-btn').addEventListener('click', () => navigateTo('delivery', 'delivery-kanban'));
  container.querySelector('#ai-assist-btn').addEventListener('click', () => {
    openChatSidebar({
      title: 'Story Assistant',
      context: `Working on "${story.title}". I have context on acceptance criteria, related stories, and agent outputs.`
    });
  });
}
