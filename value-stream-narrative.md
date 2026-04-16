# Axon Labs — Value Stream Narrative
## For the demo coding agent: how the customer journey connects across pages

This document tells the story of a single customer engagement — Meridian Partners — from first visit to continuous innovation. Each step maps to a specific page in the demo app. Use it to understand the flow, what data passes between screens, and which actions trigger transitions to the next stage.

All routes are relative to the app root and match the hash-based routing convention already in use (e.g. `#/public/home`).

---

## The Story

Meridian Partners is a mid-size manufacturer. Their ops lead, Sarah Chen, has a nagging problem: their SAP system holds a goldmine of procurement and inventory data, but nobody can tell them what to do with it. They want something that surfaces decisions, not just dashboards.

Here is how that problem becomes a delivered product — and how it keeps improving after delivery.

---

## Phase 1 — Discover & Qualify

### Sarah finds Axon and describes her problem

Sarah lands on Axon's public homepage at `#/public/home`. She reads the value proposition ("SAP Intelligence That Tells You What To Do"), scans some outcome metrics from past engagements, and clicks the primary CTA: "See what we'd build for you."

This takes her to `#/public/self-assessment`.

The self-assessment is not a form. It's a guided AI conversation. Sarah types her problem in her own words. The system asks one clarifying question at a time — which SAP modules she runs, what decisions she wishes she had better data for, how many people currently touch this data. As she answers, the interface gives her real-time feedback: feasibility signals, best-practice nudges, gap identification. By the end, she sees a rough preview of what her solution could look like — the "wow moment."

She submits. The system confirms receipt and gives her a timeline.

**Data that flows forward:** Sarah's full conversation transcript, the feasibility score, the preview mockup, and Meridian's company info all land directly in the intake pipeline. Nothing is re-entered manually.

---

### The Axon team qualifies the submission

James Park (Axon sales) opens `#/sales/submission-detail`. He sees Sarah's transcript, the AI-generated pre-qualification report (fit score, complexity estimate, red flags, similar past engagements), and the preview that was shown to Sarah. He clicks "Request Full Analysis" — the AI produces a detailed technical feasibility deep-dive with a recommended approach. James can edit any section via the chat sidebar, then clicks "Approve & Schedule Discovery."

This transitions the submission card in the pipeline from "Ready for Human Review" to "Discovery Scheduled."

---

### Preparing for the conversation

Before the call, James opens `#/sales/discovery-prep`. The system has auto-generated a structured agenda: five questions that need answering, four things still to decide, must-have suggestions, nice-to-haves, and a full context summary so nothing already known gets asked again. James edits a few items and books the call.

---

## Phase 2 — Propose & Agree

### The discovery call

During the call, James works from a split-screen interface (part of `#/sales/discovery-prep` or a dedicated call view). The left panel drives the conversation — each agenda item is clickable, with context for the facilitator and relevant patterns from past engagements. The right panel captures context in real time: decisions, facts, risks, open questions. A running "context completeness" score tells James when they have what they need.

Post-call, the system produces an auto-generated context report and feeds it directly into proposal generation.

**Data that flows forward:** Everything captured in the call — decisions made, open questions, risks, the updated prototype — passes to the proposal creator without re-entry.

---

### Building the proposal

James opens `#/sales/proposal-creator`. The AI has already drafted the full proposal from the discovery context: executive summary, approach, epics and stories, timeline, milestones, pricing, risks, and team. James refines it using the chat sidebar ("make the timeline more conservative"), reviews the epic and story cards, configures the subscription tier, and clicks "Approve & Send."

The proposal is now live for the customer.

---

### Sarah reviews and approves

Sarah opens `#/customer/proposal-viewer`. This is not a PDF — it's an interactive document. She can jump to any section, expand each epic to see full detail and mockup, and click any paragraph to ask a question inline. Simple questions get answered immediately by AI; complex ones get flagged for James.

