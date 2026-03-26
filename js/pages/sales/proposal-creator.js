/**
 * Proposal Creator — AI-assisted proposal generation with editable sections.
 */

import { proposal, users } from '../../data/mock-data.js';
import { renderEditableSection, bindEditableSections } from '../../components/editable-section.js';
import { openChatSidebar } from '../../components/ai-chat-sidebar.js';
import { renderBadge } from '../../components/status-badge.js';

export function render(container) {
  const p = proposal;

  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Proposal Creator</h1>
            <p>AI-generated proposal with human review workflow.</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary" id="ai-chat-btn">💬 Refine with AI</button>
            <button class="btn btn-accent" onclick="document.getElementById('not-implemented-modal').style.display='flex'">📤 Send to Customer</button>
            <button class="btn" onclick="document.getElementById('not-implemented-modal').style.display='flex'">📄 Export PDF</button>
          </div>
        </div>
      </div>

      <!-- Proposal Status Bar -->
      <div class="card card-compact mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-sm text-muted">Status:</span>
          ${renderBadge(p.status)}
          <span class="text-sm text-muted">Last edited: 2 hours ago</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-muted">Sections:</span>
          <span class="badge badge-green">5 accepted</span>
          <span class="badge badge-amber">2 in review</span>
        </div>
      </div>

      <!-- Editable Sections -->
      <div class="flex flex-col gap-6">
        ${renderEditableSection({
          id: 'prop-exec-summary',
          title: 'Executive Summary',
          content: p.sections.executiveSummary
        })}

        ${renderEditableSection({
          id: 'prop-approach',
          title: 'Approach',
          content: p.sections.approach
        })}

        ${renderEditableSection({
          id: 'prop-epics',
          title: 'Epics & Deliverables',
          content: [
            'Epic 1: Procurement Analytics — 6 stories, ~47 points',
            '  AI-powered analysis of procurement patterns, spend optimization, and vendor performance.',
            '',
            'Epic 2: Supplier Risk Engine — 5 stories, ~39 points',
            '  Real-time supplier risk scoring using delivery performance, financial indicators, and market signals.',
            '',
            'Epic 3: Inventory Optimization — 5 stories, ~34 points',
            '  ML-driven inventory forecasting and reorder point optimization.',
            '',
            'Epic 4: Executive Dashboard — 4 stories, ~21 points',
            '  C-suite dashboard with KPIs, trend analysis, and AI-generated briefings.',
            '',
            'Epic 5: API & Integrations — 3 stories, ~21 points',
            '  SAP data connectors, webhook system, and third-party integration framework.'
          ].join('\n')
        })}

        ${renderEditableSection({
          id: 'prop-timeline',
          title: 'Timeline',
          content: p.sections.timeline.map(t => `${t.phase} (Weeks ${t.weeks}): ${t.description}`).join('\n\n')
        })}

        ${renderEditableSection({
          id: 'prop-pricing',
          title: 'Pricing',
          content: [
            `Tier: ${p.sections.pricing.tier}`,
            `Monthly Rate: $${p.sections.pricing.monthlyRate.toLocaleString()}/mo`,
            `Concurrency: ${p.sections.pricing.concurrency} workstreams`,
            `Estimated Duration: ${p.sections.pricing.estimatedDuration}`,
            `Total Estimate: $${p.sections.pricing.totalEstimate.toLocaleString()}`,
            '',
            'Includes:',
            ...p.sections.pricing.includes.map(i => `  • ${i}`)
          ].join('\n')
        })}

        ${renderEditableSection({
          id: 'prop-risks',
          title: 'Risks & Mitigations',
          content: p.sections.risks.map(r =>
            `${r.risk} [${r.likelihood}]\n  Impact: ${r.impact}\n  Mitigation: ${r.mitigation}`
          ).join('\n\n')
        })}

        ${renderEditableSection({
          id: 'prop-team',
          title: 'Team Assignment',
          content: p.sections.team.map(t => {
            const u = users[t.user];
            return `${u.name} — ${t.role}\n  ${t.responsibility}`;
          }).join('\n\n')
        })}
      </div>
    </div>
  `;

  bindEditableSections(container);

  container.querySelector('#ai-chat-btn').addEventListener('click', () => {
    openChatSidebar({
      title: 'Proposal Assistant',
      context: "I have full context on Meridian's assessment, discovery notes, and our standard proposal templates.",
      messages: [
        { type: 'ai', text: "I've drafted all 7 sections based on Meridian's self-assessment and discovery call notes. Key customizations: adjusted risk section for their ECC 6.0 to S/4HANA migration timeline, and front-loaded procurement analytics since Rachel mentioned Q2 contract renegotiations. What would you like me to refine?" }
      ]
    });
  });
}
