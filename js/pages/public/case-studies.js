/**
 * Case Studies page.
 */

import { caseStudies } from '../../data/mock-data.js';

export function render(container) {
  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Case Studies</h1>
        <p>Real outcomes from real SAP intelligence engagements.</p>
      </div>

      <div class="flex flex-col gap-8">
        ${caseStudies.map((cs, i) => `
          <div class="card" style="animation: slideUp 0.3s ease ${i * 0.1}s both;">
            <div class="flex items-center gap-3 mb-4">
              <h2 style="font-size: var(--text-xl);">${cs.title}</h2>
            </div>

            <div class="flex items-center gap-4 mb-6">
              <span class="badge">${cs.industry}</span>
              <span class="badge badge-blue">${cs.tier} Tier</span>
              <span class="text-sm text-muted">${cs.timeline} engagement</span>
            </div>

            <div class="grid grid-3 gap-6 mb-6">
              <div>
                <h4 class="text-sm text-muted mb-2" style="text-transform: uppercase; letter-spacing: 0.05em;">Challenge</h4>
                <p class="text-sm" style="line-height: 1.6;">${cs.challenge}</p>
              </div>
              <div style="grid-column: span 2;">
                <h4 class="text-sm text-muted mb-2" style="text-transform: uppercase; letter-spacing: 0.05em;">Solution</h4>
                <p class="text-sm" style="line-height: 1.6;">${cs.solution}</p>
              </div>
            </div>

            <div class="separator"></div>

            <div class="flex gap-8 flex-wrap">
              ${cs.outcomes.map(o => `
                <div>
                  <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--primary);">${o.metric}</div>
                  <div class="text-xs text-muted">${o.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <!-- CTA Card -->
        <div class="card text-center" style="margin-top: var(--space-8); padding: var(--space-10); background: linear-gradient(135deg, var(--primary)08, var(--accent)08);">
          <h3 class="mb-3">Your story could be next.</h3>
          <p class="text-secondary mb-6" style="max-width: 480px; margin: 0 auto; line-height: 1.6;">Start with a free AI-guided assessment to see what's possible.</p>
          <a href="#/public/self-assessment" class="btn btn-primary btn-lg">Start Assessment →</a>
        </div>
      </div>
    </div>
  `;
}
