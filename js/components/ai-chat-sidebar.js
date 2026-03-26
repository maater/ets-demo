/**
 * Reusable AI Chat Sidebar — slide-out panel with mock AI conversation.
 * Used in: intake analysis, proposal creator, story detail, discovery prep.
 */

const CANNED_RESPONSES = [
  "I've updated the section based on your feedback. The revised version focuses more on the specific SAP integration patterns relevant to Meridian's setup.",
  "Good point. I've adjusted the risk assessment to account for the ECC 6.0 to S/4HANA migration timeline. The new version includes a portability recommendation.",
  "Based on similar engagements, I'd recommend starting with a batch extraction approach and then adding real-time capabilities in Sprint 3. This reduces initial complexity.",
  "I've restructured the timeline to front-load the procurement analytics work, since Rachel mentioned the Q2 contract renegotiations as the key driver.",
  "The supplier risk scoring model now includes 6 factors: delivery reliability, financial health, geographic risk, concentration risk, quality metrics, and price stability.",
  "I've added a section on data quality assessment. Based on 12 similar SAP MM extractions, we typically find 15-20% of records need cleanup in the first pass."
];

let responseIndex = 0;

export function openChatSidebar({ title = 'AI Assistant', context = '', messages = [] } = {}) {
  // Remove existing if open
  closeChatSidebar();

  const overlay = document.createElement('div');
  overlay.className = 'chat-sidebar-overlay';
  overlay.id = 'chat-sidebar-overlay';
  overlay.addEventListener('click', closeChatSidebar);

  const sidebar = document.createElement('div');
  sidebar.className = 'chat-sidebar';
  sidebar.id = 'chat-sidebar';
  sidebar.addEventListener('click', e => e.stopPropagation());

  const defaultMessages = messages.length > 0 ? messages : [
    { type: 'ai', text: `I have context about this item. ${context || 'How can I help you refine it?'}` }
  ];

  sidebar.innerHTML = `
    <div class="chat-sidebar-header">
      <div>
        <h3 style="font-size: var(--text-base);">${title}</h3>
        <span class="text-xs text-muted">AI-powered collaboration</span>
      </div>
      <button class="btn btn-ghost btn-icon" id="chat-close-btn" title="Close">✕</button>
    </div>
    <div class="chat-sidebar-messages" id="chat-messages">
      ${defaultMessages.map(m => renderMessage(m)).join('')}
    </div>
    <div class="chat-sidebar-input">
      <input type="text" class="input" id="chat-input" placeholder="Ask AI to help refine this..." />
      <button class="btn btn-primary" id="chat-send-btn">Send</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  // Bind events
  sidebar.querySelector('#chat-close-btn').addEventListener('click', closeChatSidebar);

  const input = sidebar.querySelector('#chat-input');
  const sendBtn = sidebar.querySelector('#chat-send-btn');

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    const messagesEl = sidebar.querySelector('#chat-messages');
    messagesEl.insertAdjacentHTML('beforeend', renderMessage({ type: 'user', text }));
    input.value = '';

    // Simulate AI typing
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message chat-message-ai';
    typingEl.innerHTML = `
      <div class="avatar avatar-sm" style="background: var(--primary-bg); color: var(--primary);">AI</div>
      <div class="chat-message-bubble animate-pulse">Thinking...</div>
    `;
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Show response after delay
    setTimeout(() => {
      typingEl.remove();
      const response = CANNED_RESPONSES[responseIndex % CANNED_RESPONSES.length];
      responseIndex++;
      messagesEl.insertAdjacentHTML('beforeend', renderMessage({ type: 'ai', text: response }));
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 1200);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // Focus input
  setTimeout(() => input.focus(), 100);
}

export function closeChatSidebar() {
  const overlay = document.getElementById('chat-sidebar-overlay');
  const sidebar = document.getElementById('chat-sidebar');
  if (overlay) overlay.remove();
  if (sidebar) sidebar.remove();
}

function renderMessage(msg) {
  const isAI = msg.type === 'ai';
  return `
    <div class="chat-message ${isAI ? 'chat-message-ai' : 'chat-message-user'}">
      <div class="avatar avatar-sm" style="background: ${isAI ? 'var(--primary-bg)' : 'var(--accent-bg)'}; color: ${isAI ? 'var(--primary)' : 'var(--accent)'};">
        ${isAI ? 'AI' : 'You'}
      </div>
      <div class="chat-message-bubble">${msg.text}</div>
    </div>
  `;
}
