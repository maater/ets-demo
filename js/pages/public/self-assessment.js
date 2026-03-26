/**
 * Self-Assessment Tool — multi-step conversational UI.
 * Supports: text input, file upload (mock), demo auto-fill, and generates a spec/RFP.
 */

import { selfAssessment } from '../../data/mock-data.js';

const STEPS = [
  {
    aiMessage: "Welcome to Axon Labs! I'll help you explore what we can build together. You can answer each question yourself, upload relevant docs, or use the demo data to see the full flow.\n\nTell me — what's the main challenge you're facing with your SAP data?",
    inputPlaceholder: "Describe your main challenge...",
    prefilledAnswer: "We have SAP running across our manufacturing operations but we're drowning in data. Our procurement team spends hours pulling reports manually, and we have no way to spot trends or risks in our supplier relationships.",
    feedback: null,
    uploadHint: 'Upload a requirements doc, RFP, or pain-point summary'
  },
  {
    aiMessage: "That's a common pain point — and exactly the kind of thing we solve. Let me ask a few questions to understand your setup. What SAP modules are you currently running?",
    inputPlaceholder: "e.g., MM, PP, FI, SD...",
    prefilledAnswer: "We have MM for materials management, PP for production planning, FI for financials, and SD for sales and distribution.",
    feedback: { type: 'success', text: '✓ Great setup — MM and PP together give us a rich dataset for procurement and inventory optimization.' },
    uploadHint: 'Upload SAP landscape diagram or module list'
  },
  {
    aiMessage: "What does your current reporting look like? Are you using SAP's built-in reporting or something external?",
    inputPlaceholder: "Describe your current reporting...",
    prefilledAnswer: "Mostly manual Excel exports from SAP. A few Crystal Reports that nobody trusts anymore. Our ops team pulls data every Monday morning and spends half the day building a procurement summary.",
    feedback: { type: 'warning', text: '⚠ Half a day every week on manual reporting — that\'s exactly the kind of waste we eliminate. This is very addressable.' },
    uploadHint: 'Upload sample reports or dashboard screenshots'
  },
  {
    aiMessage: "What decisions do you wish you had better data for?",
    inputPlaceholder: "What decisions need better data?",
    prefilledAnswer: "Which suppliers are actually reliable vs. just cheap. Where we're overspending. When to reorder materials before we run out. Basically, we want the data to tell us what to do instead of just showing us what happened.",
    feedback: { type: 'success', text: '✓ "Tell us what to do, not what happened" — that\'s our philosophy exactly. This maps to 3 clear workstreams: procurement analytics, supplier risk, and inventory optimization.' },
    uploadHint: 'Upload existing KPI list or decision framework'
  },
  {
    aiMessage: "How many people will use this? And what's your timeline pressure?",
    inputPlaceholder: "Team size and timeline...",
    prefilledAnswer: "About 12 people across procurement, operations, and finance. Plus our CFO wants a high-level view. We're heading into Q2 planning and need something meaningful within 2-3 months.",
    feedback: { type: 'success', text: '✓ 12 users is ideal for a focused rollout. 2-3 month timeline aligns well with our sprint-based delivery model.' },
    uploadHint: 'Upload org chart or stakeholder list'
  }
];

const TOTAL_STEPS = STEPS.length + 2; // +2 for preview + results

