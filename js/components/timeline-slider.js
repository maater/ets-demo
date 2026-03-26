import { TIMELINE_POINTS, getState, switchTimePoint } from '../store.js';

export function renderTimeline(container) {
  const state = getState();
  const currentTP = TIMELINE_POINTS.find(tp => tp.id === state.currentTimePoint);

  container.innerHTML = `
    <span class="timeline-label">Timeline</span>
    <div class="timeline-track">
      <div class="timeline-line"></div>
      <!-- Active progress line -->
      <div class="timeline-line-active" id="timeline-progress"></div>
      <div class="timeline-points">
        ${TIMELINE_POINTS.map((tp, i) => `
          <button class="timeline-point ${state.currentTimePoint === tp.id ? 'active' : ''} ${isPast(tp.id, state.currentTimePoint) ? 'past' : ''}"
                  data-timepoint="${tp.id}"
                  data-index="${i}"
                  title="${tp.description}">
            <div class="timeline-dot"></div>
            <span class="timeline-point-label">${tp.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
    <span class="timeline-description" id="timeline-desc">${currentTP?.description || ''}</span>
  `;

  updateProgressLine(container, state.currentTimePoint);

  // Bind timeline point clicks
  container.querySelectorAll('.timeline-point').forEach(point => {
    point.addEventListener('click', () => {
      const tp = point.dataset.timepoint;
      switchTimePoint(tp);

      // Update description text
      const desc = TIMELINE_POINTS.find(t => t.id === tp);
      const descEl = container.querySelector('#timeline-desc');
      if (descEl && desc) {
        descEl.textContent = desc.description;
        descEl.style.transition = 'opacity 0.2s ease';
        descEl.style.opacity = '0';
        setTimeout(() => {
          descEl.textContent = desc.description;
          descEl.style.opacity = '1';
        }, 100);
      }

      // Update past states
      container.querySelectorAll('.timeline-point').forEach(p => {
        p.classList.toggle('past', isPast(p.dataset.timepoint, tp));
      });

      // Update progress line
      updateProgressLine(container, tp);
    });
  });
}

function isPast(pointId, currentId) {
  const order = TIMELINE_POINTS.map(tp => tp.id);
  return order.indexOf(pointId) < order.indexOf(currentId);
}

function updateProgressLine(container, currentId) {
  const progressLine = container.querySelector('#timeline-progress');
  if (!progressLine) return;
  const idx = TIMELINE_POINTS.findIndex(tp => tp.id === currentId);
  const pct = TIMELINE_POINTS.length > 1 ? (idx / (TIMELINE_POINTS.length - 1)) * 100 : 0;
  progressLine.style.width = `${pct}%`;
}
