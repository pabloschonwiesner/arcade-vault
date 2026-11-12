# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Arcade Vault** is a retro arcade gaming portal. The goal is to migrate a fully working vanilla-React prototype (in `references/templates/`) into a Next.js 16 App Router application.

The prototype is the source of truth for UI, design, and behavior — all screens are implemented there and should be ported faithfully.

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run lint     # ESLint
```

No test suite is configured yet.

## Skills

Usa siempre /frontend-design para diseñar la interfaz de usuario.

## Architecture

### Stack
- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS v4**
- Tailwind is loaded via `@tailwindcss/turbopack` (configured in `next.config.ts`); import it with `@import "tailwindcss"` in CSS files, not the old `@tailwind` directives.
- Fonts: Geist Sans + Geist Mono via `next/font/google` (already wired in `app/layout.tsx`).

### Prototype reference (`references/templates/`)
The vanilla prototype is a single-page app with hash-based routing and no build step. Key files:

| File | What it contains |
|---|---|
| `app.jsx` | Root component, routing state, user auth (localStorage), score saving |
| `data.jsx` | `GAMES` array, `CATS` filter list, `seededScores()` leaderboard generator |
| `nav.jsx` | Top nav with responsive hamburger panel |
| `biblioteca.jsx` | Game library grid with category filter and 3D tilt card effect |
| `detalle.jsx` | Game detail page |
| `reproductor.jsx` | In-browser game player |
| `auth.jsx` | Login / sign-up form (mock — no real backend) |
| `salon.jsx` | Hall of Fame leaderboard |
| `styles.css` | Full CSS theme (all custom properties, background effects, components) |

### Design system (from `styles.css`)
CSS custom properties define the full palette and typography — carry these into the Next.js global CSS:

```
--bg: #0a0a0f  --bg-2: #0f0f18  --bg-3: #15151f
--cyan: #00f5ff  --magenta: #ff006e  --yellow: #f5ff00  --green: #00ff88
--gold: #ffcf3a  --silver: #c7d0e0  --bronze: #d97a3a
--pixel: "Press Start 2P"  --mono: "JetBrains Mono" / "Courier Prime"
```

Background uses an animated perspective grid + scanline overlay rendered via `.av-bg` and `.av-noise` fixed divs (see `styles.css` for the CSS; they should live in the root layout).

### Routing strategy
The prototype uses hash routing. In Next.js, map each route to a file-system route:

| Prototype route | Next.js route |
|---|---|
| `biblioteca` | `/` (or `/biblioteca`) |
| `detalle?id=X` | `/games/[id]` |
| `player?id=X` | `/games/[id]/play` |
| `auth` | `/auth` |
| `salon` | `/salon` |

### State & persistence
- User session stored in `localStorage` key `av_user` (`{ name: string }`).
- Scores stored in `localStorage` key `av_scores`.
- No backend — everything is client-side mock data from `data.jsx`.