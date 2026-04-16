/**
 * Self-Assessment Tool — SAP-domain-specific conversational intake.
 *
 * The AI asks questions in chat bubbles, but the user answers via structured
 * widgets (module chips, pain-point grid, named SAP reports, etc.) rather
 * than free text. The flow branches after the pain-point step based on the
 * dominant category (procurement / supplier-risk / inventory), and every
 * question uses vocabulary a real SAP consultant would use.
 */

import { selfAssessment } from '../../data/mock-data.js';

// ──────────────────────────────────────
// Domain vocabulary — the SAP-native picks
// ──────────────────────────────────────

const DEPLOYMENTS = [
  { id: 'ecc',         label: 'SAP ECC 6.0',           sub: 'Classic, on-prem' },
  { id: 's4-onprem',   label: 'S/4HANA — On-Prem',     sub: 'Private cloud or on-prem' },
  { id: 's4-cloud',    label: 'S/4HANA Cloud',         sub: 'Public edition' },
  { id: 'rise',        label: 'RISE with SAP',         sub: 'Managed S/4HANA' },
  { id: 'hybrid',      label: 'Hybrid / mid-migration', sub: 'Partway to S/4' }
];

const MODULES = [
  { id: 'mm',    label: 'MM',    sub: 'Materials Mgmt' },
  { id: 'pp',    label: 'PP',    sub: 'Production Planning' },
  { id: 'sd',    label: 'SD',    sub: 'Sales & Distribution' },
  { id: 'fi',    label: 'FI',    sub: 'Financial Accounting' },
  { id: 'co',    label: 'CO',    sub: 'Controlling' },
  { id: 'wm',    label: 'WM / EWM', sub: 'Warehouse' },
  { id: 'pm',    label: 'PM',    sub: 'Plant Maintenance' },
  { id: 'qm',    label: 'QM',    sub: 'Quality Mgmt' },
  { id: 'ps',    label: 'PS',    sub: 'Project System' },
  { id: 'ariba', label: 'Ariba', sub: 'Sourcing / Contracts' },
  { id: 'ibp',   label: 'IBP',   sub: 'Integrated Planning' },
  { id: 'sf',    label: 'SuccessFactors', sub: 'HCM' }
];

const CUSTOMIZATION_LEVELS = [
  { id: 'vanilla',  label: 'Mostly vanilla',      sub: 'Few Z-tables, standard config' },
  { id: 'moderate', label: 'Moderately customized', sub: 'Some Z-tables, user exits' },
  { id: 'heavy',    label: 'Heavy customization', sub: 'Lots of Z-code & custom tables' },
  { id: 'unknown',  label: 'Honestly not sure',   sub: 'IT owns that answer' }
];

const PAIN_POINTS = [
  // Procurement / PtP
  { id: 'spend-blind',   label: 'Spend analysis takes days',            cat: 'procurement',    icon: '💸' },
  { id: 'maverick',      label: 'Maverick / off-contract buying',       cat: 'procurement',    icon: '🛒' },
  { id: 'contract-leak', label: 'Contract leakage — we\'re not using the prices we negotiated', cat: 'procurement', icon: '📉' },
  { id: 'po-bottleneck', label: 'PO approval bottlenecks',              cat: 'procurement',    icon: '⏱️' },
  // Supplier Risk
  { id: 'supplier-mystery', label: 'Which suppliers are actually reliable?', cat: 'supplier-risk', icon: '🔍' },
  { id: 'concentration',    label: 'Too much spend concentrated in a few vendors', cat: 'supplier-risk', icon: '⚠️' },
  { id: 'single-source',    label: 'Single-sourced critical materials',  cat: 'supplier-risk', icon: '🎯' },
  { id: 'otif',             label: 'OTIF / on-time delivery slipping',    cat: 'supplier-risk', icon: '📅' },
  // Inventory
  { id: 'stockouts',        label: 'Stockouts on critical materials',     cat: 'inventory',     icon: '📭' },
  { id: 'dead-stock',       label: 'Excess / dead stock tying up capital',cat: 'inventory',     icon: '📦' },
  { id: 'safety-stock',     label: 'Safety stock is gut-feel, not math',  cat: 'inventory',     icon: '🧮' },
  // Planning
  { id: 'mrp-noise',        label: 'MRP exceptions we can\'t triage',     cat: 'planning',      icon: '🔁' },
  { id: 'forecast-drift',   label: 'Forecast vs. actual keeps diverging', cat: 'planning',      icon: '📊' },
  // Finance / Controlling
  { id: 'close-firedrill',  label: 'Month-end close is a fire drill',     cat: 'finance',       icon: '📅' },
  { id: 'cost-variance',    label: 'Can\'t explain cost variances',       cat: 'controlling',   icon: '📈' },
  // Multi-plant / reporting
  { id: 'multi-plant',      label: 'Multi-plant rollups don\'t reconcile', cat: 'ops',          icon: '🏭' },
];

const PAIN_CATEGORIES = {
  procurement:    { label: 'Procurement / PtP',    color: 'blue' },
  'supplier-risk':{ label: 'Supplier Risk',        color: 'amber' },
  inventory:      { label: 'Inventory',            color: 'green' },
  planning:       { label: 'Planning / MRP',       color: 'blue' },
  finance:        { label: 'Finance / Close',      color: 'amber' },
  controlling:    { label: 'Controlling',          color: 'amber' },
  ops:            { label: 'Multi-plant Ops',      color: 'green' }
};

