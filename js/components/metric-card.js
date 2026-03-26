/**
 * Metric card — displays a number with label and optional trend.
 */

export function renderMetricCard({ label, value, trend, trendLabel, color, icon } = {}) {
  const trendColor = trend === 'up' ? 'var(--accent)' : trend === 'down' ? 'var(--danger)' : 'var(--text-muted)';
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';

  return `
    <div class="card card-compact">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 0.05em;">${label}</span>
        ${icon ? `<span style="font-size: var(--text-lg);">${icon}</span>` : ''}
      </div>
      <div style="font-size: var(--text-2xl); font-weight: 700; color: ${color || 'var(--text)'};">${value}</div>
      ${trendLabel ? `
        <div class="flex items-center gap-1 mt-1" style="font-size: var(--text-xs); color: ${trendColor};">
          <span>${trendArrow}</span>
          <span>${trendLabel}</span>
        </div>
      ` : ''}
    </div>
  `;
}
