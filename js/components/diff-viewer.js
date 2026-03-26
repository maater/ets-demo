/**
 * Side-by-side diff viewer for PR review system.
 */

export function renderDiffViewer({ title, beforeLines, afterLines, language = 'code' } = {}) {
  return `
    <div class="card card-flat" style="overflow:hidden;">
      ${title ? `<div class="flex items-center justify-between p-3 border-bottom"><span class="text-sm" style="font-weight:600;">${title}</span><span class="badge">${language}</span></div>` : ''}
      <div style="display:grid; grid-template-columns:1fr 1fr; font-family:var(--font-mono); font-size:12px; line-height:1.6;">
        <div style="border-right:1px solid var(--border);">
          <div class="px-4 py-2 text-xs text-muted border-bottom" style="background:var(--danger-bg);">Previous Version</div>
          <div style="padding:var(--space-2) 0;">
            ${beforeLines.map((line, i) => renderDiffLine(line, i + 1, 'before')).join('')}
          </div>
        </div>
        <div>
          <div class="px-4 py-2 text-xs text-muted border-bottom" style="background:var(--accent-bg);">Updated Version</div>
          <div style="padding:var(--space-2) 0;">
            ${afterLines.map((line, i) => renderDiffLine(line, i + 1, 'after')).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDiffLine(line, num, side) {
  let bg = 'transparent';
  let prefix = ' ';

  if (line.type === 'added') {
    bg = side === 'after' ? 'rgba(5, 150, 105, 0.08)' : 'transparent';
    prefix = side === 'after' ? '+' : ' ';
  } else if (line.type === 'removed') {
    bg = side === 'before' ? 'rgba(220, 38, 38, 0.08)' : 'transparent';
    prefix = side === 'before' ? '-' : ' ';
  }

  const text = line.text || '';

  return `
    <div class="diff-line flex" style="background:${bg}; padding:0 var(--space-3); min-height:22px; cursor:pointer;" title="Click to add comment">
      <span style="width:36px; text-align:right; color:var(--text-muted); padding-right:var(--space-2); flex-shrink:0; user-select:none;">${num}</span>
      <span style="width:12px; color:var(--text-muted); flex-shrink:0;">${prefix}</span>
      <span style="white-space:pre-wrap;">${escapeHtml(text)}</span>
    </div>
  `;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Generate mock diff data for the demo.
 */
export function getMockDiff(type = 'code') {
  if (type === 'code') {
    return {
      title: 'supplier_risk_scoring.py',
      language: 'Python',
      beforeLines: [
        { text: 'def calculate_risk_score(supplier):', type: 'unchanged' },
        { text: '    """Calculate composite risk score."""', type: 'unchanged' },
        { text: '    delivery_score = get_delivery_reliability(supplier)', type: 'unchanged' },
        { text: '    financial_score = get_financial_health(supplier)', type: 'unchanged' },
        { text: '    score = (delivery_score + financial_score) / 2', type: 'removed' },
        { text: '    return round(score, 2)', type: 'removed' },
        { text: '', type: 'unchanged' },
      ],
      afterLines: [
        { text: 'def calculate_risk_score(supplier):', type: 'unchanged' },
        { text: '    """Calculate composite risk score with 6-factor model."""', type: 'unchanged' },
        { text: '    delivery_score = get_delivery_reliability(supplier)', type: 'unchanged' },
        { text: '    financial_score = get_financial_health(supplier)', type: 'unchanged' },
        { text: '    geo_risk = get_geographic_risk(supplier)', type: 'added' },
        { text: '    concentration = get_concentration_risk(supplier)', type: 'added' },
        { text: '    quality = get_quality_metrics(supplier)', type: 'added' },
        { text: '    price_stability = get_price_stability(supplier)', type: 'added' },
        { text: '    weights = [0.25, 0.20, 0.15, 0.15, 0.15, 0.10]', type: 'added' },
        { text: '    factors = [delivery_score, financial_score, geo_risk,', type: 'added' },
        { text: '              concentration, quality, price_stability]', type: 'added' },
        { text: '    score = sum(w * f for w, f in zip(weights, factors))', type: 'added' },
        { text: '    return round(score, 2)', type: 'unchanged' },
        { text: '', type: 'unchanged' },
      ]
    };
  }

  // Document diff
  return {
    title: 'Executive Summary — Risk Assessment',
    language: 'Document',
    beforeLines: [
      { text: 'Meridian Partners faces moderate supplier risk', type: 'removed' },
      { text: 'across their procurement portfolio. Two key', type: 'removed' },
      { text: 'suppliers show declining delivery performance.', type: 'removed' },
      { text: '', type: 'unchanged' },
      { text: 'Recommendation: Monitor quarterly.', type: 'removed' },
    ],
    afterLines: [
      { text: 'Meridian Partners faces elevated supplier risk', type: 'added' },
      { text: 'concentrated in raw materials (3 single-source', type: 'added' },
      { text: 'suppliers) and logistics (port congestion impact).', type: 'added' },
      { text: '', type: 'unchanged' },
      { text: 'Recommendation: Immediate diversification of', type: 'added' },
      { text: 'steel suppliers. Initiate backup logistics', type: 'added' },
      { text: 'partner evaluation within 30 days.', type: 'added' },
    ]
  };
}