// Deep-dive questions per dominant category. Each returns a widget schema.
const DEEPDIVE = {
  procurement: {
    intro: "Let me go deeper on the procurement side — four quick calibration questions so I can size the work properly.",
    questions: [
      { id: 'po-volume', label: 'POs per month', options: [
        { id: 'lt500', label: '< 500' },
        { id: '500-2k', label: '500 – 2K' },
        { id: '2k-10k', label: '2K – 10K' },
        { id: 'gt10k', label: '10K+' }
      ]},
      { id: 'contract-pct', label: 'Contract coverage (% of spend on negotiated contracts)', options: [
        { id: 'lt30', label: '< 30%' },
        { id: '30-60', label: '30 – 60%' },
        { id: '60-80', label: '60 – 80%' },
        { id: 'gt80', label: '80%+' },
        { id: 'unknown', label: 'Not sure' }
      ]},
      { id: 'cat-mgrs', label: 'Do you have category managers?', options: [
        { id: 'formal', label: 'Yes — formal team' },
        { id: 'informal', label: 'Informal / shared role' },
        { id: 'no', label: 'No' }
      ]},
      { id: 'release', label: 'Release strategy complexity', options: [
        { id: 'simple', label: '1–2 tiers' },
        { id: 'moderate', label: '3–4 tiers' },
        { id: 'complex', label: 'Many tiers with parallel approvals' }
      ]}
    ]
  },
  'supplier-risk': {
    intro: "Supplier risk work lives or dies on how clean your vendor master is. A few scoping questions:",
    questions: [
      { id: 'vendor-count', label: 'Active vendors in LFA1', options: [
        { id: 'lt500', label: '< 500' },
        { id: '500-2k', label: '500 – 2K' },
        { id: '2k-10k', label: '2K – 10K' },
        { id: 'gt10k', label: '10K+' }
      ]},
      { id: 'top10-concentration', label: 'Share of spend with top-10 vendors', options: [
        { id: 'lt30', label: '< 30%' },
        { id: '30-50', label: '30 – 50%' },
        { id: '50-75', label: '50 – 75%' },
        { id: 'gt75', label: '75%+' }
      ]},
      { id: 'single-sourced', label: 'Single-sourced critical materials today?', options: [
        { id: 'many', label: 'Many — known issue' },
        { id: 'some', label: 'A handful' },
        { id: 'few', label: 'Very few' },
        { id: 'unknown', label: 'We don\'t track this' }
      ]},
      { id: 'scorecards', label: 'Existing supplier scorecards / SRM?', options: [
        { id: 'full', label: 'Yes — live scorecards' },
        { id: 'manual', label: 'Manual quarterly review' },
        { id: 'none', label: 'None today' }
      ]}
    ]
  },
  inventory: {
    intro: "Inventory work is all about planning strategy and master-data hygiene. Four calibration questions:",
    questions: [
      { id: 'planning', label: 'Primary planning strategy', options: [
        { id: 'mrp', label: 'MRP (PD / VV)' },
        { id: 'rop', label: 'Reorder point (VB)' },
        { id: 'consumption', label: 'Consumption-based (VM)' },
        { id: 'mixed', label: 'Mixed across SKUs' }
      ]},
      { id: 'sku-count', label: 'Active SKUs (material masters)', options: [
        { id: 'lt5k', label: '< 5K' },
        { id: '5k-25k', label: '5K – 25K' },
        { id: '25k-100k', label: '25K – 100K' },
        { id: 'gt100k', label: '100K+' }
      ]},
      { id: 'plants', label: 'Plants / storage locations', options: [
        { id: '1', label: 'Single plant' },
        { id: '2-5', label: '2 – 5' },
        { id: '6-15', label: '6 – 15' },
        { id: 'gt15', label: '15+' }
      ]},
      { id: 'abc', label: 'ABC classification maintained?', options: [
        { id: 'maintained', label: 'Yes — current' },
        { id: 'stale', label: 'Exists but stale' },
        { id: 'partial', label: 'Only on some plants' },
        { id: 'none', label: 'Not in place' }
      ]}
    ]
  }
};

// Named SAP reports by module — shown based on step-1 module picks
const NAMED_REPORTS = [
  { id: 'mb5b', label: 'MB5B', sub: 'Stock on posting date', requires: ['mm'] },
  { id: 'mb52', label: 'MB52', sub: 'Warehouse stock of material', requires: ['mm'] },
  { id: 'me2m', label: 'ME2M', sub: 'POs by material', requires: ['mm'] },
  { id: 'me2l', label: 'ME2L', sub: 'POs by vendor', requires: ['mm'] },
  { id: 'md04', label: 'MD04', sub: 'Stock / requirements list', requires: ['mm','pp'] },
  { id: 'mcba', label: 'MC.9', sub: 'Material analysis — stock value', requires: ['mm'] },
  { id: 'coom', label: 'KSB1', sub: 'Cost centre line items', requires: ['co'] },
  { id: 'f110', label: 'F.13', sub: 'Open items / clearing', requires: ['fi'] },
  { id: 'fbl3n', label: 'FBL3N', sub: 'G/L line items', requires: ['fi'] },
  { id: 'sqvi', label: 'SQVI queries', sub: 'Ad-hoc quick-view', requires: [] },
];

const REPORTING_STACK = [
  { id: 'standard',  label: 'SAP standard reports',   sub: 'MB5B, ME2M, KSB1…' },
  { id: 'bw',        label: 'SAP BW / BW/4HANA',      sub: 'Data warehouse' },
  { id: 'sac',       label: 'SAP Analytics Cloud',    sub: 'SAC dashboards' },
  { id: 'sqvi',      label: 'SQVI / QuickViewer',     sub: 'Ad-hoc joins' },
  { id: 'power-bi',  label: 'Power BI on extracts',   sub: 'Excel / CSV feeds' },
  { id: 'tableau',   label: 'Tableau',                sub: 'External BI' },
  { id: 'excel',     label: 'Excel exports + pivots', sub: 'The universal fallback' },
  { id: 'crystal',   label: 'Crystal Reports',        sub: 'Legacy ops reports' },
  { id: 'abap',      label: 'Custom ABAP reports',    sub: 'In-house Z-programs' }
];

const DATA_ACCESS = [
  { id: 'cds',       label: 'CDS views / OData',      sub: 'S/4 preferred path' },
  { id: 'rfc',       label: 'RFC / BAPIs',            sub: 'Classic interfaces' },
  { id: 'slt',       label: 'SLT / ODP replication',  sub: 'Real-time replica' },
  { id: 'hana',      label: 'Direct HANA read',       sub: 'Underlying DB access' },
  { id: 'bw-extr',   label: 'BW DataSources',         sub: 'Extractors' },
  { id: 'flat-file', label: 'Flat-file exports',      sub: 'Nightly dumps' },
  { id: 'unknown',   label: 'IT hasn\'t decided yet', sub: 'Part of the scoping' }
];

const IT_POSTURE = [
  { id: 'open',     label: 'Read access to tables allowed' },
  { id: 'bapi',     label: 'BAPIs only — no direct reads' },
  { id: 'bw',       label: 'Must go through BW layer' },
  { id: 'tbd',      label: 'Still being decided' }
];

const TEAM_ROLES = [
  { id: 'proc-lead',    label: 'Procurement Lead',      sub: 'Primary sponsor?' },
  { id: 'cat-mgr',      label: 'Category Manager(s)',   sub: 'Spend owners' },
  { id: 'planner',      label: 'Supply / Demand Planner', sub: 'MRP & forecast' },
  { id: 'mdg',          label: 'Master Data / MDG',     sub: 'Material & vendor master' },
  { id: 'basis',        label: 'SAP Basis / IT',        sub: 'Access & security' },
  { id: 'controller',   label: 'Finance Controller',    sub: 'CO & reporting' },
  { id: 'cfo',          label: 'CFO / Exec',            sub: 'Dashboard consumer' },
  { id: 'plant-ops',    label: 'Plant Ops Manager',     sub: 'Shop-floor reality check' }
];

