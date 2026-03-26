import { TIMELINE_POINTS, getState, switchTimePoint } from '../store.js';

export function renderTimeline(container) {
  const state = getState();

  container.innerHTML = `
    <span class="timeline-label">Timeline</span>
    <div class="timeline-track">
      <div class="timeline-line"></div>
      <div class="timeline-points">
        ${TIMELINE_POINTS.map(tp => `
          <button class="timeline-point ${state.currentTimePoint === tp.id ? 'active' : ''}"
                  data-timepoint="${tp.id}"
                  title="${tp.description}">
            <div class="timeline-dot"></div>
            <span class="timeline-point-label">${tp.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Bind timeline point clicks
  container.querySelectorAll('.timeline-point').forEach(point => {
    point.addEventListener('click', () => {
      switchTimePoint(point.dataset.timepoint);
    });
  });
}
