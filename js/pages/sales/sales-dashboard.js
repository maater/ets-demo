/**
 * Sales Dashboard — pipeline value, conversion, MRR charts.
 */

import { renderBarChart, renderLineChart } from '../../components/chart.js';
import { renderMetricCard } from '../../components/metric-card.js';

export function render(container) {
  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Sales Dashboard</h1>
        <p>Pipeline, revenue, and engagement metrics.</p>
      </div>

      <div class="grid grid-4 gap-4 mb-6">
        ${renderMetricCard({ label: 'Total MRR', value: '$28,000', icon: '💰', trend: 'up', trendLabel: '+$18.5K this quarter', color: 'var(--accent)' })}
        ${renderMetricCard({ label: 'Pipeline Value', value: '$72,000', icon: '📈', trend: 'up', trendLabel: '3 opportunities' })}
        ${renderMetricCard({ label: 'Win Rate', value: '67%', icon: '🎯', trend: 'up', trendLabel: '2 of 3 proposals' })}
        ${renderMetricCard({ label: 'Avg. Deal Size', value: '$18.5K', icon: '📊', trendLabel: 'monthly recurring' })}
      </div>

      <div class="grid grid-2 gap-6 mb-6">
        <div class="card">
          ${renderBarChart({
            data: [
              { label: 'New', value: 2, color: 'var(--primary-light)' },
              { label: 'Qualifying', value: 1, color: 'var(--primary)' },
              { label: 'Discovery', value: 1, color: 'var(--accent-light)' },
              { label: 'Proposal', value: 1, color: 'var(--accent)' },
              { label: 'Active', value: 2, color: 'var(--accent)' },
              { label: 'Churned', value: 1, color: 'var(--text-muted)' }
            ],
            label: 'Pipeline by Stage',
            height: 220
          })}
        </div>

        <div class="card">
          ${renderLineChart({
            data: [
              { label: 'Oct', value: 0 },
              { label: 'Nov', value: 0 },
              { label: 'Dec', value: 9500 },
              { label: 'Jan', value: 18500 },
              { label: 'Feb', value: 28000 },
              { label: 'Mar', value: 28000 }
            ],
            label: 'MRR Growth',
            color: 'var(--accent)',
            fill: true,
            height: 220
          })}
        </div>
      </div>

      <div class="grid grid-2 gap-6">
        <!-- Expansion Signals -->
        <div class="card">
          <h3 class="mb-4">Expansion Signals</h3>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between p-3" style="background:var(--accent-bg); border-radius:var(--radius);">
              <div>
                <div class="text-sm" style="font-weight:500;">Meridian Partners</div>
                <div class="text-xs text-muted">Backlog growing 40% faster than delivery velocity</div>
              </div>
              <span class="badge badge-green">Tier Upgrade Signal</span>
            </div>
            <div class="flex items-center justify-between p-3" style="background:var(--bg-secondary); border-radius:var(--radius);">
              <div>
                <div class="text-sm" style="font-weight:500;">Cascade Industries</div>
                <div class="text-xs text-muted">Requesting additional workstreams</div>
              </div>
              <span class="badge badge-blue">Add-on Signal</span>
            </div>
          </div>
        </div>

        <!-- At-Risk Indicators -->
        <div class="card">
          <h3 class="mb-4">At-Risk Indicators</h3>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between p-3" style="background:var(--warning-bg); border-radius:var(--radius);">
              <div>
                <div class="text-sm" style="font-weight:500;">Cascade Industries</div>
                <div class="text-xs text-muted">Feedback velocity declining — 8 days since last review</div>
              </div>
              <span class="badge badge-amber">Slow Engagement</span>
            </div>
            <div class="callout callout-accent text-xs">
              No critical risks detected. All active engagements have health scores above 70.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