const TIMELINE_OPTIONS = [
  { id: 'board',    label: 'Board / audit deadline',   sub: 'Q2 planning, etc.' },
  { id: 'quarter',  label: 'This quarter',              sub: '10–14 weeks' },
  { id: 'half',     label: 'Within 6 months',           sub: 'Flexible pace' },
  { id: 'exploratory', label: 'Exploratory',            sub: 'No firm deadline' }
];

// ──────────────────────────────────────
// Demo auto-fill — Meridian Partners profile
// ──────────────────────────────────────

const MERIDIAN_PROFILE = {
  landscape: {
    deployment: 'ecc',
    modules: ['mm', 'pp', 'fi', 'sd', 'co'],
    customization: 'moderate'
  },
  pains: ['spend-blind', 'maverick', 'supplier-mystery', 'concentration', 'stockouts'],
  deepdive: {
    'po-volume': '2k-10k',
    'contract-pct': '30-60',
    'cat-mgrs': 'informal',
    'release': 'moderate'
  },
  reporting: {
    stack: ['standard', 'excel', 'crystal'],
    namedReports: ['mb5b', 'me2m', 'mcba'],
    access: ['rfc', 'flat-file'],
    posture: 'bapi'
  },
  team: {
    roles: ['proc-lead', 'cat-mgr', 'controller', 'cfo', 'basis'],
    timeline: 'board'
  }
};

// ──────────────────────────────────────
// Render entry point
// ──────────────────────────────────────

export function render(container) {
  // Per-render state
  const state = {
    currentStep: 0,
    answers: {
      landscape: { deployment: null, modules: [], customization: null },
      pains: [],
      deepdive: {},
      reporting: { stack: [], namedReports: [], access: [], posture: null },
      team: { roles: [], timeline: null }
    }
  };

  container.innerHTML = `
    <div style="max-width: 820px; margin: 0 auto; padding: var(--space-8) var(--space-6);">
      <div class="text-center mb-8">
        <div class="badge badge-blue mb-3">Self-Assessment — Built for SAP Shops</div>
        <h1 style="font-size: var(--text-3xl);" class="mb-2">Scope Your SAP Intelligence Build</h1>
        <p class="text-secondary">A few targeted questions — the kind we'd ask on a real scoping call. Tight picks, no open-ended essays.</p>
      </div>

      <!-- Progress -->
      <div class="flex items-center gap-2 mb-6">
        <div class="progress-bar" style="flex:1;">
          <div class="progress-bar-fill" id="sa-progress" style="width: 0%; transition: width 0.4s ease;"></div>
        </div>
        <span class="text-xs text-muted" id="sa-step-label"></span>
      </div>

      <!-- Conversation area -->
      <div id="sa-conversation" class="flex flex-col gap-4 mb-6" style="min-height: 260px;"></div>

      <!-- Widget panel (swapped per step) -->
      <div id="sa-widget" style="border-top: 1px solid var(--border); padding-top: var(--space-4);"></div>

      <!-- Results area (hidden until done) -->
      <div id="sa-results" style="display:none;"></div>
    </div>
  `;

  const steps = buildSteps();
  const TOTAL = steps.length + 2; // + preview + results

  function updateProgress() {
    const pct = Math.min((state.currentStep / TOTAL) * 100, 100);
    const bar = container.querySelector('#sa-progress');
    const label = container.querySelector('#sa-step-label');
    if (bar) bar.style.width = `${pct}%`;
    if (label) {
      label.textContent = state.currentStep >= TOTAL
        ? 'Assessment complete'
        : `Step ${state.currentStep + 1} of ${TOTAL}`;
    }
  }

  function goToStep(idx) {
    state.currentStep = idx;
    updateProgress();

    if (idx < steps.length) {
      const step = steps[idx];
      addAIMessage(step.aiMessage(state));
      renderWidget(step);
    } else if (idx === steps.length) {
      showPreview(container, () => goToStep(idx + 1));
    } else {
      showResults(container, state);
    }
  }

  function renderWidget(step) {
    const panel = container.querySelector('#sa-widget');
    if (!panel) return;
    panel.innerHTML = '';
    step.renderWidget(panel, state, {
      onContinue: () => {
        // Render user's picks as a summary bubble
        const summary = step.summary(state);
        if (summary) addUserBubble(summary);

        // Feedback (SAP-flavored)
        const fb = step.feedback(state);
        if (fb) setTimeout(() => addFeedback(fb), 300);

        // Advance — deep-dive step is re-built based on dominant pain, so rebuild the list
        setTimeout(() => {
          const nextSteps = buildSteps();
          // Replace the steps array in place
          steps.length = 0;
          nextSteps.forEach(s => steps.push(s));
          goToStep(state.currentStep + 1);
        }, 700);
      },
      onDemoFill: () => {
        step.demoFill(state);
        // Re-render widget to reflect filled state
        renderWidget(step);
      }
    });
  }

  // Kick off
  goToStep(0);
}

// ──────────────────────────────────────
// Step definitions
// ──────────────────────────────────────

function buildSteps() {
  return [
    stepLandscape(),
    stepPain(),
    stepDeepDive(),
    stepReporting(),
    stepTeam()
  ];
}

