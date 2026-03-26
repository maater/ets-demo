/**
 * Education Hub / Blog — article cards with tags.
 */

import { articles } from '../../data/mock-data.js';

export function render(container) {
  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>Education Hub</h1>
        <p>Insights on SAP intelligence, AI-native operations, and procurement strategy.</p>
      </div>

      <!-- Filter chips -->
      <div class="flex gap-2 flex-wrap mb-6">
        <button class="chip active-chip" style="background:var(--primary); color:white; border-color:var(--primary);">All</button>
        ${['SAP Strategy', 'AI Operations', 'Procurement', 'Risk Management', 'Buyer Guide'].map(t =>
          `<button class="chip topic-filter" data-topic="${t}">${t}</button>`
        ).join('')}
      </div>

      <!-- Top CTA Banner -->
      <div class="card mb-6" style="background: linear-gradient(135deg, var(--primary)08, var(--accent)08); text-align: center; padding: var(--space-6);">
        <p class="text-secondary mb-3" style="font-size: var(--text-base);">Got an SAP challenge? Our self-assessment matches your situation to proven solutions.</p>
        <a href="#/public/self-assessment" class="btn btn-primary">Take the Assessment →</a>
      </div>

      <!-- Articles grid -->
      <div class="grid grid-2 gap-6" id="articles-grid">
        ${articles.map(article => renderArticleCard(article)).join('')}
      </div>

      <!-- Bottom CTA Banner -->
      <div class="card mt-8" style="background: linear-gradient(135deg, var(--primary)08, var(--accent)08); text-align: center; padding: var(--space-8);">
        <h3 class="mb-2">Ready to move from reading to doing?</h3>
        <p class="text-secondary mb-4">Our AI-guided self-assessment takes 5 minutes and shows you what's possible.</p>
        <a href="#/public/self-assessment" class="btn btn-primary btn-lg">Start Your Free Assessment →</a>
      </div>

      <!-- Article detail modal -->
      <div id="article-detail" style="display:none;"></div>
    </div>
  `;

  // Bind filter clicks
  container.querySelectorAll('.topic-filter').forEach(chip => {
    chip.addEventListener('click', () => {
      // Reset active states
      container.querySelectorAll('.chip').forEach(c => {
        c.style.background = '';
        c.style.color = '';
        c.style.borderColor = '';
      });
      chip.style.background = 'var(--primary)';
      chip.style.color = 'white';
      chip.style.borderColor = 'var(--primary)';

      const topic = chip.dataset.topic;
      container.querySelectorAll('.article-card').forEach(card => {
        card.style.display = card.dataset.topic === topic ? '' : 'none';
      });
    });
  });

  container.querySelector('.active-chip').addEventListener('click', () => {
    container.querySelectorAll('.chip').forEach(c => {
      c.style.background = '';
      c.style.color = '';
      c.style.borderColor = '';
    });
    const allChip = container.querySelector('.active-chip');
    allChip.style.background = 'var(--primary)';
    allChip.style.color = 'white';
    allChip.style.borderColor = 'var(--primary)';
    container.querySelectorAll('.article-card').forEach(card => {
      card.style.display = '';
    });
  });

  // Bind article click for expand
  container.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.articleId;
      const article = articles.find(a => a.id === id);
      if (article) showArticleDetail(container, article);
    });
  });
}

function renderArticleCard(article) {
  return `
    <div class="card article-card cursor-pointer" data-article-id="${article.id}" data-topic="${article.topic}" style="animation: slideUp 0.3s ease;">
      <div class="flex items-center gap-2 mb-3">
        <span class="badge badge-blue">${article.topic}</span>
        <span class="badge">${article.persona}</span>
        <span class="badge">${article.complexity}</span>
      </div>
      <h3 class="mb-2" style="font-size: var(--text-lg);">${article.title}</h3>
      <p class="text-sm text-secondary mb-3" style="line-height: 1.6;">${article.excerpt}</p>
      <div class="flex items-center gap-3 text-xs text-muted">
        <span>${article.readTime} read</span>
        <span>•</span>
        <span>${article.date}</span>
      </div>
    </div>
  `;
}

function showArticleDetail(container, article) {
  const detail = container.querySelector('#article-detail');
  detail.style.display = 'block';
  detail.innerHTML = `
    <div class="modal-overlay" style="display:flex;" onclick="this.parentElement.style.display='none'">
      <div class="modal modal-lg" onclick="event.stopPropagation()" style="max-width:700px; max-height:80vh; overflow-y:auto; text-align:left;">
        <div class="flex items-center gap-2 mb-4">
          <span class="badge badge-blue">${article.topic}</span>
          <span class="badge">${article.persona}</span>
          <span class="text-xs text-muted">${article.readTime} read • ${article.date}</span>
        </div>
        <h2 class="mb-4">${article.title}</h2>
        <p class="text-secondary mb-4" style="line-height:1.7;">${article.excerpt}</p>
        <div class="separator"></div>
        <p style="line-height:1.8; color:var(--text-secondary);">
          ${generateArticleBody(article)}
        </p>
        <div class="separator"></div>
        <div class="flex justify-end">
          <button class="btn" onclick="this.closest('.modal-overlay').parentElement.style.display='none'">Close</button>
        </div>
      </div>
    </div>
  `;
}

function generateArticleBody(article) {
  // Generate realistic-looking article content based on the topic
  const bodies = {
    'blog-1': `Every manufacturer running SAP has years — sometimes decades — of transaction data sitting in their MM, PP, FI, and SD modules. This data tells a story about supplier reliability, procurement efficiency, demand patterns, and inventory health. But most companies only look backward: "What did we spend last quarter?"<br><br>The real value isn't in the rearview mirror. It's in the forward view: "Given our spending patterns, which suppliers should we consolidate?" or "Based on demand signals, when should we place this order to minimize cost?"<br><br>We've seen manufacturers save 25-40% on procurement costs simply by analyzing patterns that were already in their SAP data — patterns that nobody had the tools to find.`,
    'blog-2': `The traditional consultancy model is simple: bill hours, add headcount. A 40-person firm has 40 people writing reports, attending meetings, and doing analysis. An AI-native consultancy with 6 people has those same 6 people — plus a fleet of specialized AI agents that handle the heavy lifting.<br><br>The math is compelling: AI agents can process data, generate initial analyses, write documentation, and produce code artifacts at a fraction of the cost and time. The humans focus on what humans do best: relationship management, strategic thinking, quality assurance, and creative problem-solving.<br><br>The result? Better output, faster delivery, lower cost. Not because the AI is "smarter," but because the operating model eliminates waste.`,
    'blog-3': `Descriptive analytics answers "what happened." Diagnostic answers "why." Predictive answers "what will happen." But prescriptive analytics — the kind that tells you what to DO — is where the real value lives.<br><br>In procurement, this means going beyond dashboards. It means a system that says: "Supplier X has been declining in delivery reliability for 3 months. Based on your order volume and available alternatives, here are three options: renegotiate terms, add a backup supplier, or shift 30% of volume to Supplier Y."<br><br>That's not a report. That's a decision support system.`,
    'blog-4': `Traditional supplier scorecards measure what happened last quarter. But supplier risk is forward-looking: what COULD happen that would disrupt your operations?<br><br>Modern risk engines combine multiple signal types: delivery performance trends, financial health indicators (not just credit scores — actual financial stability signals), geographic risk (supply chain concentration, political instability), and market signals (commodity price volatility, news sentiment).<br><br>The key insight: risk is about combinations. A supplier with moderate financial risk in a politically stable region is different from the same financial risk in a region with trade policy uncertainty.`,
    'blog-5': `Not all AI consultancies are created equal. Some are traditional firms that added "AI" to their name. Others are genuinely AI-native — built from the ground up around human-AI collaboration.<br><br>Questions to ask: "Show me an AI agent that's working right now on a client project." "What percentage of deliverables are AI-generated vs. human-generated?" "How does human review work — can I see the approval system?"<br><br>The answers will tell you whether you're getting AI-native delivery or just AI-flavored marketing.`
  };

  return bodies[article.id] || article.excerpt + '<br><br>Full article content would appear here in a production version.';
}