She flags two items as concerns, suggests a change to the inventory epic, and — satisfied — clicks "Approve." The audit trail captures her approval with timestamp.

**What happens next:** Approval triggers the engagement to go active. The delivery Kanban is populated with all approved epics and stories. The customer portal becomes live.

---

## Phase 3 — Deliver & Approve

### Work begins

Maria Lopez (Axon delivery lead) opens `#/delivery/delivery-kanban`. The board shows all stories across columns: Backlog → Sprint Ready → In Progress (Agent) → In Progress (Human) → Agent Review → Human Review/PR → Customer Review → Done.

Specialized agents pick up stories from the sprint. The Research Agent, Coding Agent, and Testing Agent work in parallel, 24/7. As each agent completes a task, the story moves to "Agent Review."

---

### Humans ensure quality

When agent output lands in "Human Review/PR," Maria opens `#/delivery/pr-review`. She sees a git-style diff — what the agent produced vs. the previous version. She works through the auto-generated review checklist (security, data validation, performance). She adds a comment on a specific section, then clicks "Approved" — her name is on it.

Nothing ships to the customer without a human approval. This is the accountability gate.

---

### Loop A begins here — engineers surface ideas

As Maria and the other engineers implement stories and review agent output, they spot improvements — a better approach to the supplier risk engine, a UI pattern that would save Sarah's team clicks every day. They also run early demos for Sarah mid-sprint.

Sarah watches the demo and raises two new requests: she wants the procurement view filterable by supplier region, and she wants a weekly digest email.

These new items go straight back to the backlog as new stories — directly into Phase 2's "Reviews & Prioritizes" step in the customer portal. The loop closes without interrupting the current sprint.

**This is Loop A.** Mid-delivery feedback — from engineers implementing and from customers seeing early demos — continuously feeds new items into the backlog.

---

### Sarah watches progress in real time

Sarah opens `#/customer/dashboard`. She sees the current sprint progress, items needing her attention (approvals, questions from the team), her subscription concurrency usage, and the next milestone ETA. No status meetings needed — everything she'd ask about in a standup is here.

She opens `#/customer/approvals` when she gets a notification that three deliverables are ready for her review. She steps through each one — seeing what was built, the acceptance criteria, and a preview — and approves all three.

---

## Phase 4 — Learn & Innovate

### The product is live; learning begins

It's Week 12. Meridian's team is using the delivered SAP intelligence tool daily. The Usage Insights Agent monitors session patterns, feature usage, friction points, and errors automatically. It notices that users spend 3x longer on the supplier risk view than procurement, and that 12 users have tried to export data in a format that doesn't exist yet.

---

### Loop B — post-usage intelligence flows back

The Usage Insights Agent surfaces these observations to the Admin view at `#/admin/agent-monitoring`. The delivery team reviews them. Approved insights become new backlog proposals — structured mini-cards that appear in Sarah's customer portal under "AI Suggestions."

Sarah opens her portal, reads the suggestions ("We noticed your team uses supplier risk more than procurement — here's a proposed expansion"), decides which ones to act on, and clicks "Add to backlog" on the ones she wants.

These items land directly back in the Phase 2 proposal review flow — the same "Reviews & Prioritizes" step — where Sarah can prioritize them against existing backlog items. A new sprint begins. The cycle repeats.

**This is Loop B.** Post-usage data — end-user behaviour plus knowledge base best practices — generates AI improvement proposals. The customer decides what to act on. Everything feeds back into the backlog and a new proposal cycle.

---

### The knowledge base compounds every engagement

The Admin view at `#/admin/knowledge-base` shows the growing repository of learnings: playbooks from agent outputs, integration patterns discovered by engineers, usage signals from deployed tools, best practices assembled from every engagement.

Every time an agent completes a task, every time a human approves a PR with notes, every time the Usage Insights Agent detects a pattern — the knowledge base grows. When the next customer goes through the self-assessment, the AI pre-qualification draws on these patterns. When the next proposal is drafted, the AI uses them to suggest epics and estimate effort. Each engagement makes every future engagement smarter.