function stepLandscape() {
  return {
    id: 'landscape',
    aiMessage: () => "Let's start with your SAP landscape. The answers here shape everything downstream — which tables we pull from, whether we can lean on CDS views, how much Z-code we'll be reading.\n\nWhich system are you on, and which modules are live?",
    renderWidget(panel, state, { onContinue, onDemoFill }) {
      const a = state.answers.landscape;
      panel.innerHTML = `
        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Deployment</div>
          <div id="sa-deployment" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>
        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Live modules <span class="text-muted" style="font-weight:400; text-transform:none; letter-spacing:0;">— pick all that apply</span></div>
          <div id="sa-modules" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>
        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">How customized is your SAP?</div>
          <div id="sa-custom" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>
        ${demoAndContinueRow()}
      `;

      renderPillGroup(panel.querySelector('#sa-deployment'), DEPLOYMENTS, a.deployment, (id) => {
        a.deployment = id; renderWidget.call(null);
      }, { rerender: () => this.renderWidget(panel, state, { onContinue, onDemoFill }) });

      renderChipChoices(panel.querySelector('#sa-modules'), MODULES, a.modules, true, () => {
        this.renderWidget(panel, state, { onContinue, onDemoFill });
      });

      renderChipChoices(panel.querySelector('#sa-custom'), CUSTOMIZATION_LEVELS,
        a.customization ? [a.customization] : [], false, (picks) => {
          a.customization = picks[0] || null;
          this.renderWidget(panel, state, { onContinue, onDemoFill });
        });

      wireDemoAndContinue(panel, onDemoFill, onContinue, canContinueLandscape(state));
    },
    summary(state) {
      const a = state.answers.landscape;
      const dep = DEPLOYMENTS.find(d => d.id === a.deployment);
      const modLabels = a.modules.map(id => MODULES.find(m => m.id === id)?.label).filter(Boolean);
      const cust = CUSTOMIZATION_LEVELS.find(c => c.id === a.customization);
      return `
        <div class="text-xs text-secondary mb-2">My landscape:</div>
        <div class="flex gap-1 flex-wrap">
          ${dep ? `<span class="badge badge-blue">${dep.label}</span>` : ''}
          ${modLabels.map(l => `<span class="badge">${l}</span>`).join('')}
          ${cust ? `<span class="badge">${cust.label}</span>` : ''}
        </div>
      `;
    },
    feedback(state) {
      const a = state.answers.landscape;
      const mods = a.modules;
      const lines = [];
      if (a.deployment === 's4-onprem' || a.deployment === 's4-cloud' || a.deployment === 'rise') {
        lines.push("S/4HANA — good. The CDS view layer gets us clean extraction without stitching classic tables.");
      } else if (a.deployment === 'ecc') {
        lines.push("ECC — we'll plan for classic tables (EKKO/EKPO, MARC/MARD, MSEG). Well-trodden ground, just a bit more plumbing.");
      } else if (a.deployment === 'hybrid') {
        lines.push("Mid-migration is a scoping flag — we'll design the extract layer to survive the cutover.");
      }
      if (mods.includes('mm') && mods.includes('pp')) {
        lines.push("MM + PP together gives us the join between purchasing docs and MRP runs — that's where procurement + inventory analytics pay off fastest.");
      } else if (mods.includes('mm') && mods.includes('fi')) {
        lines.push("MM + FI is the backbone for spend analytics — invoice-to-PO matching and price-variance work starts here.");
      }
      if (a.customization === 'heavy') {
        lines.push("Heavy customization means discovery will spend real time in SE16 reading your Z-tables — factored into the estimate.");
      }
      return { type: 'success', text: lines.join(' ') || "Got it." };
    },
    demoFill(state) {
      state.answers.landscape = { ...MERIDIAN_PROFILE.landscape };
    }
  };
}

function stepPain() {
  return {
    id: 'pain',
    aiMessage: () => "Now the one that actually matters: where does it hurt? Pick the things that keep coming up in leadership meetings — 2 to 5 is usually enough. Don't over-pick; I'd rather you show me what's genuinely on fire.",
    renderWidget(panel, state, { onContinue, onDemoFill }) {
      const selected = state.answers.pains;

      // Group by category
      const byCat = {};
      PAIN_POINTS.forEach(p => {
        byCat[p.cat] = byCat[p.cat] || [];
        byCat[p.cat].push(p);
      });

      const lanes = Object.keys(byCat).map(cat => {
        const meta = PAIN_CATEGORIES[cat];
        return `
          <div class="mb-4">
            <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">${meta.label}</div>
            <div class="flex gap-2" style="flex-wrap:wrap;" data-pain-cat="${cat}"></div>
          </div>
        `;
      }).join('');

      panel.innerHTML = `
        <div class="mb-2">${lanes}</div>
        ${demoAndContinueRow()}
      `;

      Object.keys(byCat).forEach(cat => {
        const el = panel.querySelector(`[data-pain-cat="${cat}"]`);
        byCat[cat].forEach(p => {
          const chip = document.createElement('button');
          chip.className = 'chip-choice' + (selected.includes(p.id) ? ' selected' : '');
          chip.innerHTML = `<span>${p.icon} ${p.label}</span>`;
          chip.style.flexDirection = 'row';
          chip.style.alignItems = 'center';
          chip.style.gap = '6px';
          chip.addEventListener('click', () => {
            const i = selected.indexOf(p.id);
            if (i >= 0) selected.splice(i, 1); else selected.push(p.id);
            this.renderWidget(panel, state, { onContinue, onDemoFill });
          });
          el.appendChild(chip);
        });
      });

      wireDemoAndContinue(panel, onDemoFill, onContinue, selected.length > 0);
    },
    summary(state) {
      const picks = state.answers.pains.map(id => PAIN_POINTS.find(p => p.id === id)).filter(Boolean);
      return `
        <div class="text-xs text-secondary mb-2">Where it hurts:</div>
        <div class="flex gap-1 flex-wrap">
          ${picks.map(p => `<span class="badge">${p.icon} ${p.label}</span>`).join('')}
        </div>
      `;
    },
    feedback(state) {
      const dom = dominantCategory(state.answers.pains);
      const meta = PAIN_CATEGORIES[dom];
      const picks = state.answers.pains;
      const count = picks.filter(id => PAIN_POINTS.find(p => p.id === id)?.cat === dom).length;
      let text = `${count} of your picks land in the **${meta.label}** lane — that's your wedge. `;
      if (dom === 'procurement') {
        text += "Procurement analytics is also where we see the fastest time-to-first-insight on SAP data, because PtP tables are stable and the business outcomes are crisp. Let me go deeper on procurement specifically.";
      } else if (dom === 'supplier-risk') {
        text += "Supplier risk is a multi-factor problem — delivery, financial, geographic, concentration, quality, price stability. Let me dig into your vendor master and concentration profile.";
      } else if (dom === 'inventory') {
        text += "Inventory work is usually 40% planning strategy, 40% master-data hygiene, 20% forecasting. Let me figure out which one is your actual bottleneck.";
      } else {
        text += "We'll scope the deep-dive around this lane.";
      }
      return { type: 'success', text };
    },
    demoFill(state) {
      state.answers.pains = [...MERIDIAN_PROFILE.pains];
    }
  };
}

