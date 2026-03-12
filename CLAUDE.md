# Demos

Remotion video projects for Frequency product demos and marketing content.

## Remotion Best Practices

**Always read before writing Remotion code.** The `.claude/skills/remotion-best-practices/` directory contains comprehensive Remotion rules. Start with the `SKILL.md` index, then read relevant rule files for your task:

- **Core rules (always read):** `rules/animations.md`, `rules/timing.md`, `rules/sequencing.md`, `rules/transitions.md`
- **Text:** `rules/text-animations.md`, `rules/fonts.md`, `rules/measuring-text.md`
- **Styling:** `rules/tailwind.md`, `rules/light-leaks.md`, `rules/charts.md`
- **Media:** `rules/videos.md`, `rules/audio.md`, `rules/images.md`, `rules/assets.md`
- **Structure:** `rules/compositions.md`, `rules/parameters.md`, `rules/calculate-metadata.md`

Key constraint: **All animation must be driven by `useCurrentFrame()`** — CSS transitions, CSS animations, and Tailwind `transition-*`/`animate-*` classes are forbidden in Remotion.

## Stack

- **Remotion 4.0.434** — React-based video framework
- **React 19** + **TypeScript**
- **TailwindCSS v4** (via `@remotion/tailwind-v4`)
- **Zod** for composition prop schemas

## Commands

```bash
npm run studio    # Launch Remotion Studio (preview + edit)
npm run render    # Render video to file
npm run upgrade   # Update Remotion packages
```

## Output Directory

Renders and screenshots go in `out/` (gitignored). Organize by project:

```
out/
├── frequency/          # V1 renders and screenshots
│   └── FrequencyDemo.mp4
└── frequency-v2/       # V2 renders and screenshots
    └── FrequencyDemoV2.mp4
```

Create these directories before rendering if they don't exist:
```bash
mkdir -p out/frequency out/frequency-v2
```

## Project Structure

```
src/
├── Root.tsx              # Composition registry — all videos registered here
├── index.ts              # Entry point
├── index.css             # Global styles
│
├── frequency/            # V1: Dark-themed product demo (~61s)
│   ├── DemoVideo.tsx     # Main composition (TransitionSeries of 12 scenes)
│   ├── Showcase.tsx      # Simple showcase composition
│   ├── theme.ts          # Dark color tokens, fonts, constants
│   ├── fonts.ts          # Google Font loaders (shared across projects)
│   ├── scenes/           # 12 scene components
│   └── components/       # Reusable UI (Cursor, MetricsRibbon, InfoSlideFrame)
│
└── frequency-v2/         # V2: Light-themed kinetic typography demo (~40s)
    ├── DemoVideoV2.tsx   # Main composition (TransitionSeries of 9 scenes)
    ├── theme.ts          # Light color tokens, app/pipeline data
    ├── scenes/           # 9 scene components
    └── components/       # KineticText, CountUp
```

## Videos

### FrequencyDemo (V1)
- **Style:** Dark theme, dashboard UI mockups, cursor interactions
- **Duration:** ~61s at 30fps (1830 frames)
- **Narrative:** Product walkthrough — repo selection → config → pipelines → deploy → results
- **Composition ID:** `FrequencyDemo`

### FrequencyDemoV2 (V2)
- **Style:** Light/white backgrounds, bold kinetic typography, fast-paced
- **Duration:** ~40s at 30fps (1200 frames)
- **Narrative:** Twitter hook — "Agents built apps while we slept" → stats → proof → how it works → CTA
- **Composition ID:** `FrequencyDemoV2`
- **Target:** Social media (Twitter) — accompanies launch tweet

### FrequencyShowcase
- **Style:** Simple showcase card
- **Duration:** 15s at 30fps (450 frames)
- **Composition ID:** `FrequencyShowcase`

## Conventions

- All animation driven by `useCurrentFrame()` — never CSS transitions/animations
- Spring configs: `{ damping: 200 }` for smooth fades, `{ damping: 14-18, stiffness: 140-180 }` for bouncy entrances
- Fonts loaded in `src/frequency/fonts.ts` (shared): Albert Sans (body), IBM Plex Mono (mono), Bitter (serif)
- Brand accent color: `#FF4400`
- Scene durations expressed as `t(seconds)` using `Math.round(seconds * fps)`
- Transitions use `@remotion/transitions` TransitionSeries with fade/slide presentations

## Product Context

**Frequency** is a config-driven agent orchestration runtime. Key facts for content:
- 30+ production apps shipped autonomously
- 10 parallel pipelines coordinating simultaneously
- Works with any agent (Claude Code, Codex, etc.)
- File-backed state, YAML config, git worktree isolation
- Live at cashewcrate.com
- Product URL: frequency.sh
