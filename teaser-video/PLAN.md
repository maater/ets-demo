# Axon Labs Teaser Video — Build Plan & Storyboard

## Overview

A 45-60 second teaser video built with [Remotion](https://www.remotion.dev/) (React-based programmatic video). The video sells one idea: **"You describe your SAP problem, and we show you the solution before you ever talk to a human."**

Target output: 1920x1080 MP4, 30fps.

---

## Project Setup

### Location
`/ets-demo/teaser-video/` — a standalone Remotion project alongside the demo.

### Tech Stack
- Remotion 4.x (React + TypeScript)
- Uses simplified recreations of the demo UI (not screen recordings)
- Reuses color tokens and visual patterns from the demo's CSS

### Key Files to Create
```
teaser-video/
  package.json
  tsconfig.json
  src/
    index.ts              # Remotion entry — registerRoot
    Root.tsx              # Top-level <Composition> definitions
    Video.tsx             # Main sequence stitching all scenes
    scenes/
      Scene1_Pain.tsx     # "The Pain" — typing text on black
      Scene2_Click.tsx    # "The Click" — homepage CTA click
      Scene3_Montage.tsx  # "The Conversation" — self-assessment fast-cut
      Scene4_Wow.tsx      # "The Wow Moment" — results build
      Scene5_ZoomOut.tsx  # "The Zoom Out" — value stream pipeline
      Scene6_Loop.tsx     # "The Loop" — knowledge badge pulse
      Scene7_CTA.tsx      # "CTA" — logo + tagline
    components/
      TypingText.tsx      # Reusable typing/terminal animation
      ChipGrid.tsx        # SAP module/pain-point chip layout
      PipelineCard.tsx    # Value stream phase card (simplified)
      StepCard.tsx        # Swimlane step card (simplified)
      KBBadge.tsx         # Knowledge base bookend badge
      AxonLogo.tsx        # Axon Labs logo + branding
    styles/
      tokens.ts           # Color palette, fonts (from demo's variables.css)
      shared.ts           # Shared CSS-in-JS styles
    lib/
      timing.ts           # Frame/duration constants for each scene
```

---

## Storyboard — Scene by Scene

### Scene 1 — "The Pain" (3 seconds / 90 frames)

**Visual:** Black screen. White monospace text types out character by character:
> "Our SAP system has 10 years of procurement data. Nobody knows what to do with it."

**Animation:**
- Text types at ~40 chars/second with a blinking cursor
- Cursor blinks 2x after text completes
- Slight fade to black at end

**Audio direction:** Silent. The quiet is the point.

**Components:** `TypingText` with monospace font, white on #000.

---

### Scene 2 — "The Click" (2 seconds / 60 frames)

**Visual:** Simplified recreation of the Axon homepage hero section:
- "SAP Intelligence That Tells You What To Do" headline
- A prominent blue CTA button: "See what we'd build for you"
- Cursor (custom SVG pointer) glides to the button
- Button gets hover state (shadow lift)
- Click flash/ripple effect
- Quick zoom-in transition to next scene

**Animation:**
- 0-30f: Page visible, cursor starts from bottom-right
- 30-45f: Cursor reaches button, hover state activates
- 45-55f: Click ripple
- 55-60f: Fast zoom into button, cross-dissolve to Scene 3

**Components:** Simple hero layout div, animated cursor SVG, ripple effect.

---

### Scene 3 — "The Conversation" (8-10 seconds / 240-300 frames)

**Visual:** Montage of the self-assessment flow, sped up ~4x with smooth easing. Four beats:

**Beat 3a — Module Selection (~2.5s)**
- Grid of SAP module chips (MM, FI, SD, PP, CO, WM...)
- Three chips light up in sequence: MM → FI → SD
- Each chip transitions from gray border to blue fill with a spring animation
- Small "3 selected" counter ticks up

**Beat 3b — Pain Points (~2.5s)**
- Pain point cards appear in a staggered grid
- Cards selected: "Maverick spending", "Stock-outs", "Manual reporting"
- Each card gets a checkmark + color shift on selection
- Category labels visible: Procurement, Inventory, Reporting

**Beat 3c — Deep Dive Branch (~2s)**
- Screen transitions (slide-left) to procurement-specific questions
- Pill selectors for "Which procurement reports?" — ME2M, MB5B highlighted
- Quick flash of data access question — "CDS / OData" pill selected

**Beat 3d — Reporting Stack (~1.5s)**
- Final selection screen, fast
- "Excel + Crystal Reports" chips selected
- Transition: the whole form compresses/zooms out, results start building

**Overall feel:** Fast, confident, SAP-vocabulary-dense. The viewer should think "this thing knows my world" even if they can't read every label.

**Components:** `ChipGrid` (reusable for modules, pain points, pills).

---

### Scene 4 — "The Wow Moment" (6-8 seconds / 180-240 frames)

**Visual:** Results screen builds itself in real time (normal speed now — let it breathe).

**Beat 4a — Spec Document (~3s)**
- White card slides up from bottom
- Section headers type in one by one:
  - "Executive Summary"
  - "SAP Modules in Scope: MM, FI, SD"
  - "Primary Pain Points: Procurement visibility, stock-out risk"
- Body text fades in paragraph by paragraph (blurred → sharp)

**Beat 4b — Wedge Recommendation (~2.5s)**
- A highlighted card slides in from right with a subtle glow
- Title: "Recommended Starting Point: Procurement Intelligence"
- SAP table names appear as pills: EKKO, EKPO, EBAN, MARC
- Small tag: "Quick win — 4 week delivery"

**Beat 4c — Text Overlay (~2s)**
- Results screen dims slightly (opacity 0.7)
- Large white text fades in, centered:
  **"From problem to solution preview. No sales call."**
- Hold for 1.5s

**Components:** Card layout, typing headers, pill tags, text overlay with backdrop blur.

---

### Scene 5 — "The Zoom Out" (8-10 seconds / 240-300 frames)

**Visual:** The value stream pipeline from index.html, rendered as React components.

**Beat 5a — Pipeline Appears (~3s)**
- Black/dark background
- Six phase cards slide in from bottom, staggered left-to-right (spring animation, 150ms delay between each)
- Cards: Reach → Discover → Qualify → Propose → Deliver → Learn
- Arrows fade in between them
- Each card has its color accent (red, blue, purple, green, amber, purple)

**Beat 5b — Quick Expand Flashes (~5s)**
- Each phase card briefly "expands" — a simplified version of its detail panel fades in below it for ~0.8s, then collapses back
- Reach: channel cards converging (simplified to icons + lines)
- Discover: 4 step cards in a row
- Qualify: two-lane layout hint
- Propose: loop return banners flash
- Deliver: kanban-style cards
- Learn: knowledge base callout
- This happens in sequence, left to right, ~0.8s per phase

**Beat 5c — All Visible (~1.5s)**
- Pipeline fully visible, all cards settled
- Subtle ambient glow on each card

**Components:** `PipelineCard` (6 instances), simplified detail snippets.

---

### Scene 6 — "The Loop" (4-5 seconds / 120-150 frames)

**Visual:** The knowledge loop animates between Learn and Discover.

**Animation sequence:**
1. Knowledge Base callout in Learn phase pulses with purple glow (0.5s)
2. A particle/dot trail (purple → blue gradient) arcs from Learn card backward over the pipeline to Discover card (~1.5s)
3. Education Hub in Discover phase pulses with blue glow (0.5s)
4. The bookend badges ("Sourced from KB" / "Powers Education Hub") fade in on both ends
5. Text overlay fades in:
   **"Every engagement makes the next one smarter."**
6. Hold 1.5s

**Components:** `KBBadge`, particle trail animation (SVG path or canvas), text overlay.

---

### Scene 7 — "CTA" (3 seconds / 90 frames)

**Visual:** Clean, minimal outro.

**Animation:**
- Everything fades to white (#F3F4F6 — the demo background color)
- Axon Labs logo fades in center (blue dot + wordmark), scales from 0.9 → 1.0
- Tagline types below: **"AI-first service delivery."**
- After 0.5s pause, a subtle underlined link appears:
  **"See the full demo →"**
- Hold 1.5s, fade to black

**Components:** `AxonLogo`, `TypingText`.

---

## Duration Summary

| Scene | Name | Duration | Frames (30fps) |
|-------|------|----------|-----------------|
| 1 | The Pain | 3s | 90 |
| 2 | The Click | 2s | 60 |
| 3 | The Conversation | 9s | 270 |
| 4 | The Wow Moment | 7s | 210 |
| 5 | The Zoom Out | 9s | 270 |
| 6 | The Loop | 4.5s | 135 |
| 7 | CTA | 3s | 90 |
| **Total** | | **~37.5s** | **~1125** |

Buffer for transitions between scenes: ~5-7s total. Final video: **~42-45 seconds**.

---

## Build Order

Work scene by scene, each independently previewable in Remotion Studio:

### Phase 1 — Scaffold
1. Initialize Remotion project (`npm init video`)
2. Set up `Root.tsx` with composition config (1920x1080, 30fps)
3. Create `tokens.ts` with color palette from the demo
4. Create `timing.ts` with frame constants for each scene

### Phase 2 — Simple Scenes First
5. **Scene 1** — TypingText component + Scene1_Pain
6. **Scene 7** — AxonLogo + Scene7_CTA
7. **Scene 2** — Homepage hero + cursor animation + Scene2_Click

### Phase 3 — Complex Scenes
8. **Scene 3** — ChipGrid component + 4 beats of the montage
9. **Scene 4** — Results card build + text overlay
10. **Scene 5** — PipelineCard component + staggered entrance + expand flashes
11. **Scene 6** — Loop particle trail + badge pulse

### Phase 4 — Assembly
12. Stitch all scenes in `Video.tsx` with `<Series>` component
13. Add cross-fade transitions between scenes
14. Fine-tune timing, review in Remotion Studio
15. Render final MP4

---

## Color Palette (from demo)

```
--bg:           #F3F4F6
--text:         #1F2937
--text-muted:   #6B7280
--border:       #E5E7EB
--primary:      #2563EB   (Discover, links)
--reach:        #E11D48   (Reach phase)
--qualify:      #7C3AED   (Qualify, Learn, KB)
--propose:      #059669   (Propose, sales)
--deliver:      #D97706   (Deliver)
--ai-tag:       #2563EB
--human-tag:    #059669
--both-tag:     #C2410C
```

---

## Key Remotion APIs We'll Use

- `<Series>` — sequencing scenes
- `<Sequence>` — offsetting elements within a scene
- `useCurrentFrame()` / `useVideoConfig()` — frame-based animation
- `interpolate()` — mapping frame ranges to CSS values
- `spring()` — physics-based easing for chip selections, card entrances
- `<AbsoluteFill>` — full-screen layering
- `<Img>` — for logo SVG if needed

---

## Resume Instructions

If this conversation breaks, start a new conversation with:

> "Read `/ets-demo/teaser-video/PLAN.md` and continue building the Remotion teaser video from where we left off. Check which files exist in `teaser-video/src/` to see what's been built so far."

The todo list in the conversation tracks current progress. Each scene is independently buildable — pick up wherever the last scene left off.