function stepDeepDive() {
  const dom = 'procurement'; // placeholder — resolved at render time from state
  return {
    id: 'deepdive',
    aiMessage(state) {
      const d = dominantCategory(state.answers.pains);
      const cfg = DEEPDIVE[d] || DEEPDIVE.procurement;
      return cfg.intro;
    },
    renderWidget(panel, state, { onContinue, onDemoFill }) {
      const d = dominantCategory(state.answers.pains);
      const cfg = DEEPDIVE[d] || DEEPDIVE.procurement;
      const answers = state.answers.deepdive;

      panel.innerHTML = `
        <div class="mb-2" id="sa-deep-questions"></div>
        ${demoAndContinueRow()}
      `;

      const qContainer = panel.querySelector('#sa-deep-questions');
      cfg.questions.forEach(q => {
        const block = document.createElement('div');
        block.className = 'mb-4';
        block.innerHTML = `
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">${q.label}</div>
          <div class="pill-group" data-q="${q.id}"></div>
        `;
        qContainer.appendChild(block);
        const group = block.querySelector(`[data-q="${q.id}"]`);
        q.options.forEach(opt => {
          const pill = document.createElement('button');
          pill.className = 'pill' + (answers[q.id] === opt.id ? ' selected' : '');
          pill.textContent = opt.label;
          pill.addEventListener('click', () => {
            answers[q.id] = opt.id;
            this.renderWidget(panel, state, { onContinue, onDemoFill });
          });
          group.appendChild(pill);
        });
      });

      const allAnswered = cfg.questions.every(q => answers[q.id]);
      wireDemoAndContinue(panel, onDemoFill, onContinue, allAnswered);
    },
    summary(state) {
      const d = dominantCategory(state.answers.pains);
      const cfg = DEEPDIVE[d] || DEEPDIVE.procurement;
      const answers = state.answers.deepdive;
      const rows = cfg.questions.map(q => {
        const opt = q.options.find(o => o.id === answers[q.id]);
        return opt ? `<div class="text-xs"><span class="text-muted">${q.label}:</span> <strong>${opt.label}</strong></div>` : '';
      }).join('');
      return `<div class="text-xs text-secondary mb-2">Deep dive:</div>${rows}`;
    },
    feedback(state) {
      const d = dominantCategory(state.answers.pains);
      const a = state.answers.deepdive;
      const lines = [];
      if (d === 'procurement') {
        if (a['contract-pct'] === 'lt30' || a['contract-pct'] === '30-60') {
          lines.push("Contract coverage under 60% is a clear value signal — every percentage point we push that up converts directly to realized savings.");
        }
        if (a['po-volume'] === '2k-10k' || a['po-volume'] === 'gt10k') {
          lines.push("At that PO volume, manual spend analysis is mathematically impossible — this is the right problem to automate first.");
        }
        if (a['cat-mgrs'] === 'informal' || a['cat-mgrs'] === 'no') {
          lines.push("Without dedicated category managers, the analytics has to carry more of the 'what do I do about it' weight — we'll build prescriptive cues into the workflow.");
        }
      } else if (d === 'supplier-risk') {
        if (a['top10-concentration'] === '50-75' || a['top10-concentration'] === 'gt75') {
          lines.push("Heavy top-10 concentration means the risk model will be high-signal — fewer vendors to model, each one matters a lot.");
        }
        if (a['single-sourced'] === 'many' || a['single-sourced'] === 'unknown') {
          lines.push("Surfacing single-sourced critical materials is usually the first 'holy shit' moment for execs — we'll make that a day-one output.");
        }
        if (a['scorecards'] === 'none' || a['scorecards'] === 'manual') {
          lines.push("No live scorecards today means we're building from scratch — which is actually easier than unwinding a legacy SRM.");
        }
      } else if (d === 'inventory') {
        if (a['planning'] === 'rop') {
          lines.push("Reorder-point planning everywhere is the classic 'we outgrew this strategy' pattern — moving the A-items to MRP is usually the quickest win.");
        } else if (a['planning'] === 'mixed') {
          lines.push("Mixed strategies across SKUs is normal; the real question is whether the split matches ABC classification. That'll be one of the first diagnostics.");
        }
        if (a['abc'] === 'stale' || a['abc'] === 'none') {
          lines.push("ABC classification that's stale or missing is the #1 root cause of 'our safety stock is gut-feel' — fixable, and we'll rebuild it as a side-effect of the main work.");
        }
      }
      return { type: lines.length ? 'success' : 'info', text: lines.join(' ') || "Calibration captured." };
    },
    demoFill(state) {
      state.answers.deepdive = { ...MERIDIAN_PROFILE.deepdive };
    }
  };
}

function stepReporting() {
  return {
    id: 'reporting',
    aiMessage: () => "Two practical questions: what reporting stack do you have today, and how will we actually get the data out? These drive the extract architecture.",
    renderWidget(panel, state, { onContinue, onDemoFill }) {
      const a = state.answers.reporting;
      const activeModules = state.answers.landscape.modules;
      const relevantReports = NAMED_REPORTS.filter(r => r.requires.length === 0 || r.requires.some(m => activeModules.includes(m)));

      panel.innerHTML = `
        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Current reporting stack <span class="text-muted" style="font-weight:400; text-transform:none; letter-spacing:0;">— multi-select</span></div>
          <div id="sa-stack" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>

        ${relevantReports.length ? `
        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Named reports that eat hours every week</div>
          <div id="sa-named-reports" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>` : ''}

        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Likely data extraction path</div>
          <div id="sa-access" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>

        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">IT security posture</div>
          <div id="sa-posture" class="pill-group"></div>
        </div>

        ${demoAndContinueRow()}
      `;

      renderChipChoices(panel.querySelector('#sa-stack'), REPORTING_STACK, a.stack, true, () => {
        this.renderWidget(panel, state, { onContinue, onDemoFill });
      });

      if (relevantReports.length) {
        renderChipChoices(panel.querySelector('#sa-named-reports'), relevantReports, a.namedReports, true, () => {
          this.renderWidget(panel, state, { onContinue, onDemoFill });
        });
      }

      renderChipChoices(panel.querySelector('#sa-access'), DATA_ACCESS, a.access, true, () => {
        this.renderWidget(panel, state, { onContinue, onDemoFill });
      });

      const postureGroup = panel.querySelector('#sa-posture');
      IT_POSTURE.forEach(opt => {
        const pill = document.createElement('button');
        pill.className = 'pill' + (a.posture === opt.id ? ' selected' : '');
        pill.textContent = opt.label;
        pill.addEventListener('click', () => {
          a.posture = opt.id;
          this.renderWidget(panel, state, { onContinue, onDemoFill });
        });
        postureGroup.appendChild(pill);
      });

      const canContinue = a.stack.length > 0 && a.access.length > 0 && a.posture;
      wireDemoAndContinue(panel, onDemoFill, onContinue, canContinue);
    },
    summary(state) {
      const a = state.answers.reporting;
      const stack = a.stack.map(id => REPORTING_STACK.find(s => s.id === id)?.label).filter(Boolean);
      const reports = a.namedReports.map(id => NAMED_REPORTS.find(r => r.id === id)?.label).filter(Boolean);
      const access = a.access.map(id => DATA_ACCESS.find(d => d.id === id)?.label).filter(Boolean);
      const posture = IT_POSTURE.find(p => p.id === a.posture);
      return `
        <div class="text-xs text-secondary mb-2">Reporting & access:</div>
        <div class="flex gap-1 flex-wrap">
          ${stack.map(l => `<span class="badge">${l}</span>`).join('')}
          ${reports.map(l => `<span class="badge badge-amber">${l}</span>`).join('')}
          ${access.map(l => `<span class="badge badge-green">${l}</span>`).join('')}
          ${posture ? `<span class="badge badge-blue">${posture.label}</span>` : ''}
        </div>
      `;
    },
    feedback(state) {
      const a = state.answers.reporting;
      const lines = [];
      if (a.stack.includes('excel') && a.stack.includes('crystal')) {
        lines.push("Excel + Crystal as the reporting backbone is a red flag for 'every report is a fresh ticket.' That's the busywork this project is designed to delete.");
      }
      if (a.access.includes('rfc') && !a.access.includes('cds')) {
        lines.push("RFC/BAPI path makes sense on ECC — we'll build the extract as an RFC orchestrator and plan the migration to CDS views when you move to S/4.");
      }
      if (a.posture === 'bapi') {
        lines.push("BAPI-only posture from IT is fine; it just means scoping a few more wrappers. We've done it many times.");
      }
      if (a.namedReports && a.namedReports.length >= 3) {
        lines.push(`Reports like ${a.namedReports.slice(0,3).map(id => NAMED_REPORTS.find(r => r.id === id)?.label).join(', ')} are classic time-sinks — retiring those is a concrete week-one deliverable we can measure.`);
      }
      return { type: 'warning', text: lines.join(' ') || "Noted." };
    },
    demoFill(state) {
      state.answers.reporting = {
        stack: [...MERIDIAN_PROFILE.reporting.stack],
        namedReports: [...MERIDIAN_PROFILE.reporting.namedReports],
        access: [...MERIDIAN_PROFILE.reporting.access],
        posture: MERIDIAN_PROFILE.reporting.posture
      };
    }
  };
}

