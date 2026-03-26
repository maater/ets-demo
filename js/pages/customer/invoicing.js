/**
 * Customer Invoicing — invoice list and details.
 */

import { getInvoices } from '../../data/timeline.js';
import { renderBadge } from '../../components/status-badge.js';

export function render(container) {
  const invoiceList = getInvoices();

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Invoicing</h1>
        <p>Billing history and subscription details.</p>
      </div>

      <!-- Current Subscription -->
      <div class="card mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-muted mb-1">Current Subscription</div>
            <h3>Professional — $18,500/month</h3>
            <div class="text-sm text-muted">Next billing date: April 1, 2026</div>
          </div>
          ${renderBadge('active')}
        </div>
      </div>

      <!-- Invoice Table -->
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
                    <td>${renderBadge(inv.status)}</td>
                    <td>
                      <button class="btn btn-sm btn-ghost" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
                        Download PDF
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Invoice detail expandable -->
          <div class="mt-4">
            ${invoiceList.map(inv => `
              <div class="accordion-item">
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                  <span>${inv.period} — $${inv.amount.toLocaleString()}</span>
                  <span class="accordion-arrow">▶</span>
                </div>
                <div class="accordion-content">
                  <div class="grid grid-2 gap-4 mt-2">
                    <div>
                      <div class="text-xs text-muted mb-1">Subscription Tier</div>
                      <div class="text-sm font-semibold">${inv.tier}</div>
                    </div>
                    <div>
                      <div class="text-xs text-muted mb-1">Due Date</div>
                      <div class="text-sm">${inv.dueDate}</div>
                    </div>
                  </div>
                  <div class="mt-3">
                    <div class="text-xs text-muted mb-1">Milestones Achieved</div>
                    <div class="flex gap-2 flex-wrap">
                      ${inv.milestones.map(m => `<span class="badge badge-green">${m}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
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
}
