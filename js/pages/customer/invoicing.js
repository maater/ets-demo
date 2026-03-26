/**
 * Customer Invoicing — subscription, concurrency slots, rate limit controls, surge, invoices.
 */

import { getInvoices } from '../../data/timeline.js';
import { engagement } from '../../data/mock-data.js';
import { getEngagement } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderCircularGauge, renderProgressBar } from '../../components/progress-gauge.js';

export function render(container) {
  const invoiceList = getInvoices();
  const eng = getEngagement();
  const slotsUsed = eng.activeConcurrency;
  const slotsTotal = engagement.concurrencySlots;

  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <h1>Subscription & Invoicing</h1>
        <p>Manage your subscription tier, concurrent workstreams, and billing.</p>
      </div>

      <!-- Subscription Overview -->
      <div class="grid gap-6 mb-6" style="grid-template-columns: 1fr 280px;">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-xs text-muted mb-1">Current Subscription</div>
              <h3>Professional Tier — $${engagement.monthlyRate.toLocaleString()}/month</h3>
              <div class="text-sm text-muted mt-1">Billed monthly • Next billing: April 1, 2026</div>
            </div>
            ${renderBadge('active')}
          </div>

          <div class="separator"></div>

          <!-- Concurrency Slots -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-3">
              <h4>Concurrent Workstream Slots</h4>
              <span class="text-sm" style="font-weight:600; color:var(--primary);">${slotsUsed} of ${slotsTotal} active</span>
            </div>

            <div class="flex gap-3 mb-3">
              ${Array.from({ length: slotsTotal }, (_, i) => {
                const active = i < slotsUsed;
                const labels = ['Procurement Analytics', 'Supplier Risk Engine', 'Inventory Optimization', 'Executive Dashboard', 'Available'];
                return `
                  <div style="flex:1; text-align:center;">
                    <div style="width:100%; height:40px; border-radius:var(--radius); background:${active ? 'var(--primary)' : 'var(--bg-tertiary)'}; border:2px solid ${active ? 'var(--primary)' : 'var(--border)'}; display:flex; align-items:center; justify-content:center;">
                      <span style="font-size:var(--text-xs); color:${active ? 'white' : 'var(--text-muted)'}; font-weight:500;">${active ? '●' : '○'}</span>
                    </div>
                    <div class="text-xs ${active ? '' : 'text-muted'} mt-1">${labels[i] || (active ? 'Active' : 'Available')}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <p class="text-xs text-muted">Each slot represents one active workstream being delivered in parallel. More slots = faster throughput.</p>
          </div>

          <div class="separator"></div>

          <!-- Rate Limit / Tier Upgrade -->
          <div>
            <h4 class="mb-3">Adjust Your Capacity</h4>
            <div class="grid grid-3 gap-3">
              <!-- Current Tier -->
              <div class="card card-compact card-flat" style="background:var(--bg-secondary); border-color:var(--primary);">
                <div class="text-xs text-muted">Current</div>
                <div style="font-weight:700;">Professional</div>
                <div class="text-xs">${slotsTotal} slots • $${engagement.monthlyRate.toLocaleString()}/mo</div>
              </div>

              <!-- Upgrade Option -->
              <div class="card card-compact card-flat" style="background:var(--bg-secondary); cursor:pointer;" id="upgrade-enterprise">
                <div class="text-xs text-muted">Upgrade to</div>
                <div style="font-weight:700; color:var(--primary);">Enterprise</div>
                <div class="text-xs">10 slots • $32,000/mo</div>
              </div>

              <!-- Surge Option -->
              <div class="card card-compact card-flat" style="background:var(--warning-bg); border-color:var(--warning); cursor:pointer;" id="activate-surge">
                <div class="text-xs" style="color:var(--warning); font-weight:600;">⚡ Surge</div>
                <div style="font-weight:700;">+2 temp slots</div>
                <div class="text-xs">$4,500/slot/week</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Capacity Gauge -->
        <div>
          <div class="card text-center mb-4">
            <h4 class="mb-3">Capacity</h4>
            ${renderCircularGauge({ value: slotsUsed, max: slotsTotal, label: 'Slots Active', size: 100, color: slotsUsed >= slotsTotal ? 'var(--warning)' : 'var(--primary)' })}
            ${slotsUsed >= slotsTotal ? `
              <div class="callout mt-3" style="background:var(--warning-bg); border-left-color:var(--warning); text-align:left;">
                <p class="text-xs">All slots occupied. New workstreams will queue until a slot opens, or you can activate a surge.</p>
              </div>
            ` : `
              <div class="text-sm text-muted mt-2">${slotsTotal - slotsUsed} slot${slotsTotal - slotsUsed > 1 ? 's' : ''} available</div>
            `}
          </div>

          <!-- Surge Status -->
          <div class="card" id="surge-status-card">
            <h4 class="mb-2">Surge Status</h4>
            <div class="flex items-center gap-2 mb-2">
              <div style="width:8px; height:8px; border-radius:50%; background:var(--text-muted);"></div>
              <span class="text-sm text-muted">No active surge</span>
            </div>
            <p class="text-xs text-muted">Surge adds temporary capacity for time-sensitive work. Billed per-slot per-week on top of your subscription.</p>
          </div>
        </div>
      </div>

      <!-- Upgrade / Surge Modals (inline) -->
      <div id="upgrade-modal" class="card mb-6" style="display:none; border-color:var(--primary); border-width:2px;">
        <div class="flex items-center justify-between mb-4">
          <h3 style="color:var(--primary);">Upgrade to Enterprise</h3>
          <button class="btn btn-ghost btn-sm" id="close-upgrade">✕</button>
        </div>
        <div class="grid grid-2 gap-4 mb-4">
          <div>
            <div class="text-sm text-muted mb-1">What you get</div>
            <ul style="list-style:none;" class="text-sm">
              <li class="mb-1">✓ 10 concurrent workstreams (vs 5)</li>
              <li class="mb-1">✓ Dedicated team</li>
              <li class="mb-1">✓ Daily standups available</li>
              <li class="mb-1">✓ Custom AI agents</li>
              <li class="mb-1">✓ Executive sponsor access</li>
              <li class="mb-1">✓ Custom SLAs</li>
            </ul>
          </div>
          <div>
            <div class="text-sm text-muted mb-1">Pricing change</div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-muted" style="text-decoration:line-through;">$18,500/mo</span>
              <span>→</span>
              <span style="font-weight:700; font-size:var(--text-xl); color:var(--primary);">$32,000/mo</span>
            </div>
            <p class="text-xs text-muted">Change takes effect next billing cycle. No setup fees.</p>
          </div>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Request Upgrade</button>
      </div>

      <div id="surge-modal" class="card mb-6" style="display:none; border-color:var(--warning); border-width:2px;">
        <div class="flex items-center justify-between mb-4">
          <h3 style="color:var(--warning);">⚡ Activate Surge Capacity</h3>
          <button class="btn btn-ghost btn-sm" id="close-surge">✕</button>
        </div>
        <p class="text-sm text-secondary mb-4">Surge adds temporary workstream slots for time-sensitive work. Great for deadline pushes or catching up on backlog.</p>
        <div class="grid grid-3 gap-3 mb-4">
          <div class="card card-compact card-flat text-center" style="background:var(--bg-secondary); cursor:pointer;">
            <div style="font-weight:700; font-size:var(--text-lg);">+1 slot</div>
            <div class="text-xs text-muted">$4,500/week</div>
          </div>
          <div class="card card-compact card-flat text-center" style="background:var(--warning-bg); border-color:var(--warning); cursor:pointer;">
            <div style="font-weight:700; font-size:var(--text-lg); color:var(--warning);">+2 slots</div>
            <div class="text-xs text-muted">$8,000/week</div>
            <div class="text-xs" style="color:var(--accent);">Most popular</div>
          </div>
          <div class="card card-compact card-flat text-center" style="background:var(--bg-secondary); cursor:pointer;">
            <div style="font-weight:700; font-size:var(--text-lg);">+3 slots</div>
            <div class="text-xs text-muted">$11,000/week</div>
          </div>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-sm text-muted">Duration:</span>
          <select class="input" style="width:160px;">
            <option>1 week</option>
            <option selected>2 weeks</option>
            <option>4 weeks</option>
          </select>
        </div>
        <button class="btn btn-warning" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Activate Surge</button>
      </div>

      <!-- Invoice History -->
      <div class="card">
        <h3 class="mb-4">Invoice History</h3>
        ${invoiceList.length > 0 ? `
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Issue Date</th>
                  <th>Amount</th>
                  <th>Items Delivered</th>
                  <th>Slots Used</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${invoiceList.map(inv => `
                  <tr>
                    <td style="font-weight:500;">${inv.period}</td>
                    <td>${inv.issueDate}</td>
                    <td style="font-weight:600;">$${inv.amount.toLocaleString()}</td>
                    <td>${inv.itemsDelivered} items</td>
                    <td>${Math.min(slotsUsed, slotsTotal)}/${slotsTotal}</td>
                    <td>${renderBadge(inv.status)}</td>
                    <td>
                      <button class="btn btn-sm btn-ghost" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
                        📄 PDF
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">📄</div>
            <h3>No Invoices Yet</h3>
            <p class="text-muted mt-2">Invoices will appear here after your first billing cycle.</p>
          </div>
        `}
      </div>
    </div>
  `;

  // Bind upgrade / surge toggles
  container.querySelector('#upgrade-enterprise')?.addEventListener('click', () => {
    container.querySelector('#upgrade-modal').style.display = '';
    container.querySelector('#surge-modal').style.display = 'none';
  });
  container.querySelector('#close-upgrade')?.addEventListener('click', () => {
    container.querySelector('#upgrade-modal').style.display = 'none';
  });
  container.querySelector('#activate-surge')?.addEventListener('click', () => {
    container.querySelector('#surge-modal').style.display = '';
    container.querySelector('#upgrade-modal').style.display = 'none';
  });
  container.querySelector('#close-surge')?.addEventListener('click', () => {
    container.querySelector('#surge-modal').style.display = 'none';
  });
}