function stepTeam() {
  return {
    id: 'team',
    aiMessage: () => "Last one: who's on the team, and what's the deadline pressure? This drives the rollout plan and the review cadence.",
    renderWidget(panel, state, { onContinue, onDemoFill }) {
      const a = state.answers.team;
      panel.innerHTML = `
        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Who's involved on your side?</div>
          <div id="sa-roles" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>
        <div class="mb-4">
          <div class="text-xs text-secondary mb-2" style="font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Timeline pressure</div>
          <div id="sa-timeline" class="flex gap-2" style="flex-wrap:wrap;"></div>
        </div>
        ${demoAndContinueRow()}
      `;

      renderChipChoices(panel.querySelector('#sa-roles'), TEAM_ROLES, a.roles, true, () => {
        this.renderWidget(panel, state, { onContinue, onDemoFill });
      });

      renderChipChoices(panel.querySelector('#sa-timeline'), TIMELINE_OPTIONS,
        a.timeline ? [a.timeline] : [], false, (picks) => {
          a.timeline = picks[0] || null;
          this.renderWidget(panel, state, { onContinue, onDemoFill });
        });

      wireDemoAndContinue(panel, onDemoFill, onContinue, a.roles.length > 0 && a.timeline);
    },
    summary(state) {
      const a = state.answers.team;
      const roles = a.roles.map(id => TEAM_ROLES.find(r => r.id === id)?.label).filter(Boolean);
      const tl = TIMELINE_OPTIONS.find(t => t.id === a.timeline);
      return `
        <div class="text-xs text-secondary mb-2">Team & timeline:</div>
        <div class="flex gap-1 flex-wrap">
          ${roles.map(l => `<span class="badge">${l}</span>`).join('')}
          ${tl ? `<span class="badge badge-blue">${tl.label}</span>` : ''}
        </div>
      `;
    },
    feedback(state) {
      const a = state.answers.team;
      const lines = [];
      if (a.roles.includes('cfo') && a.roles.includes('proc-lead')) {
        lines.push("CFO + Procurement Lead in the room is the ideal sponsor pattern — finance cares about the savings number, procurement owns the execution.");
      }
      if (a.roles.includes('basis')) {
        lines.push("Having Basis in the loop early saves weeks on access provisioning — this will move fast.");
      }
      if (!a.roles.includes('mdg') && state.answers.pains.some(p => ['spend-blind','maverick','supplier-mystery'].includes(p))) {
        lines.push("Flagging: no master-data person listed. For spend/supplier work, vendor master quality will surface as an issue — we should loop someone in.");
      }
      if (a.timeline === 'board') {
        lines.push("Board deadline means we'll work backwards from that date with two-week sprint gates and a defined 'minimum executive story' by week 8.");
      }
      return { type: 'success', text: lines.join(' ') || "Team captured." };
    },
    demoFill(state) {
      state.answers.team = { ...MERIDIAN_PROFILE.team };
    }
  };
}

// ──────────────────────────────────────
// Widget primitives
// ──────────────────────────────────────

function renderChipChoices(container, items, selectedIds, multi, onChange) {
  container.innerHTML = '';
  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'chip-choice' + (selectedIds.includes(item.id) ? ' selected' : '');
    btn.innerHTML = `
      <span>${item.label}</span>
      ${item.sub ? `<span class="chip-choice-sub">${item.sub}</span>` : ''}
    `;
    btn.addEventListener('click', () => {
      const i = selectedIds.indexOf(item.id);
      if (multi) {
        if (i >= 0) selectedIds.splice(i, 1); else selectedIds.push(item.id);
        onChange(selectedIds);
      } else {
        // single-select
        const picks = (i >= 0) ? [] : [item.id];
        onChange(picks);
      }
    });
    container.appendChild(btn);
  });
}

function renderPillGroup(container, items, selectedId, onChange, ctx) {
  container.innerHTML = '';
  items.forEach(item => {
    const pill = document.createElement('button');
    pill.className = 'pill' + (selectedId === item.id ? ' selected' : '');
    pill.innerHTML = item.label + (item.sub ? ` <span style="opacity:0.7; margin-left:4px;">· ${item.sub}</span>` : '');
    pill.addEventListener('click', () => {
      onChange(item.id);
      if (ctx?.rerender) ctx.rerender();
    });
    container.appendChild(pill);
  });
}

