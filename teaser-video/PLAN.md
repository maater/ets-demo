# Axon Labs Teaser Video — VixulCon 2026 Demo

## Overview

A ~102-second teaser video built with [Remotion](https://www.remotion.dev/) (React-based programmatic video). The video tells the story of **Sarah from Meridian Partners** discovering Axon Labs and experiencing an AI-enabled customer engagement — from first website click through proposal, delivery dashboards, and a self-improving knowledge loop.

**Output:** 1920x1080 MP4, 30fps, 3060 frames (102s).

---

## Project Structure

```
teaser-video/
  package.json
  tsconfig.json
  PLAN.md                         # This file
  public/sfx/                     # Audio assets
    mouse-click.wav               # Real mouse click SFX
    typing.wav                    # Keyboard typing SFX
    music-bg.mp3                  # Background music track (external)
    whoosh.wav, chime.wav, ...    # Synthesized SFX (generated)
  scripts/
    generate-sfx.mjs              # Generates synthesized WAV files
    generate-music.mjs            # Generates procedural backup music
  src/
    index.ts                      # Remotion entry — registerRoot
    Root.tsx                      # <Composition> definition (AxonTeaser)
    Video.tsx                     # Main <Series> stitching all scenes + SoundLayer
    lib/
      timing.ts                   # Frame constants for every scene
    styles/
      tokens.ts                   # Color palette, fonts (from demo CSS)
    audio/
      SoundLayer.tsx              # All SFX + music placement with ducking
    components/
      TypingText.tsx              # Character-by-character typing animation
      ChipGrid.tsx                # SAP module/pain-point chip grid
    scenes/
      Scene1_Pain.tsx             # 5-panel Meridian Partners narrative
      Scene2_Click.tsx            # Website landing + CTA button click
      Scene3_Montage.tsx          # Self-assessment chips + live chat
      Scene4_Wow.tsx              # AI-generated spec + wedge recommendation
      Scene5_Showcases.tsx        # Overlay beats + 3 product showcases
      Scene5_ZoomOut.tsx          # 6-phase pipeline zoom-out
      Scene6_Loop.tsx             # Knowledge loop animation
      Scene7_CTA.tsx              # Vixul closing CTA
```

---

## Scene Breakdown

### Scene 1 — Narrative (720f / 24s)

**Story:** Introduces Sarah at Meridian Partners and her SAP procurement pain.

**Visual:** 5 dark panels with staggered text reveals:
- Panel 1 (0-140f): TypingText "Meridian Partners" at 96px, subtitle "A mid-market manufacturer, 2,200 employees"
- Panel 2 (140-280f): Three stat lines fade in (10 years SAP, 8 modules, 47 reports)
- Panel 3 (280-440f): TypingText quote "Our SAP system has 10 years of procurement data. Nobody knows what to do with it." at 64px
- Panel 4 (440-590f): Supporting pain details + module pills
- Panel 5 (590-720f): "Then one day, Sarah finds Axon Labs." + chime

**Rules enforced:**
- Minimum 64px font for all overlay text
- 7 frames per word minimum reading time (~257 WPM at 30fps)

**Audio:** Ambient pad drone + whoosh transitions between panels.

---

### Scene 2 — The Click (210f / 7s)

**Story:** Sarah visits Axon's website and clicks the CTA.

**Visual:**
- 0-148f: Dark overlay narrative "Sarah from Meridian visits Axon's website and starts finding answers to her everyday problems." (64px)
- 140-158f: Website hero fades in (nav bar, headline, CTA button)
- 158-178f: Cursor glides toward "See what we'd build for you" button
- 175f: Button hover lift + shadow
- 180f: **Prominent mouse click sound** + ripple effect
- 185-210f: Gentle zoom-in (1x → 2.2x), fade out

**Audio:** Music ducks starting here. Prominent click at button press.

---

### Scene 3 — Self-Assessment + Chat (330f / 11s)

**Story:** Sarah shares details about her SAP environment. This isn't ChatGPT.

**Visual:** Chip selection montage with bottom-bar narrative overlay:
- **Bottom bar overlay** (0-200f): Semi-transparent dark bar at bottom showing "Sarah shares details about her SAP environment. **But this isn't ChatGPT.**" + subtitle. Chips are fully visible above it.
- **Beat A** (0-55f): SAP Module selection — MM, FI, SD chips highlight
- **Beat B** (55-110f): Pain Points — Maverick spending, Stock-outs, Manual reporting
- **Beat C** (110-150f): Procurement deep dive — report pills + data access
- **Beat D** (150-190f): Reporting Stack — compress transition
- **Beat E** (190-330f): Live Chat — 4 messages showing real conversation about S/4HANA migration

**Audio:** Mouse clicks on each chip selection. Typing sounds during user chat messages. Music remains ducked.

---

### Scene 4 — The Wow Moment (300f / 10s)

**Story:** Sarah gets an AI-generated project preview tailored to her exact SAP environment.

**Visual:**
- 0-115f: Dark overlay "And Sarah gets a project preview." + "AI-generated. Tailored to her exact SAP environment." (64px)
- Spec document builds: section headers, content paragraphs
- Wedge recommendation card slides in: "Procurement Intelligence" with SAP table pills (EKKO, EKPO, EBAN, MARC)
- Timeline and expert review button
- 205-300f: End overlay "From problem to solution preview. Before any sales call." (64px)

**Audio:** Music fades back to full volume. Clicks on spec sections appearing.

---

### Scene 5a — Product Showcases (870f / 29s)

**Story:** "What you just experienced was one step. Imagine an entire customer engagement that is AI-enabled."

**Visual — Overlay Beats (0-210f):**
- Beat 1 (0-100f): "What you just experienced was **one step** in this engagement."
- Beat 2 (100-210f): "Imagine an entire customer engagement that is **AI-enabled.**"

**Visual — Showcase 1: Interactive Proposal (210-510f / 10s):**
- Mock proposal UI with sidebar TOC (6 sections), "Draft for Review" badge
- Main content: "Recommended Approach" with 3 numbered phases
- AI Suggestion highlight box with phased rollout recommendation
- "AI Confidence: 94%" badge in sidebar
- Bottom label: "An Interactive, AI-Enabled Proposal"

**Visual — Showcase 2: Engagement Control Tower (510-720f / 7s):**
- Dashboard with 4 metric cards: Sprint Velocity (34 pts), Risk Score (Low), Budget Burn (67%), Timeline (Sprint 3)
- Project Timeline with milestone dots (Kickoff through Go-Live)
- Recent Activity feed (agent PRs, approvals, AI flags)
- Bottom label: "A Live Engagement Control Tower"

**Visual — Showcase 3: Customer Dashboard (720-870f / 5s):**
- Customer portal with health/stories/milestones/sprint metric cards
- Deliverables table with status pills (Delivered, In Review, In Progress, Upcoming)
- "Last updated: 2 min ago" badge
- Bottom label: "An Always Up-to-Date Customer Dashboard"

**Audio:** Whoosh + chime transitions between showcases.

---

### Scene 5b — Pipeline Zoom Out (270f / 9s)

**Story:** The full 6-phase AI-first value stream.

**Visual:**
- Pipeline fades in with 6 phase cards: Reach → Discover → Qualify → Propose → Deliver → Learn
- Cards enter with spring animation (staggered 8f apart)
- Arrows fade in between cards
- Sequential "flash-expand" — each card briefly highlights with its detail panel (30f per phase)
- Bottom text (64px): "All steps are **AI-enabled** for both Sarah and the service provider."
- Legend: AI-led / Human-led / Human + AI

**Audio:** Chime on entrance, clicks on card highlights.

---

### Scene 6 — Knowledge Loop (180f / 6s)

**Story:** And Axon Labs keeps getting smarter.

**Visual:**
- Circular diagram: Discover → Qualify → Propose → Deliver → Learn → back to Discover
- Arc trail animation from Learn back to Discover (SVG animated path)
- Text: "And Axon Labs keeps getting smarter." (64px)

**Audio:** Pings and chime.

---

### Scene 7 — CTA (180f / 6s)

**Story:** Axon Labs is hypothetical, but Vixul builds companies like this.

**Visual:**
- Axon Labs logo (blue square + wordmark) fades in with spring scale
- Tagline (64px): "Axon Labs is a hypothetical company, but these are exactly the kind of companies we're building at **Vixul**."
- CTA button: "Learn more about this vision →"

**Audio:** Chime + ping. Music fades out over final 3s.

---

## Timing Summary

| Scene | Name | Frames | Duration | Start Frame |
|-------|------|--------|----------|-------------|
| 1 | Narrative | 720 | 24s | 0 |
| 2 | The Click | 210 | 7s | 720 |
| 3 | Self-Assessment + Chat | 330 | 11s | 930 |
| 4 | Spec Preview | 300 | 10s | 1260 |
| 5a | Product Showcases | 870 | 29s | 1560 |
| 5b | Pipeline Zoom Out | 270 | 9s | 2430 |
| 6 | Knowledge Loop | 180 | 6s | 2700 |
| 7 | CTA | 180 | 6s | 2880 |
| **Total** | | **3060** | **102s** | |

---

## Audio Design

### Sound Effects
- **Mouse clicks:** Real recorded WAV (`mouse-click.wav`) — used for all chip selections, button presses, card interactions
- **Typing:** Real recorded WAV (`typing.wav`) — used during chat user messages
- **Synthesized SFX** (generated by `scripts/generate-sfx.mjs`):
  - `whoosh.wav` — filtered noise sweep for transitions
  - `chime.wav` — major third interval for reveals
  - `ping.wav` — high sine for knowledge loop
  - `success.wav` — ascending three-note arpeggio
  - `pad.wav` — 5s ambient drone for Scene 1
  - `click.wav` / `pop.wav` / `tap.wav` — soft synthesized alternatives (currently unused)

### Background Music
- External track: `music-bg.mp3` (royalty-free, ~3+ minutes)
- **Fade-in:** 2s ramp at video start
- **Ducking:** Music drops to ~18% volume when Sarah is interacting (Scene 2 website → end of Scene 3), then fades back to full at Scene 4
- **Fade-out:** 3s ramp at video end

### Volume Levels
- Music: 0.22 (full), 0.04 (ducked)
- Mouse clicks: 0.12-0.35 (button click loudest)
- Whoosh/chime/ping: 0.05-0.08
- Typing: 0.15

---

## Design Rules

1. **Minimum 64px font** for all overlay/narrative text (UI mockup elements exempt)
2. **7 frames per word** minimum reading time (~257 WPM at 30fps)
3. **`showInTimeline={false}`** on all `<Audio>` and `<Sequence>` wrapping audio to prevent Studio waveform crashes
4. **Composition ID is `AxonTeaser`** (not `TeaserVideo`)

---

## Commands

```bash
# Start Remotion Studio (dev preview)
npm run studio              # Opens on port 3123

# Render a single frame for verification
npx remotion still --comp=AxonTeaser --frame=960 --output=test.png

# Render final video
npx remotion render --comp=AxonTeaser --output=axon-teaser.mp4

# Regenerate synthesized SFX
node scripts/generate-sfx.mjs

# Regenerate backup procedural music
node scripts/generate-music.mjs
```

---

## Resume Instructions

If continuing work in a new conversation:

> "Read `/ets-demo/teaser-video/PLAN.md` and continue building the Remotion teaser video. Check `src/lib/timing.ts` for current frame constants and `src/Video.tsx` for scene structure."

Each scene is independently previewable in Remotion Studio. Use `npx remotion still --comp=AxonTeaser --frame=N` to verify specific frames.
