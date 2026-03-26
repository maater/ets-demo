/**
 * Customer Rate Limit / Subscription View.
 */

import { getEngagement } from '../../data/timeline.js';
import { engagement } from '../../data/mock-data.js';
import { renderCircularGauge } from '../../components/progress-gauge.js';
import { renderLineChart } from '../../components/chart.js';

export function render(container) {
  const eng = getEngagement();

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Subscription & Usage</h1>
        <p>Your current tier, capacity usage, and throughput.</p>
      </div>

      <div class="grid gap-6" style="grid-template-columns: 1fr 1fr;">
        <!-- Current Tier -->
        <div class="card">
          <div class="flex items-center gap-3 mb-4">
            <div class="badge badge-blue" style="font-size: var(--text-sm); padding: var(--space-2) var(--space-4);">Current Plan</div>
          </div>
          <h2 class="mb-1">${engagement.tier}</h2>
          <div style="font-size: var(--text-3xl); font-weight: 800; color: var(--primary);">$${engagement.monthlyRate.toLocaleString()}<span class="text-sm text-muted font-normal">/month</span></div>

          <div class="separator"></div>

          <ul style="list-style:none;">
            ${['Up to 5 concurrent workstreams', 'Dedicated delivery lead', 'Weekly progress reviews', 'Full AI agent fleet', 'Human review on all deliverables', 'Priority support', 'Knowledge base access'].map(f => `
              <li class="flex items-center gap-2 mb-2 text-sm">
                <span style="color:var(--accent);">✓</span> ${f}
              </li>
            `).join('')}
          </ul>

          <button class="btn w-full mt-4" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Change Tier</button>
        </div>

        <!-- Concurrency Usage -->
        <div class="card">
          <h3 class="mb-6">Concurrency Usage</h3>
          <div class="text-center mb-6">
            ${renderCircularGauge({ value: eng.activeConcurrency, max: engagement.concurrencySlots, label: 'Active Workstreams', size: 120, color: 'var(--primary)' })}
          </div>
          <div class="callout mb-4">
            <strong>${engagement.concurrencySlots - eng.activeConcurrency} slots available.</strong>
            You can add more items to the sprint to use your full capacity.
          </div>

          <h4 class="mb-3 mt-6">Throughput History</h4>
          ${renderLineChart({
            data: [
              { label: 'Jan', value: 4 },
              { label: 'Feb', value: 6 },
              { label: 'Mar', value: 5 },
            ],
            color: 'var(--primary)',
            fill: true,
            label: 'Items Delivered per Month'
          })}
        </div>
      </div>

      <!-- Tier Comparison -->
      <div class="card mt-6">
        <h3 class="mb-4">Tier Comparison</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Starter ($9,500/mo)</th>
                <th style="background: var(--primary-bg);">Professional ($18,500/mo) ✓</th>
                <th>Enterprise ($32,000/mo)</th>
              </tr>
            </thead>
            <tbody>
              ${[
                ['Concurrent Workstreams', '2', '5', '10'],
                ['Delivery Lead', 'Shared', 'Dedicated', 'Dedicated Team'],
                ['Progress Reviews', 'Bi-weekly', 'Weekly', 'Daily available'],
                ['AI Agent Fleet', 'Core', 'Full', 'Custom'],
                ['Estimated Throughput', '~4 items/mo', '~8 items/mo', '~15 items/mo'],
                ['Support Level', 'Standard', 'Priority', 'Custom SLA'],
              ].map(row => `
                <tr>
                  <td style="font-weight:500;">${row[0]}</td>
                  <td>${row[1]}</td>
                  <td style="background: var(--primary-bg);">${row[2]}</td>
                  <td>${row[3]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="callout callout-accent mt-4">
          💡 At the Enterprise tier, your estimated throughput would increase to ~15 items/month — a 87% improvement over your current plan.
        </div>
      </div>
    </div>
  `;
}