function demoAndContinueRow() {
  return `
    <div class="flex justify-between items-center mt-4" style="gap: var(--space-2); flex-wrap: wrap;">
      <button class="btn btn-sm btn-ghost" data-role="demo-fill" style="color: var(--accent);">
        ✨ Use Meridian demo answers
      </button>
      <button class="btn btn-primary" data-role="continue">Continue →</button>
    </div>
  `;
}

function wireDemoAndContinue(panel, onDemoFill, onContinue, canContinue) {
  const demoBtn = panel.querySelector('[data-role="demo-fill"]');
  const contBtn = panel.querySelector('[data-role="continue"]');
  if (demoBtn) demoBtn.onclick = onDemoFill;
  if (contBtn) {
    contBtn.disabled = !canContinue;
    contBtn.style.opacity = canContinue ? '1' : '0.5';
    contBtn.style.cursor = canContinue ? 'pointer' : 'not-allowed';
    contBtn.onclick = () => { if (canContinue) onContinue(); };
  }
}

function canContinueLandscape(state) {
  const a = state.answers.landscape;
  return a.deployment && a.modules.length > 0 && a.customization;
}

function dominantCategory(painIds) {
  if (!painIds || painIds.length === 0) return 'procurement';
  const counts = {};
  painIds.forEach(id => {
    const p = PAIN_POINTS.find(x => x.id === id);
    if (p) counts[p.cat] = (counts[p.cat] || 0) + 1;
  });
  // Map non-deepdive categories to their closest deepdive cousin
  const mapping = { planning: 'inventory', finance: 'procurement', controlling: 'procurement', ops: 'procurement' };
  let top = Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'procurement';
  if (!DEEPDIVE[top]) top = mapping[top] || 'procurement';
  return top;
}

// ──────────────────────────────────────
// Chat bubble helpers
// ──────────────────────────────────────

function addAIMessage(text) {
  const conv = document.getElementById('sa-conversation');
  if (!conv) return;
  const el = document.createElement('div');
  el.className = 'flex gap-3';
  el.style.animation = 'slideUp 0.3s ease';
  el.innerHTML = `
    <div class="avatar" style="background: var(--primary-bg); color: var(--primary); flex-shrink:0; width:36px; height:36px; font-size:var(--text-xs);">AI</div>
    <div class="card card-compact" style="flex:1;">
      <p class="text-sm" style="line-height:1.6; white-space:pre-line;">${formatMarkdownLite(text)}</p>
    </div>
  `;
  conv.appendChild(el);
}

function addUserBubble(html) {
  const conv = document.getElementById('sa-conversation');
  if (!conv) return;
  const el = document.createElement('div');
  el.className = 'flex gap-3 justify-end';
  el.style.animation = 'slideUp 0.3s ease';
  el.innerHTML = `
    <div class="card card-compact" style="background: var(--bg-secondary); max-width: 80%; border: 1px solid var(--border);">
      ${html}
    </div>
  `;
  conv.appendChild(el);
}

function addFeedback(feedback) {
  const conv = document.getElementById('sa-conversation');
  if (!conv) return;
  const el = document.createElement('div');
  el.style.animation = 'slideUp 0.3s ease';
  const bgColor = feedback.type === 'success' ? 'var(--accent-bg)' : feedback.type === 'warning' ? 'var(--warning-bg)' : 'var(--primary-bg)';
  const borderColor = feedback.type === 'success' ? 'var(--accent)' : feedback.type === 'warning' ? 'var(--warning)' : 'var(--primary)';
  el.innerHTML = `
    <div class="callout" style="margin-left: 48px; background: ${bgColor}; border-left-color: ${borderColor};">
      <p class="text-sm" style="line-height:1.6;">${formatMarkdownLite(feedback.text)}</p>
    </div>
  `;
  conv.appendChild(el);
}

function formatMarkdownLite(text) {
  return (text || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// ──────────────────────────────────────
// Preview & Results
// ──────────────────────────────────────

function showPreview(container, onDone) {
  const widget = container.querySelector('#sa-widget');
  if (widget) widget.style.display = 'none';

  addAIMessage("Excellent — I have a clean picture. Generating a preview of what your solution could look like, pre-wired to the modules you picked…");

  setTimeout(() => {
    const conv = document.getElementById('sa-conversation');
    if (!conv) return;
    const el = document.createElement('div');
    el.style.animation = 'slideUp 0.3s ease';
    el.innerHTML = `
      <div style="margin-left: 48px;" class="mb-4">
        <div class="card" style="padding: 0; overflow: hidden;">
          <div style="padding: var(--space-3) var(--space-4); background: var(--bg-tertiary); border-bottom: 1px solid var(--border);">
            <div class="flex items-center gap-2">
              <span class="badge badge-blue">Preview</span>
              <span class="text-sm" style="font-weight:600;">Your SAP Intelligence Dashboard</span>
            </div>
          </div>
          <img src="assets/mockup-preview.svg" alt="Dashboard Preview" style="width: 100%; display: block;" onerror="this.style.display='none'" />
        </div>
      </div>
    `;
    conv.appendChild(el);

    setTimeout(onDone, 1000);
  }, 1500);
}

function showResults(container, state) {
  const { feasibility } = selfAssessment;
  const dom = dominantCategory(state.answers.pains);
  const domLabel = PAIN_CATEGORIES[dom]?.label || 'Procurement';

  const bar = container.querySelector('#sa-progress');
  const label = container.querySelector('#sa-step-label');
  if (bar) bar.style.width = '100%';
  if (label) label.textContent = 'Assessment complete';

  addAIMessage(`Here's your assessment and a generated Spec/RFP — scoped around a **${domLabel}** wedge with your specific SAP landscape in mind. You can download it or send it to start the engagement.`);

  const results = container.querySelector('#sa-results');
  if (!results) return;
  results.style.display = 'block';
  results.innerHTML = `
    <div class="card mt-4" style="animation: slideUp 0.3s ease;">
      <div class="flex items-center gap-4 mb-6">
        <div class="score score-high" style="width:64px; height:64px; font-size: var(--text-2xl);">${feasibility.score}</div>
        <div>
          <h3>Feasibility Score</h3>
          <p class="text-sm text-secondary">Based on 12 similar SAP ${domLabel.toLowerCase()} engagements in our knowledge base</p>
        </div>
      </div>

      <div class="grid grid-3 gap-4 mb-6">
        <div class="card card-compact card-flat" style="background: var(--bg-secondary);">
          <div class="text-xs text-muted mb-1">Complexity</div>
          <div style="font-weight: 700;">${feasibility.complexity}</div>
        </div>
        <div class="card card-compact card-flat" style="background: var(--bg-secondary);">
          <div class="text-xs text-muted mb-1">Estimated Timeline</div>
          <div style="font-weight: 700;">${feasibility.timeline}</div>
        </div>
        <div class="card card-compact card-flat" style="background: var(--bg-secondary);">
          <div class="text-xs text-muted mb-1">Recommended Tier</div>
          <div style="font-weight: 700;">Professional</div>
        </div>
      </div>

      <div class="mb-6">
        <h4 class="mb-2">Recommended wedge</h4>
        <p class="text-sm text-secondary" style="line-height: 1.7;">${wedgeRecommendation(state, dom)}</p>
      </div>

      <div class="mb-6">
        <h4 class="mb-2">Identified Risks</h4>
        ${feasibility.risks.map(r => `
          <div class="flex items-start gap-2 mb-2">
            <span class="badge badge-amber" style="flex-shrink:0; margin-top:2px;">Risk</span>
            <span class="text-sm">${r}</span>
          </div>
        `).join('')}
      </div>

      <div class="separator"></div>

      <div class="mb-6">
        <div class="flex items-center gap-2 mb-3">
          <h3>Generated Spec / RFP</h3>
          <span class="badge badge-blue">AI-Generated from your picks</span>
        </div>
        <div class="card card-flat" style="background: var(--bg-secondary); font-size: var(--text-sm); line-height: 1.7; max-height: 400px; overflow-y: auto;">
          ${generateSpecRFP(state, dom)}
        </div>
      </div>

      <div class="flex gap-3 flex-wrap">
        <button class="btn btn-primary btn-lg" id="sa-submit-free">📤 Submit Free Assessment</button>
        <button class="btn btn-lg" id="sa-download-spec">📄 Download Spec as PDF</button>
      </div>
    </div>
  `;

  ['sa-submit-free', 'sa-download-spec'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => {
      document.getElementById('not-implemented-modal').style.display = 'flex';
    });
  });
}

