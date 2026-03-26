/**
 * Public Homepage — Hero, social proof, CTAs.
 */

import { renderMetricCard } from '../../components/metric-card.js';
import { caseStudies, articles } from '../../data/mock-data.js';

export function render(container) {
  container.innerHTML = `
    <div style="background: var(--bg);">
      <!-- Hero -->
      <section style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-16) var(--space-6); text-align: center;">
        <div class="animate-fade-in">
          <div class="badge badge-blue mb-4" style="font-size: var(--text-sm); padding: var(--space-2) var(--space-4);">AI-Native SAP Intelligence</div>
          <h1 style="font-size: 48px; max-width: 700px; margin: 0 auto var(--space-6);">SAP Intelligence That Tells You What To Do</h1>
          <p style="font-size: var(--text-lg); color: var(--text-secondary); max-width: 560px; margin: 0 auto var(--space-8); line-height: 1.6;">
            Stop drowning in SAP data. Get AI-powered insights that turn procurement patterns, supplier risks, and inventory data into clear, actionable decisions.
          </p>
          <div class="flex items-center justify-center gap-4">
            <a href="#/public/self-assessment" class="btn btn-primary btn-lg" style="font-size: var(--text-base);">See What We'd Build For You →</a>
            <a href="#/public/blog" class="btn btn-lg">Read Our Thinking</a>
          </div>
        </div>
      </section>

      <!-- Social Proof Metrics -->
      <section style="background: var(--bg-secondary); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
        <div style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-10) var(--space-6);">
          <div class="grid grid-3 gap-6">
            ${renderMetricCard({ label: 'Avg. Procurement Waste Reduction', value: '37%', icon: '📉', trend: 'up', trendLabel: 'across 8 engagements', color: 'var(--accent)' })}
            ${renderMetricCard({ label: 'Time Saved on Manual Reporting', value: '4 hrs/wk', icon: '⏱️', trend: 'up', trendLabel: 'per client average', color: 'var(--primary)' })}
            ${renderMetricCard({ label: 'Supplier Risk Events Predicted', value: '94%', icon: '🛡️', trend: 'up', trendLabel: 'accuracy rate', color: 'var(--warning)' })}
          </div>
        </div>
      </section>

      <!-- How It Works (brief) -->
      <section style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-16) var(--space-6);">
        <h2 class="text-center mb-3">How It Works</h2>
        <p class="text-center text-secondary mb-8" style="max-width: 500px; margin-left: auto; margin-right: auto;">From first conversation to continuous value — in weeks, not months.</p>

        <div class="grid grid-4 gap-6">
          ${[
            { step: '1', title: 'Tell Us What You Need', desc: 'Complete our AI-guided self-assessment. Get instant feasibility feedback and a preview of your solution.', icon: '💬' },
            { step: '2', title: 'We Scope & Propose', desc: 'AI-generated proposal with human oversight. Interactive, not a PDF — ask questions, flag concerns.', icon: '📋' },
            { step: '3', title: 'AI + Humans Build It', desc: 'AI agents do the heavy lifting. Human experts review every deliverable. You see progress in real time.', icon: '⚡' },
            { step: '4', title: 'Use It, Improve It', desc: 'Your tool goes live. Usage data drives continuous optimization. The system gets smarter with every sprint.', icon: '🔄' }
          ].map(s => `
            <div class="card text-center" style="animation: slideUp 0.3s ease ${parseInt(s.step) * 0.1}s both;">
              <div style="font-size: 32px; margin-bottom: var(--space-3);">${s.icon}</div>
              <div class="badge badge-blue mb-2">Step ${s.step}</div>
              <h4 class="mb-2">${s.title}</h4>
              <p class="text-sm text-secondary">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Mid-page CTA Banner -->
      <section style="background: linear-gradient(135deg, var(--primary)08, var(--accent)08); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
        <div style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-10) var(--space-6); text-align: center;">
          <p style="font-size: var(--text-lg); color: var(--text-secondary); margin-bottom: var(--space-4);">Not sure where to start? Our AI-guided assessment takes 5 minutes.</p>
          <a href="#/public/self-assessment" class="btn btn-primary btn-lg">Start Free Assessment →</a>
        </div>
      </section>

      <!-- Case Studies Preview -->
      <section style="background: var(--bg-secondary); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
        <div style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-16) var(--space-6);">
          <h2 class="text-center mb-3">Proven Results</h2>
          <p class="text-center text-secondary mb-8">Real outcomes from real engagements.</p>

          <div class="grid grid-3 gap-6">
            ${caseStudies.map(cs => `
              <a href="#/public/case-studies" class="card" style="text-decoration:none; color:inherit;">
                <h4 class="mb-2">${cs.company}</h4>
                <p class="text-sm text-secondary mb-4">${cs.challenge.slice(0, 100)}...</p>
                <div class="flex gap-3 flex-wrap">
                  ${cs.outcomes.slice(0, 2).map(o => `
                    <div>
                      <div style="font-size: var(--text-xl); font-weight: 700; color: var(--primary);">${o.metric}</div>
                      <div class="text-xs text-muted">${o.label}</div>
                    </div>
                  `).join('')}
                </div>
              </a>
            `).join('')}
          </div>

          <!-- CTA after case studies -->
          <div class="text-center" style="margin-top: var(--space-8);">
            <p class="text-secondary mb-4" style="font-size: var(--text-base);">Want results like these? Start with a free assessment.</p>
            <a href="#/public/self-assessment" class="btn btn-primary">Start Free Assessment →</a>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-16) var(--space-6); text-align: center;">
        <h2 class="mb-3">Ready to See What's Possible?</h2>
        <p class="text-secondary mb-6" style="max-width: 480px; margin-left: auto; margin-right: auto;">
          Our AI-guided self-assessment takes 5 minutes and gives you a preview of what we'd build — before talking to anyone.
        </p>
        <div class="flex items-center justify-center gap-4">
          <a href="#/public/self-assessment" class="btn btn-primary btn-lg">Start Your Free Assessment →</a>
          <button class="btn btn-lg" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Join Our Community →</button>
        </div>
      </section>

      <!-- Community / Newsletter -->
      <section style="background: var(--bg-secondary); border-top: 1px solid var(--border);">
        <div style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-12) var(--space-6); text-align: center;">
          <h3 class="mb-3">Stay in the Loop</h3>
          <p class="text-secondary mb-6" style="max-width: 560px; margin: 0 auto; line-height: 1.6;">
            Get insights on SAP intelligence, AI-native operations, and procurement strategy. Join 2,400+ operations leaders.
          </p>
          <div class="flex items-center justify-center gap-4">
            <button class="btn" onclick="document.getElementById('not-implemented-modal').style.display='flex'">📧 Subscribe to Newsletter</button>
            <button class="btn" onclick="document.getElementById('not-implemented-modal').style.display='flex'">💬 Join Slack Community</button>
          </div>
        </div>
      </section>
    </div>
  `;
}
