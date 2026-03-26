/**
 * Submission Detail — full view of Meridian's self-assessment with AI analysis.
 */

import { selfAssessment, companies, users } from '../../data/mock-data.js';
import { renderEditableSection, bindEditableSections } from '../../components/editable-section.js';
import { openChatSidebar } from '../../components/ai-chat-sidebar.js';
import { renderBadge } from '../../components/status-badge.js';
import { navigateTo } from '../../store.js';

export function render(container) {
  const sa = selfAssessment;
  const company = companies.meridian;

  container.innerHTML = `
    <div class="page page-wide">
      <div class="flex items-center gap-2 mb-4">
        <button class="btn btn-ghost btn-sm" id="back-btn">← Pipeline</button>
        <span class="text-muted">/</span>
        <span class="text-sm">Meridian Partners</span>
      </div>

      <div class="flex items-center justify-between mb-6">
        <div>
          <h1>${company.name}</h1>
          <p class="text-secondary">${company.industry} • ${company.employees} employees • ${company.revenue} revenue</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" id="ai-chat-btn">💬 Chat with AI</button>
          <button class="btn btn-accent" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Request Full Analysis</button>
          <button class="btn" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Decline with Feedback</button>
        </div>
      </div>

      <div class="grid gap-6" style="grid-template-columns: 1fr 360px;">
        <!-- Main Content -->
        <div>
          <!-- AI Pre-Qualification Report -->
          <div class="card mb-6">
            <h3 class="mb-4">AI Pre-Qualification Report</h3>

            <div class="grid grid-4 gap-4 mb-6">
              <div class="text-center">
                <div class="score score-high" style="margin:0 auto;">${sa.feasibility.score}</div>
                <div class="text-xs text-muted mt-1">Fit Score</div>
              </div>
              <div class="card card-compact card-flat" style="background:var(--bg-secondary);">
                <div class="text-xs text-muted">Complexity</div>
                <div style="font-weight:700;">${sa.feasibility.complexity}</div>
              </div>
              <div class="card card-compact card-flat" style="background:var(--bg-secondary);">
                <div class="text-xs text-muted">Timeline</div>
                <div style="font-weight:700;">${sa.feasibility.timeline}</div>
              </div>
              <div class="card card-compact card-flat" style="background:var(--bg-secondary);">
                <div class="text-xs text-muted">Est. Tier</div>
                <div style="font-weight:700;">Professional</div>
              </div>
            </div>

            ${renderEditableSection({
              id: 'preq-recommendation',
              title: 'Recommendation',
              content: sa.feasibility.recommendation
            })}

            ${renderEditableSection({
              id: 'preq-risks',
              title: 'Identified Risks',
              content: sa.feasibility.risks.map(r => `• ${r}`).join('\n')
            })}
          </div>

          <!-- Assessment Transcript -->
          <div class="card">
            <h3 class="mb-4">Self-Assessment Transcript</h3>
            <div class="flex flex-col gap-3">
              ${sa.conversation.map(msg => `
                <div class="flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}">
                  ${msg.type === 'ai' ? '<div class="avatar avatar-sm" style="background:var(--primary-bg); color:var(--primary);">AI</div>' : ''}
                  <div class="card card-compact" style="${msg.type === 'user' ? 'background:var(--primary); color:white;' : ''} max-width:80%;">
                    <p class="text-sm" style="line-height:1.6;">${msg.text}</p>
                  </div>
                  ${msg.type === 'user' ? `<div class="avatar avatar-sm" style="background:${users.sarah.color}20; color:${users.sarah.color};">${users.sarah.avatar}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <!-- Company Info -->
          <div class="card mb-4">
            <h4 class="mb-3">Company Info</h4>
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between"><span class="text-muted">Industry</span><span>${company.industry}</span></div>
              <div class="flex justify-between"><span class="text-muted">Size</span><span>${company.size}</span></div>
              <div class="flex justify-between"><span class="text-muted">Employees</span><span>${company.employees}</span></div>
              <div class="flex justify-between"><span class="text-muted">Revenue</span><span>${company.revenue}</span></div>
              <div class="flex justify-between"><span class="text-muted">Location</span><span>${company.location}</span></div>
            </div>
            <div class="separator"></div>
            <div class="text-xs text-muted mb-1">SAP Modules</div>
            <div class="flex gap-1 flex-wrap">
              ${company.sapModules.map(m => `<span class="badge">${m}</span>`).join('')}
            </div>
          </div>

          <!-- Similar Engagements -->
          <div class="card mb-4">
            <h4 class="mb-3">Similar Past Engagements</h4>
            <div class="flex flex-col gap-2">
              ${[
                { name: 'Apex Manufacturing', fit: 92, type: 'Procurement Analytics' },
                { name: 'Sterling Corp', fit: 78, type: 'Supplier Risk' },
                { name: 'Bayview Foods', fit: 71, type: 'Inventory Optimization' }
              ].map(e => `
                <div class="flex items-center justify-between p-2" style="border-radius:var(--radius); background:var(--bg-secondary);">
                  <div>
                    <div class="text-sm" style="font-weight:500;">${e.name}</div>
                    <div class="text-xs text-muted">${e.type}</div>
                  </div>
                  <span class="badge badge-green">${e.fit}% match</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Submitted By -->
          <div class="card">
            <h4 class="mb-3">Submitted By</h4>
            <div class="flex items-center gap-3">
              <div class="avatar" style="background:${users.sarah.color}20; color:${users.sarah.color};">${users.sarah.avatar}</div>
              <div>
                <div style="font-weight:500;">${users.sarah.name}</div>
                <div class="text-xs text-muted">${users.sarah.role} • ${company.name}</div>
              </div>
            </div>
            <div class="text-xs text-muted mt-2">Submitted ${sa.submittedDate}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  bindEditableSections(container);

  container.querySelector('#back-btn').addEventListener('click', () => navigateTo('sales', 'intake-pipeline'));
  container.querySelector('#ai-chat-btn').addEventListener('click', () => {
    openChatSidebar({
      title: 'Meridian Analysis Assistant',
      context: "I have full context on Meridian Partners' self-assessment, their SAP setup (ECC 6.0, MM/PP/FI/SD), and their procurement challenges.",
      messages: [
        { type: 'ai', text: "I've analyzed Meridian's self-assessment. Key findings: strong SAP footprint (MM+PP), clear pain points in procurement reporting, and a good timeline alignment. The 87 fit score reflects high compatibility with our standard procurement analytics offering. Want me to refine any section of the pre-qualification report?" }
      ]
    });
  });
}
