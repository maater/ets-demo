/**
 * Internal Invoicing — admin view for billing management.
 */

import { getInvoices } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderMetricCard } from '../../components/metric-card.js';
import { renderBarChart } from '../../components/chart.js';

export function render(container) {
  const invoices = getInvoices();

  // All invoices across clients
  const allInvoices = [
    ...invoices,
    { period: 'Dec 2025', issueDate: 'Jan 1, 2026', amount: 9500, status: 'paid', client: 'Cascade Industries', tier: 'Starter', itemsDelivered: 4 },
    { period: 'Jan 2026', issueDate: 'Feb 1, 2026', amount: 9500, status: 'paid', client: 'Cascade Industries', tier: 'Starter', itemsDelivered: 5 },
    { period: 'Feb 2026', issueDate: 'Mar 1, 2026', amount: 9500, status: 'paid', client: 'Cascade Industries', tier: 'Starter', itemsDelivered: 6 },
    { period: 'Mar 2026', issueDate: 'Apr 1, 2026', amount: 9500, status: 'pending', client: 'Cascade Industries', tier: 'Starter', itemsDelivered: 5 }
  ].map(inv => ({ ...inv, client: inv.client || 'Meridian Partners' }));

  const totalRevenue = allInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingAmount = allInvoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Invoicing</h1>
            <p>Billing management and revenue tracking.</p>
          </div>
          <button class="btn btn-sm btn-primary" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Generate Invoice</button>
        </div>
      </div>

      <div class="grid grid-4 gap-4 mb-6">
        ${renderMetricCard({ label: 'Total Revenue (Collected)', value: `$${totalRevenue.toLocaleString()}`, icon: '💰', color: 'var(--accent)' })}
        ${renderMetricCard({ label: 'Pending Invoices', value: `$${pendingAmount.toLocaleString()}`, icon: '⏳', color: 'var(--warning)' })}
        ${renderMetricCard({ label: 'Active Subscriptions', value: '2', icon: '📋' })}
        ${renderMetricCard({ label: 'Avg Revenue/Client', value: `$${Math.round(totalRevenue / 2).toLocaleString()}`, icon: '📊' })}
      </div>

      <div class="grid grid-2 gap-6 mb-6">
        <div class="card">
          ${renderBarChart({
            data: [
              { label: 'Dec', value: 28000 },
              { label: 'Jan', value: 28000 },
              { label: 'Feb', value: 28000 },
              { label: 'Mar', value: 28000 }
            ],
            label: 'Monthly Revenue',
            color: 'var(--accent)',
            height: 200
          })}
        </div>
        <div class="card">
          ${renderBarChart({
            data: [
              { label: 'Meridian', value: 18500, color: 'var(--primary)' },
              { label: 'Cascade', value: 9500, color: 'var(--accent)' }
            ],
            label: 'Revenue by Client',
            height: 200
          })}
        </div>
      </div>

      <!-- Invoice Table -->
      <div class="card">
        <h3 class="mb-4">All Invoices</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Client</th><th>Period</th><th>Tier</th><th>Amount</th><th>Items</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              ${allInvoices.map(inv => `
                <tr>
                  <td style="font-weight:500;">${inv.client}</td>
                  <td>${inv.period}</td>
                  <td>${inv.tier}</td>
                  <td style="font-weight:600;">$${inv.amount.toLocaleString()}</td>
                  <td>${inv.itemsDelivered}</td>
                  <td>${renderBadge(inv.status)}</td>
                  <td>
                    <button class="btn btn-sm btn-ghost" onclick="document.getElementById('not-implemented-modal').style.display='flex'">View</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
