/**
 * Knowledge Base — searchable repository of past engagement learnings.
 */

export function render(container) {
  const entries = [
    { id: 'kb-1', title: 'SAP MM Data Extraction Best Practices', type: 'Playbook', tags: ['SAP', 'MM', 'Data'], source: 'Apex Manufacturing engagement', lastUpdated: 'Mar 15, 2026', usageCount: 23 },
    { id: 'kb-2', title: 'Supplier Risk Scoring — 6-Factor Model', type: 'Algorithm', tags: ['Risk', 'Scoring', 'Supplier'], source: 'Meridian Partners engagement', lastUpdated: 'Mar 22, 2026', usageCount: 8 },
    { id: 'kb-3', title: 'Procurement Anomaly Detection Patterns', type: 'Research', tags: ['Procurement', 'ML', 'Anomaly'], source: 'Atlas research output', lastUpdated: 'Mar 20, 2026', usageCount: 15 },
    { id: 'kb-4', title: 'SAP RFC Connection Configuration Guide', type: 'Technical', tags: ['SAP', 'RFC', 'Integration'], source: 'Internal documentation', lastUpdated: 'Feb 28, 2026', usageCount: 31 },
    { id: 'kb-5', title: 'Inventory Reorder Point Optimization', type: 'Algorithm', tags: ['Inventory', 'ML', 'Optimization'], source: 'Sterling Corp engagement', lastUpdated: 'Mar 10, 2026', usageCount: 12 },
    { id: 'kb-6', title: 'Customer Discovery Call Framework', type: 'Playbook', tags: ['Sales', 'Discovery', 'Process'], source: 'Internal process', lastUpdated: 'Jan 15, 2026', usageCount: 45 },
    { id: 'kb-7', title: 'Data Quality Assessment Checklist', type: 'Checklist', tags: ['Data', 'Quality', 'Process'], source: 'Cross-engagement pattern', lastUpdated: 'Mar 1, 2026', usageCount: 28 },
    { id: 'kb-8', title: 'Executive Dashboard KPI Definitions', type: 'Reference', tags: ['Dashboard', 'KPI', 'Executive'], source: 'Standard template', lastUpdated: 'Feb 20, 2026', usageCount: 19 }
  ];

  const typeColors = {
    'Playbook': 'var(--primary)',
    'Algorithm': 'var(--accent)',
    'Research': 'var(--warning)',
    'Technical': 'var(--text-muted)',
    'Checklist': 'var(--primary-light)',
    'Reference': 'var(--accent-light)'
  };

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Knowledge Base</h1>
            <p>${entries.length} entries from ${new Set(entries.map(e => e.source)).size} sources. Agents and humans contribute and consume.</p>
          </div>
          <button class="btn btn-sm" onclick="document.getElementById('not-implemented-modal').style.display='flex'">+ Add Entry</button>
        </div>
      </div>

      <!-- Search -->
      <div class="flex gap-3 mb-6">
        <input type="text" class="input" id="kb-search" placeholder="Search knowledge base..." style="flex:1;" />
        <select class="input" id="kb-type-filter" style="width:160px;">
          <option value="">All Types</option>
          ${[...new Set(entries.map(e => e.type))].map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
      </div>

      <!-- Entries -->
      <div class="flex flex-col gap-3" id="kb-entries">
        ${entries.map(entry => `
          <div class="card card-compact cursor-pointer kb-entry" data-type="${entry.type}" data-title="${entry.title.toLowerCase()}" onclick="document.getElementById('not-implemented-modal').style.display='flex'">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3" style="flex:1;">
                <div style="width:4px; height:40px; border-radius:2px; background:${typeColors[entry.type] || 'var(--border)'}; flex-shrink:0;"></div>
                <div>
                  <div class="flex items-center gap-2">
                    <span style="font-weight:500;">${entry.title}</span>
                    <span class="badge" style="color:${typeColors[entry.type]}; border-color:${typeColors[entry.type]};">${entry.type}</span>
                  </div>
                  <div class="flex items-center gap-3 mt-1 text-xs text-muted">
                    <span>${entry.source}</span>
                    <span>•</span>
                    <span>Updated ${entry.lastUpdated}</span>
                    <span>•</span>
                    <span>Used ${entry.usageCount} times</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-1">
                ${entry.tags.map(t => `<span class="chip" style="font-size:10px;">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Stats -->
      <div class="grid grid-3 gap-4 mt-8">
        <div class="card card-compact text-center">
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--primary);">${entries.reduce((s, e) => s + e.usageCount, 0)}</div>
          <div class="text-xs text-muted">Total Usage (this quarter)</div>
        </div>
        <div class="card card-compact text-center">
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--accent);">73%</div>
          <div class="text-xs text-muted">Agent-Contributed Entries</div>
        </div>
        <div class="card card-compact text-center">
          <div style="font-size:var(--text-2xl); font-weight:700;">4.2</div>
          <div class="text-xs text-muted">Avg Uses per Entry per Week</div>
        </div>
      </div>
    </div>
  `;

  // Bind search
  const searchInput = container.querySelector('#kb-search');
  const typeFilter = container.querySelector('#kb-type-filter');

  function filterEntries() {
    const query = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    container.querySelectorAll('.kb-entry').forEach(el => {
      const matchesSearch = !query || el.dataset.title.includes(query);
      const matchesType = !type || el.dataset.type === type;
      el.style.display = (matchesSearch && matchesType) ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', filterEntries);
  typeFilter.addEventListener('change', filterEntries);
}
