/**
 * Review/Approve action bar.
 * Used in: PR review, proposal approval, deliverable approval.
 */

export function renderReviewBar({ id, reviewer, status } = {}) {
  const barId = id || `review-bar-${Date.now()}`;

  if (status === 'approved') {
    return `
      <div class="review-bar review-bar-approved" id="${barId}" style="display:flex; align-items:center; gap:var(--space-3); padding:var(--space-3) var(--space-4); background:var(--accent-bg); border-radius:var(--radius); border:1px solid var(--accent);">
        <span style="font-size:var(--text-lg);">✓</span>
        <div>
          <div style="font-weight:600; color:var(--accent);">Approved</div>
          ${reviewer ? `<div class="text-xs text-muted">by ${reviewer}</div>` : ''}
        </div>
      </div>
    `;
  }

  return `
    <div class="review-bar" id="${barId}" style="display:flex; align-items:center; gap:var(--space-2); padding:var(--space-3) var(--space-4); background:var(--bg-tertiary); border-radius:var(--radius); border:1px solid var(--border);">
      <button class="btn btn-accent btn-sm review-action" data-bar="${barId}" data-action="approve">✓ Approve</button>
      <button class="btn btn-sm review-action" data-bar="${barId}" data-action="approve-notes" style="border-color:var(--primary); color:var(--primary);">Approve with Notes</button>
      <button class="btn btn-sm review-action" data-bar="${barId}" data-action="changes" style="border-color:var(--warning); color:var(--warning);">Request Changes</button>
      <div class="review-bar-extra" id="${barId}-extra" style="display:none; flex:1;"></div>
    </div>
  `;
}

/**
 * Bind review bar actions within a container.
 */
export function bindReviewBars(container) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.review-action');
    if (!btn) return;

    const barId = btn.dataset.bar;
    const action = btn.dataset.action;
    const bar = document.getElementById(barId);
    const extra = document.getElementById(`${barId}-extra`);
    if (!bar) return;

    if (action === 'approve') {
      bar.style.background = 'var(--accent-bg)';
      bar.style.borderColor = 'var(--accent)';
      bar.innerHTML = `
        <span style="font-size:var(--text-lg);">✓</span>
        <div>
          <div style="font-weight:600; color:var(--accent);">Approved</div>
          <div class="text-xs text-muted">just now</div>
        </div>
      `;
    }

    if (action === 'approve-notes') {
      if (extra) {
        extra.style.display = 'flex';
        extra.innerHTML = `
          <input type="text" class="input" placeholder="Add notes..." style="flex:1;" />
          <button class="btn btn-sm btn-primary review-submit-notes" data-bar="${barId}">Submit</button>
        `;
        extra.querySelector('input').focus();

        extra.querySelector('.review-submit-notes').addEventListener('click', () => {
          const notes = extra.querySelector('input').value || 'No additional notes';
          bar.style.background = 'var(--primary-bg)';
          bar.style.borderColor = 'var(--primary)';
          bar.innerHTML = `
            <span style="font-size:var(--text-lg);">✓</span>
            <div>
              <div style="font-weight:600; color:var(--primary);">Approved with Notes</div>
              <div class="text-xs text-muted">"${notes}"</div>
            </div>
          `;
        });
      }
    }

    if (action === 'changes') {
      if (extra) {
        extra.style.display = 'flex';
        extra.innerHTML = `
          <input type="text" class="input" placeholder="Describe required changes..." style="flex:1;" />
          <button class="btn btn-sm btn-warning review-submit-changes" data-bar="${barId}">Submit</button>
        `;
        extra.querySelector('input').focus();

        extra.querySelector('.review-submit-changes').addEventListener('click', () => {
          const changes = extra.querySelector('input').value || 'Changes requested';
          bar.style.background = 'var(--warning-bg)';
          bar.style.borderColor = 'var(--warning)';
          bar.innerHTML = `
            <span style="font-size:var(--text-lg);">⟲</span>
            <div>
              <div style="font-weight:600; color:var(--warning);">Changes Requested</div>
              <div class="text-xs text-muted">"${changes}"</div>
            </div>
          `;
        });
      }
    }
  });
}
