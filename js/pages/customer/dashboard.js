/**
 * Customer Dashboard — at-a-glance view for Meridian Partners.
 */

import { renderMetricCard } from '../../components/metric-card.js';
import { renderProgressBar, renderCircularGauge } from '../../components/progress-gauge.js';
import { renderActivityFeed } from '../../components/activity-feed.js';
import { getEngagement, getActivityFeed, getStats } from '../../data/timeline.js';
import { engagement } from '../../data/mock-data.js';
import { navigateTo } from '../../store.js';

export function render(container) {
  const eng = getEngagement();
  const activities = getActivityFeed();
  const stats = getStats();

  if (eng.status === 'pre-engagement') {
    container.innerHTML = `
      <div class="page">
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>Welcome to Axon Labs</h3>
          <p class="text-muted mt-2">Your engagement hasn't started yet. Check back after proposal approval.</p>
          <p class="text-sm text-muted mt-4">Move the timeline forward to see the customer portal in action.</p>
        </div>
      </div>
    `;
    return;
  }

  const pendingApprovals = stats.reviewStories;
  const nextMilestone = eng.nextMilestone;

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Dashboard</h1>
            <p>Meridian Partners — SAP Intelligence Platform</p>
          </div>
          <div class="badge badge-green badge-dot" style="font-size: var(--text-sm); padding: var(--space-2) var(--space-4);">Active Engagement</div>
        </div>
      </div>

      <!-- Attention Items -->
      ${pendingApprovals > 0 ? `
        <div class="callout callout-warning mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span style="font-size: var(--text-xl);">⚡</span>
            <div>
              <strong>${pendingApprovals} item${pendingApprovals > 1 ? 's' : ''} need your attention</strong>
              <div class="text-xs text-muted">Deliverable approvals and feedback requests</div>
            </div>
          </div>
          <button class="btn btn-sm btn-warning" data-nav="approvals">Review Now →</button>
        </div>
      ` : ''}

      <!-- Metrics Row -->
      <div class="grid grid-4 gap-4 mb-6">
        ${renderMetricCard({ label: 'Sprint', value: `#${eng.currentSprint}`, icon: '🏃', trend: 'up', trendLabel: `of ${engagement.totalSprints} total` })}
        ${renderMetricCard({ label: 'Stories Completed', value: stats.doneStories, icon: '✅', trend: 'up', trendLabel: `of ${stats.totalStories} total`, color: 'var(--accent)' })}
        ${renderMetricCard({ label: 'In Progress', value: stats.inProgressStories, icon: '⚡', color: 'var(--primary)' })}
        ${renderMetricCard({ label: 'Health Score', value: `${eng.healthScore}%`, icon: '💚', trend: 'up', trendLabel: 'Strong', color: eng.healthScore > 80 ? 'var(--accent)' : 'var(--warning)' })}
      </div>

      <div class="grid gap-6" style="grid-template-columns: 1fr 1fr 280px;">
        <!-- Sprint Progress -->
        <div class="card">
          <h3 class="mb-4">Sprint Progress</h3>
          ${renderProgressBar({ value: stats.doneStories, max: stats.totalStories, label: 'Overall Completion' })}
          <div class="separator"></div>
          ${renderProgressBar({ value: stats.inProgressStories + stats.doneStories, max: stats.totalStories, label: 'Sprint Scope', color: 'var(--primary)' })}
          <div class="mt-4">
            <button class="btn btn-sm" data-nav="sprint">View Sprint Board →</button>
          </div>
        </div>

        <!-- Next Milestone -->
        <div class="card">
          <h3 class="mb-4">Next Milestone</h3>
          <div class="flex items-center gap-3 mb-3">
            <span style="font-size: var(--text-xl);">🎯</span>
            <div>
              <div style="font-weight: 600;">${nextMilestone.name}</div>
              <div class="text-sm text-muted">Target: ${nextMilestone.date}</div>
            </div>
          </div>
          ${renderProgressBar({ value: nextMilestone.progress, max: 100, label: 'Milestone Progress', color: 'var(--accent)' })}
          <div class="mt-4">
            <button class="btn btn-sm" data-nav="backlog">View Backlog →</button>
          </div>
        </div>

        <!-- Concurrency Gauge -->
        <div class="card text-center">
          <h3 class="mb-4">Workstreams</h3>
          ${renderCircularGauge({ value: eng.activeConcurrency, max: engagement.concurrencySlots, label: 'Active Slots', color: 'var(--primary)' })}
          <div class="text-xs text-muted mt-2">
            ${engagement.concurrencySlots - eng.activeConcurrency} slots available
          </div>
          <button class="btn btn-sm btn-ghost mt-3" data-nav="rate-limit">Manage Tier →</button>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="card mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3>Recent Activity</h3>
          <span class="text-xs text-muted">${activities.length} events</span>
        </div>
        ${renderActivityFeed(activities, { maxItems: 8 })}
      </div>
    </div>
  `;

  // Bind nav buttons
  container.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo('customer', btn.dataset.nav);
    });
  });
}
