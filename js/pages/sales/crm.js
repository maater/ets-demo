/**
 * CRM / Relationship View — customer profiles with health scores.
 */

import { companies, users, engagement } from '../../data/mock-data.js';
import { getEngagement, getActivityFeed } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderActivityFeed } from '../../components/activity-feed.js';
import { renderCircularGauge } from '../../components/progress-gauge.js';
import { renderLineChart } from '../../components/chart.js';

export function render(container) {
  const eng = getEngagement();
  const activities = getActivityFeed();

  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Customer Relationships</h1>
            <p>Manage client relationships and track engagement health.</p>
          </div>
          <button class="btn btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">+ Add Customer</button>
        </div>
      </div>

      <!-- Customer List -->
      <div class="card mb-6">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Company</th><th>Contact</th><th>Tier</th><th>Health</th><th>MRR</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr style="cursor:pointer;" onclick="document.getElementById('customer-detail').style.display='block'">
                <td style="font-weight:600;">Meridian Partners</td>
                <td>${users.sarah.name}</td>
                <td>Professional</td>
                <td><span class="score score-high" style="width:32px; height:32px; font-size:var(--text-xs);">${eng.healthScore}</span></td>
                <td style="font-weight:600;">$18,500</td>
                <td>${renderBadge(eng.status)}</td>
              </tr>
              <tr style="opacity:0.5;">
                <td>Cascade Industries</td><td>Mike Chen</td><td>Starter</td>
                <td><span class="score score-medium" style="width:32px; height:32px; font-size:var(--text-xs);">72</span></td>
                <td>$9,500</td><td>${renderBadge('active')}</td>
              </tr>
              <tr style="opacity:0.5;">
                <td>Summit Foods</td><td>Lisa Park</td><td>—</td>
                <td>—</td><td>—</td><td>${renderBadge('proposal-sent')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Customer Detail (Meridian) -->
      <div id="customer-detail">
        <div class="grid gap-6" style="grid-template-columns: 1fr 1fr 280px;">
          <!-- Company Profile -->
          <div class="card">
            <h3 class="mb-4">Meridian Partners</h3>
            <div class="flex flex-col gap-2 text-sm mb-4">
              <div class="flex justify-between"><span class="text-muted">Industry</span><span>${companies.meridian.industry}</span></div>
              <div class="flex justify-between"><span class="text-muted">Employees</span><span>${companies.meridian.employees}</span></div>
              <div class="flex justify-between"><span class="text-muted">Revenue</span><span>${companies.meridian.revenue}</span></div>
              <div class="flex justify-between"><span class="text-muted">Location</span><span>${companies.meridian.location}</span></div>
              <div class="flex justify-between"><span class="text-muted">Engagement Start</span><span>${engagement.startDate}</span></div>
              <div class="flex justify-between"><span class="text-muted">Current Sprint</span><span>#${eng.currentSprint}</span></div>
            </div>

            <h4 class="mb-2">Key Contacts</h4>
            ${['sarah', 'rachel'].map(id => {
              const u = users[id];
              return `
                <div class="flex items-center gap-3 mb-2">
                  <div class="avatar avatar-sm" style="background:${u.color}20; color:${u.color};">${u.avatar}</div>
                  <div><div class="text-sm" style="font-weight:500;">${u.name}</div><div class="text-xs text-muted">${u.role}</div></div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Activity Timeline -->
          <div class="card">
            <h3 class="mb-4">Interaction Timeline</h3>
            ${renderActivityFeed(activities, { maxItems: 10 })}
          </div>

          <!-- Health Score -->
          <div>
            <div class="card mb-4 text-center">
              <h4 class="mb-3">Relationship Health</h4>
              ${renderCircularGauge({ value: eng.healthScore, max: 100, label: 'Health Score', size: 100, color: eng.healthScore > 80 ? 'var(--accent)' : 'var(--warning)' })}
            </div>

            <!-- AI Suggestions -->
            <div class="card">
              <h4 class="mb-3">AI Suggestions</h4>
              <div class="callout callout-accent mb-2">
                <div class="text-xs" style="font-weight:600;">Schedule Check-in</div>
                <p class="text-xs text-muted mt-1">It's been 2 weeks since the last non-project touchpoint. Suggest a relationship check-in with Sarah.</p>
              </div>
              <div class="callout mb-2">
                <div class="text-xs" style="font-weight:600;">Quarterly Review Due</div>
                <p class="text-xs text-muted mt-1">Q1 review should be scheduled within the next 2 weeks to discuss outcomes and planning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
