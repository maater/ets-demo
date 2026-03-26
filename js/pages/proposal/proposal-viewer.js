/**
 * Proposal Viewer — customer-side interactive proposal.
 */

import { proposal, users } from '../../data/mock-data.js';
import { renderInlineQuestion, bindInlineQuestions } from '../../components/inline-question.js';
import { renderReviewBar, bindReviewBars } from '../../components/review-approve-bar.js';
import { renderBadge } from '../../components/status-badge.js';

export function render(container) {
  const p = proposal;
  const sections = p.sections;

  container.innerHTML = `
    <div class="layout-sidebar">
      <!-- Sidebar Nav -->
      <div class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-section-title">Proposal Sections</div>
          <nav class="sidebar-nav">
            ${['Executive Summary', 'Approach', 'Epics & Stories', 'Timeline', 'Pricing', 'Risks', 'Team'].map((s, i) => `
              <a href="#section-${i}" class="sidebar-link ${i === 0 ? 'active' : ''}" data-section="${i}">
                <span class="sidebar-link-icon">${['📋','🎯','📦','📅','💰','⚠️','👥'][i]}</span>
                ${s}
              </a>
            `).join('')}
          </nav>
        </div>

        <div class="separator"></div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Actions</div>
          <button class="btn w-full mb-2" style="color:var(--primary); border-color:var(--primary);" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
            🔍 Review with Your Own AI
          </button>
          <button class="btn w-full btn-ghost" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
            📤 Export Context
          </button>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">Status</div>
          <div class="flex items-center gap-2 px-3">
            ${renderBadge(p.status)}
            <span class="text-xs text-muted">Sent ${p.sentDate}</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div style="padding: var(--space-8); overflow-y:auto;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 class="mb-2">${p.title}</h1>
          <p class="text-secondary mb-8">Prepared by Axon Labs for Meridian Partners</p>

          <!-- Executive Summary -->
          <section id="section-0" class="mb-8">
            <h2 class="mb-4">Executive Summary</h2>
            <p style="line-height:1.8; color:var(--text-secondary);">${sections.executiveSummary}</p>
            ${renderInlineQuestion({ sectionId: 'exec-summary' })}
          </section>

          <!-- Approach -->
          <section id="section-1" class="mb-8">
            <h2 class="mb-4">Approach</h2>
            <p style="line-height:1.8; color:var(--text-secondary);">${sections.approach}</p>
            ${renderInlineQuestion({ sectionId: 'approach' })}
          </section>

          <!-- Epics & Stories -->
          <section id="section-2" class="mb-8">
            <h2 class="mb-4">Epics & Deliverables</h2>
            <div class="flex flex-col gap-3">
              ${renderEpicCards()}
            </div>
          </section>

          <!-- Timeline -->
          <section id="section-3" class="mb-8">
            <h2 class="mb-4">Timeline</h2>
            <div class="flex flex-col gap-2">
              ${sections.timeline.map((phase, i) => `
                <div class="card card-compact flex items-center gap-4">
                  <div style="width:60px; height:60px; border-radius:var(--radius); background:var(--primary-bg); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <span style="font-weight:700; color:var(--primary);">W${phase.weeks}</span>
                  </div>
                  <div>
                    <h4>${phase.phase}</h4>
                    <p class="text-sm text-secondary">${phase.description}</p>
                  </div>
                  <button class="btn btn-ghost btn-sm ml-auto flag-btn" title="Flag concern" data-phase="${i}">🚩</button>
                </div>
              `).join('')}
            </div>
            ${renderInlineQuestion({ sectionId: 'timeline' })}
          </section>

          <!-- Pricing -->
          <section id="section-4" class="mb-8">
            <h2 class="mb-4">Pricing</h2>
            <div class="card" style="border-color:var(--primary);">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3>${sections.pricing.tier} Tier</h3>
                  <div class="text-sm text-muted">${sections.pricing.concurrency} concurrent workstreams</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:var(--text-3xl); font-weight:800; color:var(--primary);">$${sections.pricing.monthlyRate.toLocaleString()}</div>
                  <div class="text-sm text-muted">per month</div>
                </div>
              </div>
              <div class="separator"></div>
              <div class="grid grid-2 gap-4 mb-4">
                <div>
                  <div class="text-xs text-muted mb-1">Estimated Duration</div>
                  <div style="font-weight:600;">${sections.pricing.estimatedDuration}</div>
                </div>
                <div>
                  <div class="text-xs text-muted mb-1">Total Estimate</div>
                  <div style="font-weight:600;">$${sections.pricing.totalEstimate.toLocaleString()}</div>
                </div>
              </div>
              <div class="text-sm text-muted mb-1">Includes:</div>
              <ul style="list-style:none;">
                ${sections.pricing.includes.map(i => `<li class="flex items-center gap-2 mb-1 text-sm"><span style="color:var(--accent);">✓</span>${i}</li>`).join('')}
              </ul>
            </div>
            ${renderInlineQuestion({ sectionId: 'pricing' })}
          </section>

          <!-- Risks -->
          <section id="section-5" class="mb-8">
            <h2 class="mb-4">Risks</h2>
            <div class="flex flex-col gap-3">
              ${sections.risks.map(r => `
                <div class="card card-compact">
                  <div class="flex items-center gap-2 mb-2">
                    <h4>${r.risk}</h4>
                    ${renderBadge(r.likelihood === 'High' ? 'high' : r.likelihood === 'Medium' ? 'medium' : 'low')}
                  </div>
                  <div class="text-sm text-secondary mb-2"><strong>Impact:</strong> ${r.impact}</div>
                  <div class="text-sm text-secondary"><strong>Mitigation:</strong> ${r.mitigation}</div>
                  <div class="flex gap-2 mt-3">
                    <button class="btn btn-ghost btn-sm flag-btn">🚩 Flag as Concern</button>
                    <button class="btn btn-ghost btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">💬 Suggest Change</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Team -->
          <section id="section-6" class="mb-8">
            <h2 class="mb-4">Your Team</h2>
            <div class="grid grid-2 gap-4">
              ${sections.team.map(t => {
                const user = users[t.user];
                return `
                  <div class="card card-compact flex items-center gap-3">
                    <div class="avatar avatar-lg" style="background:${user.color}20; color:${user.color};">${user.avatar}</div>
                    <div>
                      <div style="font-weight:600;">${user.name}</div>
                      <div class="text-sm text-muted">${t.role}</div>
                      <div class="text-xs text-secondary mt-1">${t.responsibility}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>

          <!-- Approval -->
          <div class="separator"></div>
          <div class="mt-6">
            <h2 class="mb-4">Your Decision</h2>
            ${renderReviewBar({ id: 'proposal-approval' })}
          </div>
        </div>
      </div>
    </div>
  `;

  bindInlineQuestions(container);
  bindReviewBars(container);

  // Flag concern buttons
  container.querySelectorAll('.flag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = '🚩 Flagged';
      btn.style.color = 'var(--danger)';
      btn.disabled = true;
    });
  });

  // Sidebar nav scrolling
  container.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      container.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const section = document.getElementById(`section-${link.dataset.section}`);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderEpicCards() {
  const { epics } = await_import_epics();
  return epics.map(epic => `
    <div class="accordion-item">
      <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
        <div class="flex items-center gap-3">
          <div style="width:8px; height:8px; border-radius:50%; background:${epic.color};"></div>
          <span>${epic.title}</span>
          <span class="text-xs text-muted">${epic.storyCount} stories • ${epic.effort || '~30'}pts</span>
        </div>
        <span class="accordion-arrow">▶</span>
      </div>
      <div class="accordion-content">
        <p class="text-sm text-secondary mb-3">${epic.description}</p>
        <div class="flex gap-2 mt-2">
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">🚩 Flag Concern</button>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">💬 Suggest Change</button>
        </div>
      </div>
    </div>
  `).join('');
}

function await_import_epics() {
  // Inline for simplicity
  return {
    epics: [
      { title: 'Procurement Analytics', description: 'AI-powered analysis of procurement patterns, spend optimization, and vendor performance across SAP MM data.', storyCount: 6, color: '#2563eb', effort: 47 },
      { title: 'Supplier Risk Engine', description: 'Real-time supplier risk scoring using delivery performance, financial indicators, and market signals.', storyCount: 5, color: '#dc2626', effort: 39 },
      { title: 'Inventory Optimization', description: 'ML-driven inventory forecasting and reorder point optimization based on SAP PP and MM data.', storyCount: 5, color: '#059669', effort: 34 },
      { title: 'Executive Dashboard', description: 'C-suite dashboard with KPIs, trend analysis, and AI-generated executive briefings.', storyCount: 4, color: '#d97706', effort: 21 },
      { title: 'API & Integrations', description: 'SAP data connectors, webhook system, and third-party integration framework.', storyCount: 3, color: '#6b7280', effort: 21 }
    ]
  };
}
