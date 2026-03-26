/**
 * Editable AI-generated section.
 * Renders text with "AI-generated" badge and Edit/Regenerate/Accept actions.
 */

export function renderEditableSection({ id, title, content, onAccept, onEdit } = {}) {
  const sectionId = id || `editable-${Date.now()}`;

  return `
    <div class="editable-section" id="${sectionId}">
      <div class="editable-section-badge">
        <span>✦</span> AI-generated
      </div>
      ${title ? `<h4 style="margin-bottom: var(--space-2);">${title}</h4>` : ''}
      <div class="editable-section-content" id="${sectionId}-content">
        <p style="white-space: pre-wrap; line-height: 1.6;">${content}</p>
      </div>
      <div class="editable-section-actions">
        <button class="btn btn-sm btn-ghost" data-action="edit" data-target="${sectionId}">✏️ Edit</button>
        <button class="btn btn-sm btn-ghost" data-action="regenerate" data-target="${sectionId}">🔄 Regenerate</button>
        <button class="btn btn-sm btn-accent" data-action="accept" data-target="${sectionId}">✓ Accept</button>
      </div>
    </div>
  `;
}

/**
 * Bind editable section actions within a container element.
 */
export function bindEditableSections(container) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const targetId = btn.dataset.target;
    const section = document.getElementById(targetId);
    if (!section) return;

    const contentEl = section.querySelector('.editable-section-content');

    if (action === 'edit') {
      if (section.classList.contains('editing')) {
        // Save edit
        const textarea = section.querySelector('textarea');
        if (textarea) {
          contentEl.innerHTML = `<p style="white-space: pre-wrap; line-height: 1.6;">${textarea.value}</p>`;
        }
        section.classList.remove('editing');
        btn.textContent = '✏️ Edit';
      } else {
        // Enter edit mode
        const currentText = contentEl.textContent.trim();
        contentEl.innerHTML = `<textarea class="textarea" style="min-height: 120px;">${currentText}</textarea>`;
        section.classList.add('editing');
        btn.textContent = '💾 Save';
        contentEl.querySelector('textarea').focus();
      }
    }

    if (action === 'regenerate') {
      const currentText = contentEl.textContent.trim();
      contentEl.innerHTML = '<p class="animate-pulse text-muted">Regenerating...</p>';

      setTimeout(() => {
        // Slightly modify the text to simulate regeneration
        const variants = [
          currentText + '\n\nAdditional insight: Based on patterns from similar engagements, this approach has shown 85% success rates.',
          currentText.replace(/\./g, '. ').replace(/  /g, '. ') + ' This aligns with industry best practices for mid-market implementations.',
        ];
        const newText = variants[Math.floor(Math.random() * variants.length)] || currentText;
        contentEl.innerHTML = `<p style="white-space: pre-wrap; line-height: 1.6;">${newText}</p>`;
      }, 1000);
    }

    if (action === 'accept') {
      section.style.borderColor = 'var(--accent)';
      section.querySelector('.editable-section-badge').innerHTML = '<span>✓</span> Accepted';
      section.querySelector('.editable-section-badge').style.color = 'var(--accent)';
      section.querySelector('.editable-section-actions').innerHTML = `
        <span class="text-xs text-muted">Accepted — content locked</span>
      `;
    }
  });
}