function wedgeRecommendation(state, dom) {
  const mods = state.answers.landscape.modules.map(id => MODULES.find(m => m.id === id)?.label).filter(Boolean).join(', ');
  if (dom === 'procurement') {
    return `Lead with procurement analytics on top of ${mods}. Phase 1 replaces your weekly manual spend summary with an automated view joining EKKO/EKPO to contract master, surfaces contract leakage and maverick spend, and puts a prescriptive "what to do this week" feed in front of category stakeholders. Supplier risk and inventory become fast-follow workstreams in phase 2.`;
  }
  if (dom === 'supplier-risk') {
    return `Lead with a supplier risk scoring layer built on your vendor master (LFA1 + LFM1) joined to purchasing history (EKKO/EKPO) and GR/IR patterns (MSEG). First milestone: delivery-reliability + concentration scoring for your top-50 vendors, with a single-source critical-material flag visible to execs. Phase 2 extends to financial and geographic risk signals.`;
  }
  return `Lead with inventory intelligence built on MARC/MARD/MSEG with MRP result analysis from MD04-equivalent data. First milestone: ABC re-classification, safety-stock recommendations by segment, and a stockout-risk feed. Phase 2 extends to demand forecasting and exception triage for the planners.`;
}

function generateSpecRFP(state, dom) {
  const a = state.answers;
  const dep = DEPLOYMENTS.find(d => d.id === a.landscape.deployment)?.label || 'SAP';
  const mods = a.landscape.modules.map(id => MODULES.find(m => m.id === id)?.label).filter(Boolean).join(', ');
  const painLabels = a.pains.map(id => PAIN_POINTS.find(p => p.id === id)?.label).filter(Boolean);
  const stack = a.reporting.stack.map(id => REPORTING_STACK.find(s => s.id === id)?.label).filter(Boolean);
  const access = a.reporting.access.map(id => DATA_ACCESS.find(d => d.id === id)?.label).filter(Boolean);
  const postureLabel = IT_POSTURE.find(p => p.id === a.reporting.posture)?.label || 'TBD';
  const roles = a.team.roles.map(id => TEAM_ROLES.find(r => r.id === id)?.label).filter(Boolean);
  const tl = TIMELINE_OPTIONS.find(t => t.id === a.team.timeline)?.label || 'Flexible';
  const domLabel = PAIN_CATEGORIES[dom]?.label || 'Procurement';

  return `
    <div style="padding: var(--space-4);">
      <h4 style="color: var(--primary); margin-bottom: var(--space-3);">SAP Intelligence Build — Project Specification</h4>
      <p class="text-muted" style="margin-bottom: var(--space-4);">Auto-generated from self-assessment • April 2026</p>

      <h4 style="margin-bottom: var(--space-2);">1. Landscape</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li><strong>System:</strong> ${dep}</li>
        <li><strong>Live modules:</strong> ${mods || '—'}</li>
        <li><strong>Customization level:</strong> ${CUSTOMIZATION_LEVELS.find(c => c.id === a.landscape.customization)?.label || '—'}</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">2. Dominant pain lane — ${domLabel}</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        ${painLabels.map(p => `<li>${p}</li>`).join('')}
      </ul>

      <h4 style="margin-bottom: var(--space-2);">3. Current reporting state</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li><strong>Stack:</strong> ${stack.join(', ') || '—'}</li>
        <li><strong>Named reports flagged as time sinks:</strong> ${a.reporting.namedReports.map(id => NAMED_REPORTS.find(r => r.id === id)?.label).filter(Boolean).join(', ') || '—'}</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">4. Extract architecture</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li><strong>Access path(s):</strong> ${access.join(', ') || '—'}</li>
        <li><strong>IT posture:</strong> ${postureLabel}</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">5. Stakeholders</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        ${roles.map(r => `<li>${r}</li>`).join('')}
      </ul>

      <h4 style="margin-bottom: var(--space-2);">6. Timeline & delivery shape</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li><strong>Pressure:</strong> ${tl}</li>
        <li>Two-week sprint gates with customer review</li>
        <li>Phase 1: ${domLabel} wedge (weeks 1–6)</li>
        <li>Phase 2: Adjacent workstream (weeks 7–12)</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">7. Success criteria</h4>
      <ul style="padding-left: var(--space-6);">
        <li>Retire named legacy reports identified above (measurable: hours/week saved)</li>
        <li>Prescriptive "next action" feed live for ${domLabel.toLowerCase()} stakeholders</li>
        <li>Executive dashboard with weekly AI-generated briefing</li>
        <li>User adoption: 10+ target users active within 30 days of phase-1 launch</li>
      </ul>
    </div>
  `;
}