export function render(container) {
  // Fresh state every render
  let currentStep = 0;
  let uploadedFiles = [];

  container.innerHTML = `
    <div style="max-width: 760px; margin: 0 auto; padding: var(--space-8) var(--space-6);">
      <div class="text-center mb-8">
        <div class="badge badge-blue mb-3">Self-Assessment Tool</div>
        <h1 style="font-size: var(--text-3xl);" class="mb-2">Tell Us What You Need</h1>
        <p class="text-secondary">Answer a few questions, upload docs, or use our demo data to see the full experience.</p>
      </div>

      <!-- Progress -->
      <div class="flex items-center gap-2 mb-6">
        <div class="progress-bar" style="flex:1;">
          <div class="progress-bar-fill" id="sa-progress" style="width: 0%; transition: width 0.4s ease;"></div>
        </div>
        <span class="text-xs text-muted" id="sa-step-label">Step 1 of ${TOTAL_STEPS}</span>
      </div>

      <!-- Conversation area -->
      <div id="sa-conversation" class="flex flex-col gap-4 mb-6" style="min-height: 300px; max-height: 50vh; overflow-y: auto; scroll-behavior: smooth;"></div>

      <!-- Input area -->
      <div id="sa-input-area" style="border-top: 1px solid var(--border); padding-top: var(--space-4);">
        <!-- Text input -->
        <textarea class="textarea" id="sa-input" placeholder="Describe your main challenge..." rows="3" style="resize: none;"></textarea>

        <!-- File upload row -->
        <div class="flex items-center gap-3 mt-3" style="flex-wrap: wrap;">
          <label class="btn btn-sm btn-ghost" style="cursor:pointer; color: var(--text-muted);" id="sa-upload-label">
            📎 Upload file
            <input type="file" id="sa-file-input" style="display:none;" accept=".pdf,.doc,.docx,.xlsx,.csv,.txt,.png,.jpg" />
          </label>
          <span class="text-xs text-muted" id="sa-upload-hint">${STEPS[0].uploadHint}</span>
          <div id="sa-uploaded-files" class="flex gap-2 flex-wrap"></div>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-between items-center mt-3">
          <div class="flex gap-2">
            <button class="btn btn-sm" id="sa-prefill-btn" style="color: var(--primary); border-color: var(--primary);">
              ✨ Use demo answer
            </button>
            <button class="btn btn-sm btn-ghost" id="sa-autorun-btn" style="color: var(--accent);">
              ⚡ Auto-fill all steps
            </button>
          </div>
          <button class="btn btn-primary" id="sa-send-btn">Continue →</button>
        </div>
      </div>

      <!-- Results area (hidden initially) -->
      <div id="sa-results" style="display:none;"></div>
    </div>
  `;

  // Show first AI message
  addAIMessage(STEPS[0].aiMessage);

  // --- Element refs ---
  const inputEl = container.querySelector('#sa-input');
  const sendBtn = container.querySelector('#sa-send-btn');
  const prefillBtn = container.querySelector('#sa-prefill-btn');
  const autorunBtn = container.querySelector('#sa-autorun-btn');
  const fileInput = container.querySelector('#sa-file-input');
  const uploadedFilesEl = container.querySelector('#sa-uploaded-files');
  const uploadHintEl = container.querySelector('#sa-upload-hint');

  // --- Handlers ---
  function updateProgress() {
    const pct = Math.min(((currentStep) / TOTAL_STEPS) * 100, 100);
    const bar = container.querySelector('#sa-progress');
    const label = container.querySelector('#sa-step-label');
    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = currentStep >= TOTAL_STEPS ? 'Assessment Complete' : `Step ${currentStep + 1} of ${TOTAL_STEPS}`;
  }

  function handleSubmit() {
    const text = inputEl.value.trim();
    if (!text && uploadedFiles.length === 0) return;

    // Show user message
    if (text) addUserMessage(text);
    if (uploadedFiles.length > 0) {
      addUploadMessage(uploadedFiles);
      uploadedFiles = [];
      uploadedFilesEl.innerHTML = '';
    }

    inputEl.value = '';

    // Show feedback
    const step = STEPS[currentStep];
    if (step?.feedback) {
      setTimeout(() => addFeedback(step.feedback), 300);
    }

    currentStep++;
    updateProgress();

    if (currentStep < STEPS.length) {
      // Next question
      setTimeout(() => {
        addAIMessage(STEPS[currentStep].aiMessage);
        inputEl.placeholder = STEPS[currentStep].inputPlaceholder;
        if (uploadHintEl) uploadHintEl.textContent = STEPS[currentStep].uploadHint;
        inputEl.focus();
        scrollConversation();
      }, 800);
    } else if (currentStep === STEPS.length) {
      showPreview(container, () => {
        currentStep++;
        updateProgress();
        showResults(container);
      });
    }
  }

  async function autoRunAll() {
    autorunBtn.disabled = true;
    autorunBtn.textContent = '⚡ Running...';
    prefillBtn.style.display = 'none';

    for (let i = currentStep; i < STEPS.length; i++) {
      inputEl.value = STEPS[i].prefilledAnswer;
      handleSubmit();
      // Wait for AI message animation
      await sleep(1200);
    }
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      uploadedFiles.push(f.name);
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.fontSize = '11px';
      chip.innerHTML = `📄 ${f.name} <span style="cursor:pointer; margin-left:4px;" onclick="this.parentElement.remove()">✕</span>`;
      uploadedFilesEl.appendChild(chip);
    });
    fileInput.value = '';
  }

  // --- Bind events ---
  sendBtn.addEventListener('click', handleSubmit);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  prefillBtn.addEventListener('click', () => {
    if (currentStep < STEPS.length) {
      inputEl.value = STEPS[currentStep].prefilledAnswer;
      inputEl.focus();
    }
  });

  autorunBtn.addEventListener('click', autoRunAll);
  fileInput.addEventListener('change', handleFileUpload);
}

