/**
 * Rate-Limit / Tier Dashboard — concurrency management.
 */

import { engagement, users } from '../../data/mock-data.js';
import { getEngagement } from '../../data/timeline.js';
import { renderCircularGauge, renderProgressBar } from '../../components/progress-gauge.js';
import { renderMetricCard } from '../../components/metric-card.js';

export function render(container) {
  const eng = getEngagement();

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Concurrency & Rate Limits</h1>
        <p>Manage subscription tiers and workstream capacity.</p>
      </div>

      <!-- Current Subscription -->
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3>Meridian Partners</h3>
            <p class="text-sm text-muted">Professional Tier — $${engagement.monthlyRate.toLocaleString()}/month</p>
          </div>
          <button class="btn btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Modify Tier</button>
        </div>

        <div class="grid grid-3 gap-6">
          <div class="text-center">
            ${renderCircularGauge({ value: eng.activeConcurrency, max: engagement.concurrencySlots, label: 'Active Workstreams', size: 100, color: 'var(--primary)' })}
          </div>
          <div>
            <h4 class="mb-3">Workstream Allocation</h4>
            ${[
              { name: 'Procurement Analytics', active: true },
              { name: 'Supplier Risk Engine', active: true },
              { name: 'Inventory Optimization', active: eng.activeConcurrency >= 3 },
              { name: 'Executive Dashboard', active: eng.activeConcurrency >= 4 },
              { name: 'Slot Available', active: false }
            ].map(ws => `
              <div class="flex items-center gap-2 mb-2">
                <div style="width:8px; height:8px; border-radius:50%; background:${ws.active ? 'var(--accent)' : 'var(--border)'};"></div>
                <span class="text-sm ${ws.active ? '' : 'text-muted'}">${ws.name}</span>
              </div>
            `).join('')}
          </div>
          <div>
            <h4 class="mb-3">This Month</h4>
            <div class="flex flex-col gap-3 text-sm">
              <div class="flex justify-between"><span class="text-muted">Stories Delivered</span><span style="font-weight:600;">12</span></div>
              <div class="flex justify-between"><span class="text-muted">Agent Hours</span><span style="font-weight:600;">187h</span></div>
              <div class="flex justify-between"><span class="text-muted">Human Hours</span><span style="font-weight:600;">42h</span></div>
              <div class="flex justify-between"><span class="text-muted">Cost per Story</span><span style="font-weight:600;">$1,542</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Clients Overview -->
      <div class="card mb-6">
        <h3 class="mb-4">All Client Capacity</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Client</th><th>Tier</th><th>Slots</th><th>Active</th><th>Utilization</th><th>MRR</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:500;">Meridian Partners</td>
                <td>Professional</td>
                <td>${engagement.concurrencySlots}</td>
                <td>${eng.activeConcurrency}</td>
                <td>${renderProgressBar({ value: eng.activeConcurrency, max: engagement.concurrencySlots, showPct: true })}</td>
                <td style="font-weight:600;">$18,500</td>
              </tr>
              <tr style="opacity:0.6;">
                <td>Cascade Industries</td><td>Starter</td><td>2</td><td>2</td>
                <td>${renderProgressBar({ value: 2, max: 2, showPct: true, color: 'var(--warning)' })}</td>
                <td>$9,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Expansion Signal -->
      <div class="callout callout-accent">
        <div class="flex items-center gap-2 mb-2">
          <span class="badge badge-green">AI Expansion Signal</span>
        </div>
        <p class="text-sm">Meridian's backlog is growing 40% faster than current delivery velocity. With ${engagement.concurrencySlots - eng.activeConcurrency} unused slot(s), suggest proactive outreach about activating the remaining capacity or discussing a tier upgrade to Enterprise.</p>
      </div>
    </div>
  `;
}
