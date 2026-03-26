/**
 * Simple SVG chart helpers — bar chart, line chart, burn-up.
 */

/**
 * Render a simple bar chart.
 */
export function renderBarChart({ data, width = 400, height = 200, color = 'var(--primary)', label } = {}) {
  if (!data || data.length === 0) return '';

  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = Math.floor((width - 40) / data.length) - 4;
  const chartHeight = height - 40;

  const bars = data.map((d, i) => {
    const barHeight = maxVal > 0 ? (d.value / maxVal) * chartHeight : 0;
    const x = 30 + i * (barWidth + 4);
    const y = chartHeight - barHeight + 10;

    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="${d.color || color}" opacity="0.8">
        <title>${d.label}: ${d.value}</title>
      </rect>
      <text x="${x + barWidth/2}" y="${height - 4}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${d.label}</text>
    `;
  }).join('');

  return `
    <div>
      ${label ? `<div class="text-sm font-semibold mb-2">${label}</div>` : ''}
      <svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        ${bars}
      </svg>
    </div>
  `;
}

/**
 * Render a simple line chart.
 */
export function renderLineChart({ data, width = 400, height = 200, color = 'var(--primary)', label, showDots = true, fill = false } = {}) {
  if (!data || data.length < 2) return '';

  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;
  const chartWidth = width - 50;
  const chartHeight = height - 40;

  const points = data.map((d, i) => {
    const x = 35 + (i / (data.length - 1)) * chartWidth;
    const y = 10 + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const fillPath = fill ? `${pathD} L ${points[points.length-1].x} ${chartHeight + 10} L ${points[0].x} ${chartHeight + 10} Z` : '';

  const labels = data.filter((_, i) => i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 5) === 0);

  return `
    <div>
      ${label ? `<div class="text-sm" style="font-weight:600; margin-bottom:var(--space-2);">${label}</div>` : ''}
      <svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines -->
        ${[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = 10 + chartHeight - pct * chartHeight;
          const val = Math.round(minVal + pct * range);
          return `
            <line x1="35" y1="${y}" x2="${width - 10}" y2="${y}" stroke="var(--border-light)" stroke-width="1"/>
            <text x="30" y="${y + 3}" text-anchor="end" font-size="9" fill="var(--text-muted)">${val}</text>
          `;
        }).join('')}

        <!-- Fill area -->
        ${fill ? `<path d="${fillPath}" fill="${color}" opacity="0.1"/>` : ''}

        <!-- Line -->
        <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Dots -->
        ${showDots ? points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}">
            <title>${p.label}: ${p.value}</title>
          </circle>
        `).join('') : ''}

        <!-- X-axis labels -->
        ${points.filter((_, i) => i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 5) === 0).map(p => `
          <text x="${p.x}" y="${height - 4}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${p.label}</text>
        `).join('')}
      </svg>
    </div>
  `;
}

/**
 * Render a burn-up chart for sprint progress.
 */
export function renderBurnUp({ total, completed, sprintDays = 10, width = 400, height = 200 } = {}) {
  const idealData = Array.from({ length: sprintDays + 1 }, (_, i) => ({
    label: `D${i}`,
    value: Math.round((i / sprintDays) * total)
  }));

  const actualDays = Math.min(Math.ceil(sprintDays * 0.7), sprintDays);
  const actualData = Array.from({ length: actualDays + 1 }, (_, i) => ({
    label: `D${i}`,
    value: Math.round((i / sprintDays) * completed * (1 + Math.random() * 0.3 - 0.15))
  }));
  // Ensure last point matches completed
  if (actualData.length > 0) actualData[actualData.length - 1].value = completed;

  const maxVal = total;
  const chartWidth = width - 50;
  const chartHeight = height - 40;

  function toPoints(data) {
    return data.map((d, i) => {
      const x = 35 + (i / sprintDays) * chartWidth;
      const y = 10 + chartHeight - (d.value / maxVal) * chartHeight;
      return { x, y };
    });
  }

  const idealPoints = toPoints(idealData);
  const actualPoints = toPoints(actualData);

  const idealPath = idealPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const actualPath = actualPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return `
    <div>
      <div class="flex items-center gap-4 mb-2">
        <span class="text-sm" style="font-weight:600;">Sprint Burn-up</span>
        <span class="flex items-center gap-1 text-xs text-muted"><span style="width:12px;height:2px;background:var(--text-muted);display:inline-block;"></span> Ideal</span>
        <span class="flex items-center gap-1 text-xs" style="color:var(--primary);"><span style="width:12px;height:2px;background:var(--primary);display:inline-block;"></span> Actual</span>
      </div>
      <svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <!-- Total line -->
        <line x1="35" y1="10" x2="${width - 10}" y2="10" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="30" y="14" text-anchor="end" font-size="9" fill="var(--text-muted)">${total}</text>

        <!-- Ideal line -->
        <path d="${idealPath}" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4,4"/>

        <!-- Actual line -->
        <path d="${actualPath}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Current point -->
        ${actualPoints.length > 0 ? `<circle cx="${actualPoints[actualPoints.length-1].x}" cy="${actualPoints[actualPoints.length-1].y}" r="4" fill="var(--primary)"/>` : ''}

        <!-- X-axis -->
        <line x1="35" y1="${chartHeight + 10}" x2="${width - 10}" y2="${chartHeight + 10}" stroke="var(--border)" stroke-width="1"/>
      </svg>
    </div>
  `;
}
