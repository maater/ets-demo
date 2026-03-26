/**
 * How We Work — engagement process, pricing, about.
 */

import { showNotImplemented } from '../../components/not-implemented.js';

export function render(container) {
  container.innerHTML = `
    <div style="background: var(--bg);">
      <!-- Process Section -->
      <section style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-16) var(--space-6);">
        <div class="text-center mb-8">
          <h1 class="mb-3">How We Work</h1>
          <p class="text-secondary" style="max-width: 560px; margin: 0 auto; font-size: var(--text-lg);">
            A transparent, loop-based engagement model. You always know what's happening, what's next, and what you're paying for.
          </p>
        </div>

        <!-- Process Steps -->
        <div class="flex gap-4 items-start mb-16" style="overflow-x: auto;">
          ${[
            { step: 1, title: 'Discovery', desc: 'AI-guided self-assessment, then a focused discovery call. We learn your setup, your pain points, and your goals.', duration: 'Days 1-3', icon: '🔍', color: 'var(--primary)' },
            { step: 2, title: 'Proposal', desc: 'AI drafts, humans refine. You get an interactive proposal — ask questions inline, flag concerns, suggest changes.', duration: 'Days 4-5', icon: '📋', color: 'var(--primary-light)' },
            { step: 3, title: 'Build', desc: 'AI agents + human experts work in sprints. You see progress in real time. Everything goes through human review.', duration: 'Weeks 1-12', icon: '⚡', color: 'var(--accent)' },
            { step: 4, title: 'Deliver', desc: 'Working features deployed each sprint. You approve deliverables, provide feedback, prioritize the backlog.', duration: 'Every 2 weeks', icon: '📦', color: 'var(--accent-light)' },
            { step: 5, title: 'Optimize', desc: 'Usage data drives continuous improvement. AI identifies what users need next. The system gets smarter every sprint.', duration: 'Ongoing', icon: '🔄', color: 'var(--warning)' }
          ].map((s, i) => `
            <div style="flex: 0 0 200px; text-align: center; animation: slideUp 0.3s ease ${i * 0.08}s both;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: ${s.color}15; color: ${s.color}; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto var(--space-3);">${s.icon}</div>
              <div class="text-xs text-muted mb-1">${s.duration}</div>
              <h4 class="mb-2">${s.title}</h4>
              <p class="text-xs text-secondary" style="line-height: 1.5;">${s.desc}</p>
              ${i < 4 ? '<div style="color: var(--text-muted); margin-top: var(--space-2);">→</div>' : ''}
            </div>
          `).join('')}
        </div>

        <!-- Key Principles -->
        <div class="grid grid-3 gap-6 mb-16">
          ${[
            { title: 'Human Review on Everything', desc: 'AI agents do the heavy lifting, but every deliverable goes through human expert review before reaching you. No autopilot.', icon: '👁️' },
            { title: 'You Own the Priorities', desc: 'You control the backlog. Drag-and-drop prioritization with AI trade-off analysis. Your business logic drives the build order.', icon: '🎯' },
            { title: 'Transparent Progress', desc: 'See what every agent and human is working on, in real time. No status meetings needed — the dashboard IS the status.', icon: '📊' }
          ].map(p => `
            <div class="card">
              <div style="font-size: 28px; margin-bottom: var(--space-3);">${p.icon}</div>
              <h4 class="mb-2">${p.title}</h4>
              <p class="text-sm text-secondary" style="line-height: 1.6;">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Pricing -->
      <section style="background: var(--bg-secondary); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
        <div style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-16) var(--space-6);">
          <div class="text-center mb-8">
            <h2 class="mb-3">Transparent Pricing</h2>
            <p class="text-secondary">Subscription model. You pay for speed, not hours.</p>
          </div>

          <div class="grid grid-3 gap-6">
            ${[
              {
                tier: 'Starter',
                price: '$9,500',
                concurrency: 2,
                features: ['2 concurrent workstreams', 'Shared delivery lead', 'Bi-weekly progress reviews', 'Core AI agent fleet', 'Human review on all deliverables'],
                cta: 'Get Started',
                highlighted: false
              },
              {
                tier: 'Professional',
                price: '$18,500',
                concurrency: 5,
                features: ['5 concurrent workstreams', 'Dedicated delivery lead', 'Weekly progress reviews', 'Full AI agent fleet', 'Human review on all deliverables', 'Priority support', 'Knowledge base access'],
                cta: 'Most Popular',
                highlighted: true
              },
              {
                tier: 'Enterprise',
                price: '$32,000',
                concurrency: 10,
                features: ['10 concurrent workstreams', 'Dedicated team', 'Daily standups available', 'Custom AI agents', 'Human review on all deliverables', 'Executive sponsor access', 'Custom SLAs'],
                cta: 'Contact Us',
                highlighted: false
              }
            ].map(t => `
              <div class="card ${t.highlighted ? '' : ''}" style="${t.highlighted ? 'border-color: var(--primary); box-shadow: var(--shadow-md); position: relative;' : ''}">
                ${t.highlighted ? '<div class="badge badge-blue" style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%);">Most Popular</div>' : ''}
                <div class="text-center mb-6">
                  <h3 class="mb-1">${t.tier}</h3>
                  <div style="font-size: var(--text-3xl); font-weight: 800; color: var(--primary);">${t.price}</div>
                  <div class="text-sm text-muted">per month</div>
                  <div class="text-xs text-muted mt-1">${t.concurrency} concurrent workstreams</div>
                </div>
                <ul style="list-style: none; margin-bottom: var(--space-6);">
                  ${t.features.map(f => `
                    <li class="flex items-start gap-2 mb-2" style="font-size: var(--text-sm);">
                      <span style="color: var(--accent); flex-shrink: 0;">✓</span>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>
                <button class="btn ${t.highlighted ? 'btn-primary' : ''} w-full" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
                  ${t.cta}
                </button>
              </div>
            `).join('')}
          </div>

          <p class="text-center text-sm text-muted mt-6">
            All tiers include: AI agent fleet, human review on every deliverable, real-time project dashboard, and customer portal access.
          </p>
        </div>
      </section>

      <!-- Post-Pricing CTA -->
      <section style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-12) var(--space-6); text-align: center;">
        <h3 class="mb-3">Step 1 is free.</h3>
        <p class="text-secondary mb-6" style="max-width: 500px; margin: 0 auto; line-height: 1.6;">Take our AI-guided self-assessment and get instant feasibility feedback.</p>
        <a href="#/public/self-assessment" class="btn btn-primary btn-lg">Start Your Free Assessment →</a>
      </section>

      <!-- About Axon -->
      <section style="max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-16) var(--space-6);">
        <div class="grid grid-2 gap-8 items-center">
          <div>
            <div class="badge badge-blue mb-3">About Axon Labs</div>
            <h2 class="mb-4">Born From the Future of Work</h2>
            <p class="text-secondary mb-4" style="line-height: 1.7;">
              Axon Labs is a Vixul portfolio company that went through the AI-first transformation framework. We started as a traditional 15-person SAP consultancy. Today we're 6 humans and a fleet of specialized AI agents — delivering better outcomes, faster, at better economics.
            </p>
            <p class="text-secondary mb-4" style="line-height: 1.7;">
              Our platform IS our operating system. The tools we use to manage engagements, deliver work, and grow our knowledge base are the same tools we build for our clients. True dogfooding.
            </p>
            <div class="flex gap-6 mt-6">
              <div>
                <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--primary);">6</div>
                <div class="text-xs text-muted">Humans</div>
              </div>
              <div>
                <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--primary);">10</div>
                <div class="text-xs text-muted">AI Agents</div>
              </div>
              <div>
                <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--primary);">8</div>
                <div class="text-xs text-muted">Active Clients</div>
              </div>
              <div>
                <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--primary);">2024</div>
                <div class="text-xs text-muted">Founded</div>
              </div>
            </div>
          </div>
          <div class="card" style="background: var(--bg-secondary); border: none; padding: var(--space-8); text-align: center;">
            <div style="font-size: 64px; margin-bottom: var(--space-4);">🧠</div>
            <h3 class="mb-2">Part of the Vixul Network</h3>
            <p class="text-sm text-secondary" style="line-height: 1.6;">
              Vixul teaches the transformation framework. Axon Labs lives it. Every engagement we run makes the system smarter — and that intelligence flows back to the entire portfolio.
            </p>
            <div style="margin-top: var(--space-6);">
              <button class="btn" onclick="document.getElementById('not-implemented-modal').style.display='flex'">Join Our Community →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
