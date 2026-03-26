/**
 * Discovery Prep — editable call agenda.
 */

import { discovery } from '../../data/mock-data.js';
import { renderEditableSection, bindEditableSections } from '../../components/editable-section.js';
import { openChatSidebar } from '../../components/ai-chat-sidebar.js';

export function render(container) {
  const d = discovery;

  container.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1>Discovery Call Prep</h1>
            <p>Meridian Partners — ${d.date} • ${d.duration}</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary" id="ai-chat-btn">💬 Refine with AI</button>
            <button class="btn" onclick="document.getElementById('not-implemented-modal').style.display='flex'">📅 Schedule Call</button>
          </div>
        </div>
      </div>

      ${renderEditableSection({
        id: 'prep-questions',
        title: '5 Questions We Need Answered',
        content: d.agenda.questionsToAnswer.map((q, i) => `${i + 1}. ${q}`).join('\n')
      })}

      ${renderEditableSection({
        id: 'prep-decisions',
        title: '4 Things We Still Need to Decide',
        content: d.agenda.decisionsToMake.map((q, i) => `${i + 1}. ${q}`).join('\n')
      })}

      ${renderEditableSection({
        id: 'prep-musthave',
        title: 'Must-Have Suggestions',
        content: d.agenda.mustHaveSuggestions.map(s => `• ${s}`).join('\n')
      })}

      ${renderEditableSection({
        id: 'prep-nicetohave',
        title: 'Nice-to-Have Items',
        content: d.agenda.niceToHaveSuggestions.map(s => `• ${s}`).join('\n')
      })}

      ${renderEditableSection({
        id: 'prep-context',
        title: 'Context Summary',
        content: 'Meridian Partners is a mid-market manufacturer ($120M revenue, 850 employees) running SAP ECC 6.0 with MM, PP, FI, and SD modules. Primary pain point: manual procurement reporting consuming 4+ hours/week. Key stakeholders: Sarah Chen (Ops Lead), Rachel Torres (CFO). Timeline: Need meaningful results within 2-3 months for Q2 board presentation. Self-assessment score: 87 (Strong Fit).'
      })}
    </div>
  `;

  bindEditableSections(container);

  container.querySelector('#ai-chat-btn').addEventListener('click', () => {
    openChatSidebar({
      title: 'Discovery Prep Assistant',
      context: "I have full context from Meridian's self-assessment and can help refine the call agenda.",
      messages: [
        { type: 'ai', text: "I've prepared the discovery call agenda based on Meridian's self-assessment. Key gaps to fill: SAP version specifics, data access permissions, and priority between procurement analytics vs. supplier risk. Want me to adjust any section?" }
      ]
    });
  });
}
