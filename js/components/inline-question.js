/**
 * Inline question widget — click to ask, get canned AI response.
 */

const CANNED_ANSWERS = [
  "Based on our experience with 12 similar engagements, this approach typically delivers results within the first 4-6 weeks. The phased delivery model means you'll see value incrementally rather than waiting for a big-bang launch.",
  "Great question. The data stays within your infrastructure — we connect via RFC to your SAP instance and process data in a secure, isolated environment. We can walk through the security architecture in detail during implementation.",
  "The pricing is subscription-based, so you're paying for throughput capacity, not hours. This means if something takes less effort than expected, you benefit from the remaining capacity being applied to other backlog items.",
  "We've designed the platform with an abstraction layer specifically so that when you do migrate to S/4HANA, the transition is minimal — mainly updating the data connector, not rebuilding the analytics.",
  "The AI agents handle the heavy lifting — data processing, initial analysis, draft generation — but every deliverable goes through human review before reaching you. Think of it as AI doing the work, humans ensuring the quality."
];

let answerIndex = 0;

export function renderInlineQuestion({ sectionId } = {}) {
  const qId = `iq-${sectionId || Date.now()}`;

  return `
    <div class="inline-question" id="${qId}" style="margin-top:var(--space-2);">
      <button class="btn btn-ghost btn-sm iq-trigger" data-iq="${qId}" style="color:var(--primary); font-size:var(--text-xs);">
        ❓ Ask a question about this section
      </button>
      <div class="iq-form" id="${qId}-form" style="display:none; margin-top:var(--space-2);">
        <div class="flex gap-2">
          <input type="text" class="input" placeholder="Type your question..." id="${qId}-input" />
          <button class="btn btn-primary btn-sm iq-send" data-iq="${qId}">Ask</button>
        </div>
        <div class="iq-answer" id="${qId}-answer" style="display:none; margin-top:var(--space-3);"></div>
      </div>
    </div>
  `;
}

export function bindInlineQuestions(container) {
  container.addEventListener('click', (e) => {
    const trigger = e.target.closest('.iq-trigger');
    if (trigger) {
      const qId = trigger.dataset.iq;
      const form = document.getElementById(`${qId}-form`);
      if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        if (form.style.display === 'block') {
          form.querySelector('input')?.focus();
        }
      }
      return;
    }

    const sendBtn = e.target.closest('.iq-send');
    if (sendBtn) {
      const qId = sendBtn.dataset.iq;
      const input = document.getElementById(`${qId}-input`);
      const answerEl = document.getElementById(`${qId}-answer`);
      if (!input || !answerEl) return;

      const question = input.value.trim();
      if (!question) return;

      answerEl.style.display = 'block';
      answerEl.innerHTML = `
        <div class="callout" style="animation: slideUp 0.2s ease;">
          <div class="flex items-center gap-2 mb-2">
            <span class="badge badge-blue">AI Response</span>
          </div>
          <p class="animate-pulse text-muted text-sm">Thinking...</p>
        </div>
      `;

      setTimeout(() => {
        const answer = CANNED_ANSWERS[answerIndex % CANNED_ANSWERS.length];
        answerIndex++;
        answerEl.innerHTML = `
          <div class="callout" style="animation: slideUp 0.2s ease;">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-blue">AI Response</span>
            </div>
            <p class="text-sm" style="line-height:1.6;">${answer}</p>
            <div class="text-xs text-muted mt-2">For complex questions, our team will respond within 4 hours.</div>
          </div>
        `;
      }, 1000);
    }
  });

  // Enter key support
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.iq-form input')) {
      const form = e.target.closest('.iq-form');
      const sendBtn = form?.querySelector('.iq-send');
      if (sendBtn) sendBtn.click();
    }
  });
}