// ──────────────────────────────────────
// UI Helpers
// ──────────────────────────────────────

function scrollConversation() {
  const conv = document.getElementById('sa-conversation');
  if (conv) setTimeout(() => conv.scrollTop = conv.scrollHeight, 50);
}

function addAIMessage(text) {
  const conv = document.getElementById('sa-conversation');
  if (!conv) return;
  const el = document.createElement('div');
  el.className = 'flex gap-3';
  el.style.animation = 'slideUp 0.3s ease';
  el.innerHTML = `
    <div class="avatar" style="background: var(--primary-bg); color: var(--primary); flex-shrink:0; width:36px; height:36px; font-size:var(--text-xs);">AI</div>
    <div class="card card-compact" style="flex:1;">
      <p class="text-sm" style="line-height:1.6; white-space:pre-line;">${text}</p>
    </div>
  `;
  conv.appendChild(el);
  scrollConversation();
}

function addUserMessage(text) {
  const conv = document.getElementById('sa-conversation');
  if (!conv) return;
  const el = document.createElement('div');
  el.className = 'flex gap-3 justify-end';
  el.style.animation = 'slideUp 0.3s ease';
  el.innerHTML = `
    <div class="card card-compact" style="background: var(--primary); color: white; max-width: 80%;">
      <p class="text-sm" style="line-height:1.6;">${text}</p>
    </div>
  `;
  conv.appendChild(el);
  scrollConversation();
}

