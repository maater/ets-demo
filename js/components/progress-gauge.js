/**
 * SVG progress gauge — circular or linear.
 */

export function renderCircularGauge({ value, max, label, size = 80, color = 'var(--primary)' } = {}) {
  const pct = Math.min(value / max, 1);
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  return `
    <div style="text-align: center;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--bg-tertiary)" stroke-width="6"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"
          style="transition: stroke-dashoffset 0.5s ease;"/>
      </svg>
      <div style="margin-top: -${size/2 + 10}px; position: relative; font-size: var(--text-lg); font-weight: 700;">
        ${value}<span class="text-muted" style="font-size: var(--text-xs); font-weight: 400;">/${max}</span>
      </div>
      ${label ? `<div class="text-xs text-muted" style="margin-top: ${size/2 - 8}px;">${label}</div>` : ''}
    </div>
  `;
}

export function renderProgressBar({ value, max, label, color, showPct = true } = {}) {
  const pct = Math.round((value / max) * 100);
  const barColor = color || (pct >= 75 ? 'var(--accent)' : pct >= 40 ? 'var(--primary)' : 'var(--warning)');

  return `
    <div>
      ${label ? `<div class="flex justify-between mb-1"><span class="text-sm">${label}</span>${showPct ? `<span class="text-sm text-muted">${pct}%</span>` : ''}</div>` : ''}
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
      </div>
    </div>
  `;
}