---

## Route Reference

| Phase | Actor | Page | Route |
|-------|-------|------|-------|
| Discover | Customer (Sarah) | Public homepage | `#/public/home` |
| Discover | Customer (Sarah) | Self-assessment conversation | `#/public/self-assessment` |
| Qualify | Sales (James) | Submission detail & AI pre-qual | `#/sales/submission-detail` |
| Qualify | Sales (James) | Discovery call prep & agenda | `#/sales/discovery-prep` |
| Propose | Sales (James) | Proposal creator (Axon side) | `#/sales/proposal-creator` |
| Propose | Customer (Sarah) | Proposal viewer & approval | `#/customer/proposal-viewer` |
| Deliver | Customer (Sarah) | Customer dashboard & sprint view | `#/customer/dashboard` |
| Deliver | Customer (Sarah) | Approvals & deliverable review | `#/customer/approvals` |
| Deliver | Delivery (Maria) | Delivery Kanban (story board) | `#/delivery/delivery-kanban` |
| Deliver | Delivery (Maria) | PR review & human approval gate | `#/delivery/pr-review` |
| Learn | Admin | Agent monitoring & control tower | `#/admin/agent-monitoring` |
| Learn | Admin | Knowledge base management | `#/admin/knowledge-base` |

---

## Key Data Handoffs

These are the moments where data must flow between pages without manual re-entry. The demo should make these feel seamless.

**Self-assessment → Submission detail.** The full conversation transcript, feasibility score, preview mockup, and company info from `#/public/self-assessment` must populate the submission card in `#/sales/submission-detail` automatically.

**Submission detail → Discovery prep.** After James approves a submission, the context (company info, AI pre-qual findings, open questions) pre-populates the discovery prep agenda at `#/sales/discovery-prep`.

**Discovery prep → Proposal creator.** Everything captured in the discovery call — decisions, facts, risks, prototype updates — must be present as the starting context for `#/sales/proposal-creator` with no re-entry.

**Proposal creator → Customer proposal viewer.** When James sends the proposal, `#/customer/proposal-viewer` renders exactly what James sees in the preview — same structure, same epics, same pricing — in the interactive customer format.

**Proposal approval → Delivery Kanban.** Sarah's approval in `#/customer/proposal-viewer` triggers the Kanban at `#/delivery/delivery-kanban` to populate with all approved stories.

**Loop A (Engineer/demo feedback → Backlog).** New items identified in `#/delivery/delivery-kanban` or `#/delivery/pr-review` during implementation and early demos feed directly into the backlog in `#/customer/dashboard` and the proposal review flow in `#/customer/proposal-viewer` (or a backlog management sub-view).

**Loop B (Usage insights → Backlog).** Signals detected at `#/admin/agent-monitoring` are reviewed by the delivery team and, when approved, appear as AI suggestions in the customer's portal at `#/customer/dashboard`, routing to the backlog prioritization flow.

---

## What the Value Stream Diagram Shows vs. What the Demo Shows

The value stream diagram (`value-stream.html`) is the conceptual overview — four phases, two lanes per phase, two innovation loops. It is the map.

The demo (`https://maater.github.io/ets-demo`) is the territory — every card in the diagram corresponds to one or more screens in the app. When using the value stream as a navigation control inside the demo, clicking a card should deep-link to the corresponding route using the table above.

The two loops in the diagram should be tangible in the demo:
- **Loop A** is visible when a new story card appears in the backlog mid-sprint as a result of an engineer or demo-session discovery.
- **Loop B** is visible when an AI suggestion card appears in the customer portal sourced from usage monitoring.

Both loops land in the same place: the backlog prioritization view inside the customer portal, which maps to the "Reviews & Prioritizes" step in Phase 2 of the value stream.

---

*Axon Labs · A Vixul Portfolio Company · VixulCon 2026*