function addUploadMessage(files) {
  const conv = document.getElementById('sa-conversation');
  if (!conv) return;
  const el = document.createElement('div');
  el.className = 'flex gap-3 justify-end';
  el.style.animation = 'slideUp 0.3s ease';
  el.innerHTML = `
    <div class="card card-compact" style="background: var(--bg-tertiary); max-width: 80%; border: 1px dashed var(--border);">
      <div class="text-xs text-muted mb-1">Uploaded files:</div>
      ${files.map(f => `<div class="flex items-center gap-2 text-sm"><span>📄</span>${f}</div>`).join('')}
    </div>
  `;
  conv.appendChild(el);
  scrollConversation();
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
      <p class="text-sm">${feedback.text}</p>
    </div>
  `;
  conv.appendChild(el);
  scrollConversation();
}

// ──────────────────────────────────────
// Preview & Results
// ──────────────────────────────────────

function showPreview(container, onDone) {
  const inputArea = container.querySelector('#sa-input-area');
  if (inputArea) inputArea.style.display = 'none';

  addAIMessage("Excellent — I have everything I need. Let me generate a preview of what your solution could look like...");

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
    scrollConversation();

    setTimeout(onDone, 1000);
  }, 1500);
}

function showResults(container) {
  const { feasibility } = selfAssessment;

  const bar = container.querySelector('#sa-progress');
  const label = container.querySelector('#sa-step-label');
  if (bar) bar.style.width = '100%';
  if (label) label.textContent = 'Assessment Complete';

  addAIMessage("Here's your assessment summary and a generated Spec/RFP. You can download it or send it directly to start the engagement.");

  const results = container.querySelector('#sa-results');
  if (!results) return;
  results.style.display = 'block';
  results.innerHTML = `
    <div class="card mt-4" style="animation: slideUp 0.3s ease;">
      <!-- Feasibility Score -->
      <div class="flex items-center gap-4 mb-6">
        <div class="score score-high" style="width:64px; height:64px; font-size: var(--text-2xl);">${feasibility.score}</div>
        <div>
          <h3>Feasibility Score</h3>
          <p class="text-sm text-secondary">Based on analysis of 12 similar SAP procurement projects</p>
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
        <h4 class="mb-2">Recommendation</h4>
        <p class="text-sm text-secondary" style="line-height: 1.7;">${feasibility.recommendation}</p>
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

      <!-- Generated Spec/RFP -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-3">
          <h3>Generated Spec / RFP</h3>
          <span class="badge badge-blue">AI-Generated</span>
        </div>
        <div class="card card-flat" style="background: var(--bg-secondary); font-size: var(--text-sm); line-height: 1.7; max-height: 400px; overflow-y: auto;">
          ${generateSpecRFP()}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 flex-wrap">
        <button class="btn btn-primary btn-lg" id="sa-submit-free">
          📤 Submit Free Assessment
        </button>
        <button class="btn btn-accent btn-lg" id="sa-submit-paid">
          🎯 Get Full Diagnostic — $500
        </button>
        <button class="btn btn-lg" id="sa-download-spec">
          📄 Download Spec as PDF
        </button>
      </div>
    </div>
  `;

  // Bind buttons (all show "not implemented" for the demo)
  ['sa-submit-free', 'sa-submit-paid', 'sa-download-spec'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => {
      document.getElementById('not-implemented-modal').style.display = 'flex';
    });
  });

  scrollConversation();
}

function generateSpecRFP() {
  return `
    <div style="padding: var(--space-4);">
      <h4 style="color: var(--primary); margin-bottom: var(--space-3);">SAP Intelligence Platform — Project Specification</h4>
      <p class="text-muted" style="margin-bottom: var(--space-4);">Auto-generated from self-assessment • March 2026</p>

      <h4 style="margin-bottom: var(--space-2);">1. Executive Summary</h4>
      <p style="margin-bottom: var(--space-4);">
        Mid-market manufacturer seeks AI-powered intelligence layer on top of existing SAP ECC deployment (MM, PP, FI, SD modules).
        Primary goal: replace manual procurement reporting with automated, prescriptive analytics that guide decisions rather than just describe history.
        Target user base: 12 users across procurement, operations, and finance, plus executive-level dashboards.
      </p>

      <h4 style="margin-bottom: var(--space-2);">2. Current State</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li>SAP ECC with MM, PP, FI, SD modules active</li>
        <li>Reporting: manual Excel exports + legacy Crystal Reports</li>
        <li>4+ hours/week spent on manual procurement summary generation</li>
        <li>No supplier risk monitoring or predictive capabilities</li>
        <li>No automated inventory optimization</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">3. Desired Outcomes</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li><strong>Procurement Analytics:</strong> Automated spend analysis, category trends, vendor performance scoring</li>
        <li><strong>Supplier Risk:</strong> Multi-factor risk scoring (delivery, financial, geographic, concentration, quality, price stability)</li>
        <li><strong>Inventory Optimization:</strong> Demand forecasting and reorder point recommendations</li>
        <li><strong>Executive Dashboards:</strong> Real-time KPIs with AI-generated executive briefings</li>
        <li><strong>Prescriptive Recommendations:</strong> System should recommend actions, not just display data</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">4. Technical Requirements</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li>Read-only connection to SAP ECC via RFC</li>
        <li>Data extraction from MM, PP, FI tables</li>
        <li>Support for batch and incremental data processing</li>
        <li>Web-based dashboard accessible via SSO</li>
        <li>API layer for future integrations</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">5. Stakeholders</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li>Operations Lead (primary sponsor)</li>
        <li>CFO (executive dashboard consumer)</li>
        <li>Procurement team (12 daily users)</li>
        <li>IT team (SAP access and security)</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">6. Timeline & Constraints</h4>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li>Target: meaningful results within 10-14 weeks</li>
        <li>Q2 board presentation is key milestone</li>
        <li>Phased delivery preferred (procurement first, then risk, then inventory)</li>
        <li>Sprint-based with customer review gates every 2 weeks</li>
      </ul>

      <h4 style="margin-bottom: var(--space-2);">7. Success Criteria</h4>
      <ul style="padding-left: var(--space-6);">
        <li>Eliminate manual weekly procurement report (4+ hrs/wk saved)</li>
        <li>Supplier risk scoring operational for top 50 suppliers</li>
        <li>Executive dashboard live with weekly AI-generated briefings</li>
        <li>User adoption: 10+ of 12 target users active within 30 days of launch</li>
      </ul>
    </div>
  `;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
