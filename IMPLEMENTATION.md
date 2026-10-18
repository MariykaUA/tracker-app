# Tracker App: Implementation Guide

A personal mobile-first tracker for **sleep**, **steps**, **mood**, **anxiety**, **crying** and **one thing worth celebrating**, with a daily check-in, year/month/week overviews per tracker, and a year archive that builds itself automatically.

**New here?** Follow `START-HERE.md` for the step-by-step setup (GitHub, Firebase, Claude in the terminal, Vercel). `CLAUDE.md` holds the rules Claude follows.

**Design source:** [Tracker App Prototype](https://claude.ai/artifact/PqV9nUy4sCuekuDvG6ucVV) (screens, flows, copy, character) built on the [Tracking Journal design system](https://claude.ai/artifact/CStLQFhpp2FqAw5AXyPwwf). An exported copy lives in `design/` in the repo (see `design/README.md`), so Claude in the terminal can read it. See [section 12](#12-screens-and-components-map).

**Stack:** Vue 3 · TypeScript · Vite · Vue Router · Pinia · SCSS · Firebase (Auth + Firestore) · GitHub · Vercel

---

## Project rules

These apply to everyone working on the repo, including AI assistants.

1. **Always meet WCAG 2.2 level AA.** Every screen and component follows [section 7](#7-accessibility-wcag-22-aa). The one exception is colour: prototype colours are used as they are (rule 5). No feature is "done" until it passes the accessibility definition of done.
2. **Don't run tests unless asked.** AI assistants write code and tests when requested, but never run `npm run test:unit`, other test commands, or test-only builds unless Mariia explicitly asks for it in that request.
3. **Always create a new branch for a new task.** Never work directly on `main`. Branch naming in [section 13](#13-git-workflow).
4. **Write good commits.** Small, one change each, Conventional Commits format, explaining why. Rules and examples in [section 13](#13-git-workflow).
5. **Build exactly from the design prototype.** The [Tracker App Prototype](https://claude.ai/artifact/PqV9nUy4sCuekuDvG6ucVV) is the source of truth for every screen, flow, component, colour, font, spacing, radius, shadow, animation, icon, illustration and piece of copy, together with the [Tracking Journal design system](https://claude.ai/artifact/CStLQFhpp2FqAw5AXyPwwf) it uses. Don't invent screens, change layouts or rewrite copy. **Always use the prototype's colours, fonts, spacing, radii and shadows exactly as they are.** They win over the design system's `tokens.json` and are never changed to fix contrast; the known contrast gaps are listed in section 6. If something is missing from the prototype, ask Mariia before deciding.

---

## Table of contents

1. [Principles](#1-principles)
2. [Prerequisites](#2-prerequisites)
3. [Create the project and repo](#3-create-the-project-and-repo)
4. [Folder structure](#4-folder-structure)
5. [Conventions](#5-conventions)
6. [SCSS setup](#6-scss-setup)
7. [Accessibility (WCAG 2.2 AA)](#7-accessibility-wcag-22-aa)
8. [Firebase setup](#8-firebase-setup)
9. [Data model and how years work](#9-data-model-and-how-years-work)
10. [Data layer code](#10-data-layer-code)
11. [State with Pinia](#11-state-with-pinia)
12. [Screens and components map](#12-screens-and-components-map)
13. [Git workflow](#13-git-workflow)
14. [Deployment](#14-deployment)
15. [Build order checklist](#15-build-order-checklist)

---

## 1. Principles

- **One job per layer.** Components show UI. Stores hold state. Services talk to Firebase. Utils are pure functions. A component never imports Firestore directly.
- **Dates are the source of truth.** Every entry is keyed by its local date (`YYYY-MM-DD`). There is no "new year" setup, and years are just filters.
- **Calculate, don't store, derived data.** Year recaps (averages, totals) are computed from the entries, so they can never go out of sync.
- **Small components.** If a component passes ~150 lines or does two things, split it.
- **Design tokens first.** Colors, spacing and type live in SCSS tokens. Components never hard-code hex values.
- **Accessible by default.** WCAG 2.2 AA is a requirement for every feature, built in from the first component, not added at the end.

---

## 2. Prerequisites

| Tool | Notes |
|---|---|
| Node.js | Current LTS (22 or newer). Check with `node -v` |
| npm | Comes with Node |
| Git + GitHub account | Repo hosting |
| VS Code | Recommended extensions: **Vue - Official**, **ESLint**, **Prettier**, **SCSS IntelliSense** |
| Firebase account | Free Spark plan is enough |

---

## 3. Create the project and repo

### 3.1 Scaffold with create-vue

```bash
npm create vue@latest tracker-app
```

Answer the prompts:

| Prompt | Answer | Why |
|---|---|---|
| TypeScript | **Yes** | Typed entries and tracker definitions catch mistakes early |
| JSX | No | Not needed with SFCs |
| Vue Router | **Yes** | One route per tracker |
| Pinia | **Yes** | Shared state (user, entries, selected year) |
| Vitest | **Yes** | Unit tests for `utils/` (date and stats logic) |
| End-to-end testing | No | Overkill for now |
| ESLint | **Yes** | Catches mistakes |
| Prettier | **Yes** | Consistent formatting |

```bash
cd tracker-app
npm install
npm install firebase
npm install -D sass-embedded
npm run dev
```

### 3.2 Clean the starter

Delete the demo content: `src/components/HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, the `icons/` folder, `src/views/AboutView.vue`, and the starter CSS in `src/assets/`. Empty `App.vue` down to `<RouterView />`.

### 3.3 Push to GitHub

Create an **empty** repo on GitHub named `tracker-app` (no README, no .gitignore, create-vue already made one). Then:

```bash
git init
git add .
git commit -m "chore: scaffold Vue project"
git branch -M main
git remote add origin https://github.com/<your-username>/tracker-app.git
git push -u origin main
```

---

## 4. Folder structure

```
tracker-app/
├── public/
├── src/
│   ├── main.ts                  # App entry: Vue, Pinia, Router, global styles
│   ├── env.d.ts                 # Types for import.meta.env (Firebase keys)
│   ├── App.vue                  # Shell: skip link, live region, <RouterView>, <BottomNav>
│   │
│   ├── firebase/
│   │   └── index.ts             # Initialises Firebase app, auth, db
│   │
│   ├── services/                # The ONLY files that talk to Firebase
│   │   ├── auth.service.ts      # signIn, createAccount, signOut (username + password)
│   │   ├── time.service.ts      # current time from the server, not the phone
│   │   └── entries.service.ts   # saveDay, loadYear, loadYears
│   │
│   ├── stores/                  # Pinia: shared state + actions
│   │   ├── auth.store.ts
│   │   └── entries.store.ts
│   │
│   ├── utils/                   # Pure functions, unit tested
│   │   ├── date.ts              # toDateKey(), daysInMonth(), monthLabel()
│   │   └── stats.ts             # yearRecap(), averageSleep()
│   │
│   ├── types/
│   │   └── entry.ts             # Entry, DayValues, Mood, Anxiety… (section 10)
│   │
│   ├── constants/
│   │   ├── trackers.ts          # The 5 tracker definitions: levels, labels, colours, copy (from the prototype)
│   │   └── goals.ts             # SLEEP_GOAL = 8, STEP_GOAL = 15000 (prototype defaults)
│   │
│   ├── router/
│   │   └── index.ts             # Routes + page titles
│   │
│   ├── views/                   # One per route, composes components
│   │   ├── HomeView.vue         # "Your week": highlight card + 5 tracker cards
│   │   ├── TrackerView.vue      # One view for all 5 trackers: Calendar / Month / Week
│   │   ├── OneThingView.vue     # "One thing of today" + earlier days
│   │   ├── CheckinView.vue      # 6-step daily check-in (also edits a missed day)
│   │   └── DoneView.vue         # "You're done for today!" summary
│   │
│   ├── components/
│   │   ├── base/                # Generic, no app logic
│   │   │   ├── BaseButton.vue   # primary / light / ghost / tab variants
│   │   │   ├── GlassCard.vue
│   │   │   ├── RangeSlider.vue  # hours slept, how rested
│   │   │   ├── NumberStepper.vue # steps field with −500 / +500
│   │   │   └── ChoiceTiles.vue  # radio group of coloured tiles (mood, anxiety, crying)
│   │   ├── layout/
│   │   │   ├── BottomNav.vue    # Log now · Today · One thing
│   │   │   └── ProgressStepper.vue # "Question 2 of 6"
│   │   ├── home/
│   │   │   ├── HighlightCard.vue
│   │   │   └── TrackerWeekCard.vue
│   │   ├── calendar/            # Shared by all five trackers
│   │   │   ├── RangeTabs.vue    # Calendar · Month · Week
│   │   │   ├── YearGrid.vue     # 12 × 31 year in pixels
│   │   │   ├── MonthCalendar.vue
│   │   │   ├── WeekBars.vue
│   │   │   ├── TrackerLegend.vue
│   │   │   └── PeriodSwitcher.vue # ‹ October 2026 › / ‹ 2026 ›
│   │   ├── checkin/             # One component per check-in step
│   │   │   ├── SleepStep.vue
│   │   │   ├── StepsStep.vue
│   │   │   ├── MoodStep.vue
│   │   │   ├── AnxietyStep.vue
│   │   │   ├── CryingStep.vue
│   │   │   └── OneThingStep.vue
│   │   └── mascot/              # The character from the prototype's Character sheet, as Vue SVG components
│   │
│   ├── assets/
│   │   └── icons/               # Tracker icons copied from design/prototype/assets
│   │
│   └── styles/
│       ├── _tokens.scss         # Colors, spacing, radius, type
│       ├── _mixins.scss         # Breakpoints, focus ring, etc.
│       ├── _reset.scss
│       └── main.scss            # Imports reset + global base styles
│
├── design/                      # Exported prototype: screens, character, icons, tokens (rule 5)
├── .env.local                   # Firebase keys (never committed)
├── .env.example                 # Same keys, empty values (committed)
├── firestore.rules              # Security rules (committed)
├── vercel.json                  # SPA rewrite for Vercel (section 14)
├── IMPLEMENTATION.md            # This file
├── START-HERE.md                # Step-by-step setup
├── CLAUDE.md                    # Rules Claude reads automatically
└── README.md
```

**Rule of thumb for "where does this go?"**

| If it… | Put it in |
|---|---|
| Calls Firestore or Auth | `services/` |
| Is needed by more than one view | `stores/` |
| Takes input and returns output, no side effects | `utils/` |
| Is a whole screen | `views/` |
| Could be reused in another app unchanged | `components/base/` |
| Is a type or interface shared by several files | `types/` |

---

## 5. Conventions

### Naming

- **Components:** PascalCase, multi-word (`MonthCalendar.vue`, not `Calendar.vue`). Base components start with `Base`.
- **Views:** end with `View` (`HomeView.vue`).
- **Services/stores:** `name.service.ts`, `name.store.ts`.
- **Pinia stores:** `useEntriesStore`, `useAuthStore`.
- **CSS classes:** BEM inside components (`.month-calendar__day--today`).

### Component shape

Always use `<script setup lang="ts">` and keep the block order the same:

```vue
<script setup lang="ts">
// 1. imports  2. types  3. props/emits (defineProps<…>(), defineEmits<…>())  4. state  5. computed  6. functions
</script>

<template>
  <!-- markup -->
</template>

<style scoped lang="scss">
/* tokens are available globally, see section 6 */
</style>
```

### TypeScript

- **Strict mode stays on** (create-vue's default `tsconfig`). No `any`; use `unknown` and narrow it if a type really isn't known.
- **Shared types live in `src/types/`** and are imported with `import type`.
- **Props and emits are typed:** `defineProps<{ trackerId: TrackerId }>()`, `defineEmits<{ save: [values: Partial<DayValues>] }>()`.
- **Tracker definitions are typed** (`constants/trackers.ts` exports `Record<TrackerId, TrackerDef>`), so a missing label or colour is a compile error.
- `npm run type-check` (added by create-vue) checks the whole project; run it before pushing.

### Props down, events up

Forms emit values (`emit('save', data)`). Views catch the event and call the store. This keeps forms reusable and testable.

### Imports

Use the `@` alias (already configured by create-vue): `import { toDateKey } from '@/utils/date'`.

---

## 6. SCSS setup

Make tokens available in every component without importing them each time. In `vite.config.ts`:

```ts
export default defineConfig({
  // ...existing config
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/tokens" as *;\n@use "@/styles/mixins" as *;\n`,
      },
    },
  },
})
```

Only put **variables and mixins** in `_tokens.scss` / `_mixins.scss`. They're injected into every component, so actual CSS rules there would be duplicated. Global CSS goes in `main.scss`, imported once in `main.ts`.

**`_tokens.scss`** takes its values from the **prototype's screens** (rule 5). The prototype has moved on from the design system's published `tokens.json` (e.g. page background `#f0e9f4` in the screens vs `#fbe6ee` in the tokens), so copy values from the prototype artboards, and use the design system for anything the screens don't show.

Starting values read from the prototype:

```scss
// Colours: base (from the prototype screens)
$color-bg: #f0e9f4;          // page background
$color-card: #ffffff;        // check-in and tracker cards
$color-ink: #3f2d5c;         // main text: 10.2:1 on bg, 12.1:1 on card
$color-ink-soft: #5a4779;    // secondary text: 6.8:1 on bg, 8.0:1 on card
$color-ink-deep: #2b1d42;    // text on the darker tracker fills
$color-primary: #ffafcc;     // primary button fill (ink text on it: 7.0:1)
$color-primary-edge: #ee7fa9; // primary button 3D bottom edge
$color-edge: #cdb4db;        // light button / tab 3D bottom edge
$color-border: #e6d8ec;      // card and field borders
$color-track: #e9deef;       // slider track, upcoming stepper segments
$color-fill: #c86fc9;        // slider fill
$color-focus: $color-ink;    // 3px focus ring, 3px offset

// Tracker scales: level 1 → 5 (from constants/trackers.ts, which mirrors the prototype)
// sleep (by how rested): #0b0c10 #1f2833 #c5c6c7 #45a29e #66fcf1
// steps (share of goal): #d7c0d0 #f7c7db #f79ad3 #c86fc9 #8e518d
// mood (Very Bad → Great): #231c07 #8b2635 #7c9082 #ffe787 #2cf6b3
// anxiety (Calm → High): #a5ffd6 #ffa69e #ff686b
// crying (No tears → A good cry): #bfdbf7 #1f7a8c #022b3a

// Type
$font-display: 'Fredoka', 'Nunito', system-ui, sans-serif;  // titles, numerals
$font-body: 'Nunito', 'Segoe UI', system-ui, sans-serif;     // everything else

// Spacing, radius, shadows: copy from the prototype screens / Tracking Journal tokens
$space-1: 4px;  $space-2: 8px;  $space-3: 12px; $space-4: 16px;
$space-5: 20px; $space-6: 24px; $space-8: 32px; $space-12: 48px;
$radius-button: 18px; $radius-card: 32px; $radius-pill: 999px;
$tap-min: 56px;              // design system minimum button height
```

Load the two fonts from Google Fonts in `index.html` (`Fredoka` 500/600/700, `Nunito` 600/700/800), as the prototype does.

**Known contrast gaps, kept as they are in the prototype (rule 5):**

- Field and card borders `#e6d8ec` on white are 1.4:1. Text fields need a boundary of 3:1 (WCAG 1.4.11).
- The slider fill `#c86fc9` on its track `#e9deef` is 2.5:1, below the 3:1 for UI parts.
- Text on tracker cells must use the per-level text colour from the prototype (`FG` table), never one colour for all.

Tip: if the design should support dark mode or runtime theming later, expose the colors as CSS custom properties in `main.scss` (`--color-bg: #{$color-bg};`) and use `var(--color-bg)` in components.

---

## 7. Accessibility (WCAG 2.2 AA)

**Every feature must meet WCAG 2.2 level AA before it merges.** Accessibility is part of "done", not a polish step at the end.

### 7.1 Design rules

| Rule | Requirement | WCAG |
|---|---|---|
| Text contrast | ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1 | 1.4.3 |
| UI contrast | Borders of inputs, icons, chart/grid cells, focus ring ≥ 3:1 against neighbours | 1.4.11 |
| Not colour alone | Year grids, tracker cards and choice tiles also use text labels, never colour alone | 1.4.1 |
| Touch targets | Minimum 24×24px; **use 44×44px** as the project default | 2.5.8 |
| Font sizes | Use `rem`, not `px`, so text follows the phone's text-size setting | 1.4.4 |
| Reflow | No horizontal scroll at 320px width | 1.4.10 |
| Focus visible | Clear focus ring on every interactive element, never `outline: none` without a replacement | 2.4.7 |
| Focus not hidden | Sticky header and bottom nav must not cover the focused element | 2.4.11 |
| No drag-only | Anything draggable also works with taps/buttons | 2.5.7 |
| Motion | Respect `prefers-reduced-motion` | 2.3.3 (best practice) |

Colours always come from the prototype as they are (rule 5), so contrast is never fixed by changing a colour. Note each pair's ratio in `_tokens.scss` so the gaps stay visible:

```scss
$color-ink: #3f2d5c;         // on $color-bg: 10.2:1 ✓
$color-border: #e6d8ec;      // on $color-card: 1.4:1 (below 3:1, kept as in prototype)
```

Where a prototype colour is low-contrast, meet the other rules without touching it: always add a text label, and use the prototype's per-level text colours on tracker fills.

### 7.2 Code rules

- **Semantic HTML first.** `<button>` for actions, `<a>`/`<RouterLink>` for navigation, `<nav>`, `<main>`, `<header>`, headings in order (one `<h1>` per view). ARIA only where HTML has no equivalent.
- **`lang` attribute** on `<html>` in `index.html` (`lang="en"`).
- **Every input has a visible `<label>`.** Placeholders are not labels. Field components (`RangeSlider`, `NumberStepper`) require a `label` prop.
- **Errors** are shown as text next to the field, linked with `aria-describedby`, and `aria-invalid="true"` is set.
- **Status messages** ("Saved", "Couldn't save, offline") go through one shared `aria-live="polite"` region in `App.vue`.
- **Page titles:** each route sets `document.title` (e.g. "Sleep · 2026 · Tracker") in a router `afterEach`.
- **Focus on route change:** move focus to the view's `<h1>` (with `tabindex="-1"`) so screen reader users know the page changed.
- **Skip link** at the top of `App.vue`: "Skip to content" → `<main id="main">`.
- **Icon-only buttons** get an `aria-label` (`‹` in `PeriodSwitcher` → "Previous month").
- **Images:** mascot illustrations are decorative → `alt=""`; anything meaningful gets real alt text.

### 7.3 Component patterns

The prototype already marks up most of this (real buttons, labels, `aria-label`s). Keep its markup when you turn artboards into components.

| Component | Accessible pattern |
|---|---|
| `ChoiceTiles` | `<fieldset>` + `<legend>` (the question), one radio input per tile with a visible text label ("Great", "Mild", "A few tears"). Colour is never the only cue. Arrow keys move between tiles. |
| `RangeSlider` | Native `<input type="range">` with a `<label>` and `aria-valuetext` in words ("7.5 hours", "Rested"). The decorative track and fill are `aria-hidden`. |
| `NumberStepper` | `<input inputmode="numeric">` with a label ("Steps walked"); the −/+ buttons have `aria-label` ("500 fewer steps", "500 more steps"). |
| `OneThingStep` | `<textarea>` with a visible label; the placeholder is a hint, not the label. |
| `ProgressStepper` | `role="img"` with `aria-label="Question 2 of 6"`; the segments are decorative. |
| `RangeTabs` | A group with `aria-label="Choose a view"`; the active button has `aria-pressed="true"`. |
| `PeriodSwitcher` | Buttons "Previous month" / "Next month" (or year); `disabled` at the ends. |
| `YearGrid`, `MonthCalendar` | Each day is a `<button>` labelled like the prototype: "1 October: 7.5 hours, felt rested", "Sunday 4 October: nothing logged, tap to add". Future days say "still to come" and are disabled. Today gets `aria-current="date"`. A visible legend names every colour. |
| `WeekBars` | Each bar has a text value under it; the average is also written as text. |
| `BottomNav` | `<nav aria-label="Main">` with `RouterLink`s; the active one gets `aria-current="page"`. |
| Mascot / illustrations | Decorative: `aria-hidden="true"`. |
| Animations | The prototype's bob, sway, confetti etc. stop under `prefers-reduced-motion` (its own CSS already does this; keep it). |
| Loading states | `aria-busy="true"` on the region being loaded. |

### 7.4 Shared SCSS helpers

Add to `_mixins.scss`:

```scss
@mixin focus-ring {
  outline: 3px solid $color-focus;   // $color-focus ≥ 3:1 against bg
  outline-offset: 2px;
}

@mixin visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@mixin tap-target {
  min-width: 44px;
  min-height: 44px;
}
```

Add to `main.scss` (global, once):

```scss
:focus-visible { @include focus-ring; }

.visually-hidden { @include visually-hidden; }

// Keep focused elements out from under the sticky header / bottom nav
html {
  scroll-padding-top: 4rem;
  scroll-padding-bottom: 5rem;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 7.5 Tooling

- **Linting:** `npm install -D eslint-plugin-vuejs-accessibility` and add its recommended config to `eslint.config.ts` (see the plugin's README for the flat-config setup). It flags missing labels, alt text and invalid ARIA while you type.
- **Browser:** axe DevTools extension and Lighthouse → Accessibility on every view.
- **Accessibility tree:** Chrome DevTools → Elements → **Accessibility** pane shows each element's name, role and state as assistive tech will read it. Use it to check labels on icon buttons, calendar days and form controls.
- **Manual (the part tools can't do):** keyboard only (Tab, Shift+Tab, Enter, Space, arrows).

### 7.6 Definition of done (every PR)

- [ ] `npm run lint` passes, including accessibility rules
- [ ] axe DevTools shows 0 issues on changed views
- [ ] Everything reachable and usable with keyboard only, focus always visible and in a logical order
- [ ] Colours match the prototype exactly (no new colours; contrast ratios noted in `_tokens.scss`)
- [ ] Information never conveyed by colour alone
- [ ] Tap targets ≥ 44px
- [ ] Every control has a sensible name, role and state in the DevTools Accessibility pane
- [ ] Works at 320px width

---

## 8. Firebase setup

### 7.1 Console

1. Go to **console.firebase.google.com** and click **Add project**. Analytics can stay off.
2. Click **Add app**, choose **Web (`</>`)**, and copy the `firebaseConfig` values.
3. Open **Build → Authentication → Get started** and, on the Sign-in method tab, enable **Email/Password** (first toggle only). Keep **Anonymous** on too, so sessions from before login can still be upgraded.
4. Open **Build → Firestore Database → Create database**. Pick a European location (e.g. `europe-west6`, Zürich) and **production mode**. The location can't be changed later.

### 7.2 Environment variables

Create `.env.local` in the project root (create-vue's `.gitignore` already ignores `*.local`):

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Commit a copy with empty values as `.env.example` so the repo documents which keys are needed.

> The Firebase web config isn't a secret (it ships to the browser anyway). It's kept out of git because GitHub's secret scanning flags Google API keys, and it makes switching between a test and real project easy. Your data is protected by the **security rules** below.

### 7.3 Security rules

Save as `firestore.rules` in the repo, and paste into **Firestore → Rules → Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Only the signed-in owner can read or write their own data. Everything else is denied by default.

---

## 9. Data model and how years work

```
users/{uid}                       → { years: [2026, 2027] }
users/{uid}/entries/{YYYY-MM-DD}  → one document per day (fields below)
```

Fields mirror the prototype's check-in exactly:

| Field | Type | Values | From check-in step |
|---|---|---|---|
| `hours` | number | 0–12, steps of 0.5 | 1 Sleep: "Hours slept" |
| `rested` | number | 1 Drained · 2 Tired · 3 Okay · 4 Rested · 5 Fully rested | 1 Sleep: "How rested do you feel?" |
| `steps` | number | 0 and up | 2 Steps: "Steps walked" |
| `mood` | string | `bad` (Very Bad) · `low` (Not Good) · `okay` · `good` · `great` | 3 Mood |
| `note` | string | optional short note, shown under Notes in the mood month view | 3 Mood |
| `anx` | string | `calm` · `mild` · `high` | 4 Anxiety |
| `cry` | string | `none` (No tears) · `some` (A few tears) · `lots` (A good cry) | 5 Crying |
| `imp` | string | free text, "one thing worth celebrating" | 6 Most important |
| `date`, `year`, `month` | | added on save | |
| `updatedAt` | timestamp | Firestore server time | |

**Example entry** (`users/abc123/entries/2026-10-08`):

```json
{
  "date": "2026-10-08",
  "year": 2026,
  "month": 10,
  "hours": 7.5,
  "rested": 4,
  "steps": 6400,
  "mood": "good",
  "note": "",
  "anx": "mild",
  "cry": "none",
  "imp": "An hour outside before work"
}
```

Labels, colours and level rules (e.g. steps level = share of the 15,000 goal) live in `constants/trackers.ts`, copied from the prototype's tracker definitions, so the database only stores the raw values.

**How the new year works**

1. On 1 January the first save creates `entries/2027-01-01`.
2. The same save adds `2027` to the `years` list on the user document.
3. The year switcher reads that list, so 2027 appears and 2026 stays selectable.

Nothing is archived, copied or reset.

**Why one flat `entries` collection** instead of `years/2026/days/...`: the browser SDK can't list subcollections, so a per-year structure couldn't discover which years exist. A flat collection queried by date range is simpler and needs no extra indexes.

**Why each tracker is optional in an entry:** you might log mood but not sleep. Saves use `merge: true`, so saving one tracker never erases another.

---

## 10. Data layer code

### `src/types/entry.ts`

One type for a day, matching section 9. Every other file imports from here.

```ts
import type { Timestamp } from 'firebase/firestore'

export type DateKey = string // "YYYY-MM-DD"

export type Rested = 1 | 2 | 3 | 4 | 5 // Drained → Fully rested
export type Mood = 'bad' | 'low' | 'okay' | 'good' | 'great'
export type Anxiety = 'calm' | 'mild' | 'high'
export type Crying = 'none' | 'some' | 'lots'
export type TrackerId = 'sleep' | 'steps' | 'mood' | 'anxiety' | 'crying'

// What the check-in collects; every field is optional because any step can be skipped
export interface DayValues {
  hours: number
  rested: Rested
  steps: number
  mood: Mood
  note: string
  anx: Anxiety
  cry: Crying
  imp: string
}

export interface Entry extends Partial<DayValues> {
  date: DateKey
  year: number
  month: number
  updatedAt?: Timestamp
}

export type EntriesByDate = Record<DateKey, Entry>
```

### `src/env.d.ts`

create-vue already creates this file. Add the Firebase variables so `import.meta.env` is typed:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### `src/firebase/index.ts`

```ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Offline cache: logging works without signal and syncs later
export const db = initializeFirestore(app, { localCache: persistentLocalCache() })
```

### `src/services/auth.service.ts`

Login is a **username and password** (artboards 18 Sign in and 19 Create an account; 21 Account and 22 Delete account to sign out and delete), on Firebase **Email/Password** auth. There's no silent anonymous sign-in any more.

- **Usernames:** trimmed, lowercased, 3–20 letters or numbers (`utils/auth.ts`). Firebase needs an email, so a username maps to `${username}@tracker-app.vercel.app` (`USERNAME_DOMAIN` in `constants/auth.ts`). That address is internal and never shown. Passwords need at least 6 characters.
- **`watchUser(callback)`:** `onAuthStateChanged`: calls back once the saved session is restored, then on every sign-in and sign-out (in any tab).
- **`signIn(username, password)`:** `signInWithEmailAndPassword`.
- **`createAccount({ name, username, password })`:** if the current user is **anonymous** (from before login), `linkWithCredential` upgrades it in place, so its uid and entries are kept. Otherwise `createUserWithEmailAndPassword`. Then it saves `{ name, username }` on `users/{uid}` with `merge: true`, next to the `years` list.
- **`signOut()`:** from the Account screen, which then goes to `/sign-in`.
- **`deleteAccount(password)`:** in this order, because the security rules need the signed-in user to delete the data:
  1. `reauthenticateWithCredential` with the typed password (`EmailAuthProvider.credential`): Firebase only deletes a user after a recent login. A wrong password (`auth/invalid-credential`) or no connection stops it here, before anything is deleted.
  2. `deleteUserData(uid)` in `entries.service`: every doc in `users/{uid}/entries` in batches of up to 500 (`writeBatch`), then `users/{uid}`.
  3. `deleteUser`.

  The store then sets the user to `null` (the entries store resets itself), and the view goes to `/sign-in` and announces "Your account was deleted." through the live region. Copy in `DELETE_ACCOUNT_MESSAGES` (`constants/auth.ts`): "Type your password to confirm.", "That password isn't right.", "Couldn't connect. Nothing was deleted."
- **`loadName(uid)`:** the name shown on Home.
- **Errors:** known Firebase errors become an `AuthError` with a code; the screens show the copy from `AUTH_ERROR_MESSAGES` as text under the field (`aria-invalid`, `aria-describedby`), or under the fields with `role="alert"` when it's not one field's fault (offline).

| Code | Message |
|---|---|
| `username-taken` | That username is taken. Try another one. |
| `wrong-login` | Wrong username or password. |
| `bad-username` | Use 3–20 letters or numbers. |
| `short-password` | Use at least 6 characters. |
| `offline` | Couldn't connect. Check your internet and try again. |

**Existing data:** someone who used the app before login has an anonymous session. They must choose **Create an account** (not Sign in) on that device to keep their entries.

### Where "today" comes from

The phone's clock decides nothing. Today's date comes from the **server** (Vercel, where the app is hosted), then is converted to your time zone:

1. On start, and every time the app comes back to the foreground, `time.service` asks the server for the current time. It reads the standard HTTP `Date` header from a tiny request to the app's own site, so there's no extra API or key.
2. `toDateKey()` turns that moment into `YYYY-MM-DD` **in your time zone** (e.g. `Europe/Zurich`), so 00:30 on 18 October counts as the 18th, not the 17th as UTC would say.
3. Every save also stores `updatedAt` as a Firestore **server timestamp**, written by Google's server, as a record of when the entry really changed.
4. **Offline fallback:** if the server can't be reached, the device clock is used, so logging still works without signal.

### `src/services/time.service.ts`

```ts
// Current time from the server, via the HTTP Date header of our own site.
// Same-origin request, so no CORS issues and no third-party time API.
export async function getServerNow(): Promise<Date> {
  try {
    const res = await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' })
    const header = res.headers.get('date')
    if (header) return new Date(header)
  } catch {
    // Offline: fall back to the device clock below
  }
  return new Date()
}
```

### `src/utils/date.ts`

```ts
import type { DateKey } from '@/types/entry'

// The device's time zone, e.g. "Europe/Zurich"
export const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

// A moment in time as "2026-10-17" in the given time zone.
// Don't use toISOString(): it's UTC and shifts the day after midnight in Zürich.
export const toDateKey = (date: Date, timeZone: string = TIME_ZONE): DateKey =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

export const yearOf = (dateKey: DateKey): number => Number(dateKey.slice(0, 4))
export const monthOf = (dateKey: DateKey): number => Number(dateKey.slice(5, 7))

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate()
```

### `src/services/entries.service.ts`

```ts
import {
  doc, setDoc, getDoc, getDocs, collection, query, where, orderBy, arrayUnion, serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { yearOf, monthOf } from '@/utils/date'
import type { DateKey, DayValues, Entry, EntriesByDate } from '@/types/entry'

const entriesRef = (uid: string) => collection(db, 'users', uid, 'entries')

// Save or update one day. merge: true keeps other trackers intact.
export async function saveDay(uid: string, dateKey: DateKey, data: Partial<DayValues>): Promise<void> {
  const year = yearOf(dateKey)

  await setDoc(
    doc(db, 'users', uid, 'entries', dateKey),
    { ...data, date: dateKey, year, month: monthOf(dateKey), updatedAt: serverTimestamp() },
    { merge: true },
  )

  // Registers the year once; arrayUnion ignores duplicates
  await setDoc(doc(db, 'users', uid), { years: arrayUnion(year) }, { merge: true })
}

// All entries of one year, keyed by date: { "2026-10-17": {...}, ... }
export async function loadYear(uid: string, year: number): Promise<EntriesByDate> {
  const q = query(
    entriesRef(uid),
    where('date', '>=', `${year}-01-01`),
    where('date', '<=', `${year}-12-31`),
    orderBy('date'),
  )
  const snap = await getDocs(q)
  return Object.fromEntries(snap.docs.map((d) => [d.id, d.data() as Entry]))
}

// Years that have data, e.g. [2026, 2027]
export async function loadYears(uid: string): Promise<number[]> {
  const snap = await getDoc(doc(db, 'users', uid))
  const years: number[] = snap.data()?.years ?? []
  return years.sort((a, b) => a - b)
}
```

`loadYear` filters on a date range rather than `where('year', '==', …) + orderBy('date')`, because that combination would need a composite index in Firestore.

---

## 11. State with Pinia

### `auth.store.ts`

- **State:** `uid`, `name` (loaded from `users/{uid}` in the background), `username` (from the account's internal address), `isSignedIn` (a user that isn't anonymous).
- **Actions:**
  - `init()`: starts following `watchUser` for the whole app life and resolves once the saved session is restored; `main.ts` and the router guard both await it.
  - `signIn(username, password)`, `createAccount(account)`, `signOut()`, `deleteAccount(password)`: call the service and update the state.
  - Whenever the signed-in uid changes, the entries store resets itself and loads the new account (one `watch` in `entries.store.ts`), so one person's entries are never shown to another.

### `entries.store.ts`

- **State:**
  - `todayKey`: today's date from the server, e.g. `"2026-10-17"`
  - `selectedYear`: defaults to the year of `todayKey`
  - `years`: list for the year switcher
  - `entriesByYear`: `{ 2026: { "2026-10-17": {...} } }`, a cache so switching back to a year doesn't refetch
  - `isLoading`
- **Getters:**
  - `entries`: entries for `selectedYear`
  - `todayEntry`: `entries[todayKey]`
  - `recap`: `yearRecap(entries)` from `utils/stats.ts` (e.g. average slept, typical mood, notes written)
  - `weekEntries`: Monday–Sunday of the current week, for the Home cards and Week view
- **Actions:**
  - `refreshToday()`: `todayKey = toDateKey(await getServerNow())`. Called once on start and again on `document` `visibilitychange` when the app becomes visible, so an app left open overnight switches to the new day (and on 1 January, the new year).
  - `fetchYears()`
  - `fetchYear(year)`: skips if already cached
  - `setYear(year)`: sets `selectedYear` and calls `fetchYear`
  - `save(dateKey, data)`: calls `saveDay`, then updates the cache locally so the UI updates instantly

The store passes `useAuthStore().uid` into the service functions, so services stay free of app state.

### Startup

In `main.ts`, await `useAuthStore().init()` before `app.mount('#app')`. A router `beforeEach` guard also awaits it: signed-out (and anonymous) users go to `/sign-in`, and signed-in users skip the sign-in pages (`meta.guest`).

---

## 12. Screens and components map

Every screen below is an artboard in the [Tracker App Prototype](https://claude.ai/artifact/PqV9nUy4sCuekuDvG6ucVV). Open the artboard while building its view and match it exactly (rule 5). The interactive "Mobile prototype" artboard shows how the screens connect.

| Route | View | Prototype artboard(s) | Purpose |
|---|---|---|---|
| `/sign-in` | `SignInView` | 18 Sign in | Username and password; link to Create an account |
| `/create-account` | `CreateAccountView` | 19 Create an account | Name, username, password; keeps an anonymous session's entries |
| `/` | `HomeView` | Home, 20 Home signed in | Date, "Your week, <name>": today's highlight card and one card per tracker with this week's M–S dots. Pebble in the header links to Account ("Your account") |
| `/account` | `AccountView` | 21 Account | Name and username, **Sign out**, and the Delete account section linking to `/account/delete` |
| `/account/delete` | `DeleteAccountView` | 22 Delete account | What gets deleted, password to confirm, **Delete forever** and **Keep my account** |
| `/one-thing` | `OneThingView` | Most important | "One thing of today" plus earlier days; empty days offer "Add" |
| `/tracker/:id` | `TrackerView` | Sleep / Steps / Mood / Anxiety / Crying calendar, Mood month, Sleep week | One view for all five trackers with **Calendar** (year grid, "2026 so far"), **Month** and **Week** tabs |
| `/checkin` | `CheckinView` | Check-in 1–6 | Six steps: Sleep → Steps → Mood → Anxiety → Crying → Most important, with Back / Next / Done |
| `/checkin?date=2026-10-04` | `CheckinView` | Edit a missed day | Same steps for a past day, opened by tapping an empty day; "Save" instead of "Next" |
| `/done` | `DoneView` | Done | "You're done for today!" summary with confetti |

**Bottom nav** (from the prototype): **Log now / Check in** · **Today** · **One thing**.

**Shared pieces**

- `TrackerView` takes the tracker id and reads everything else (name, colours, labels, legend, hint, cheer line) from `constants/trackers.ts`, so the five tracker pages are one component.
- `YearGrid`: 12 columns × 31 rows; logged days filled with the level colour, empty past days outlined ("tap to add"), future days "still to come", invalid dates (31 Feb) hidden.
- `MonthCalendar` and `WeekBars`: the Month and Week tabs, with `PeriodSwitcher` arrows and the summary cards under them (e.g. "Typical mood", "Average slept", "Goal 8 h").
- **The character:** build it from the prototype's **Character sheet** artboard as Vue SVG components in `components/mascot/`, with the poses the screens use.

## 13. Git workflow

### Branches

- `main` always works and is what's live. Nobody commits to it directly.
- **Every new task gets its own branch**, created from an up-to-date `main`:

```bash
git switch main
git pull
git switch -c feature/sleep-form
```

- Branch names: `type/short-description` in lowercase with hyphens.

| Prefix | Use for | Example |
|---|---|---|
| `feature/` | New functionality | `feature/year-switcher` |
| `fix/` | Bug fixes | `fix/date-timezone` |
| `style/` | Visual/SCSS changes only | `style/mood-colors` |
| `a11y/` | Accessibility improvements | `a11y/calendar-labels` |
| `refactor/` | Code changes without new behaviour | `refactor/entries-store` |
| `docs/` | Documentation | `docs/implementation-guide` |
| `chore/` | Setup, dependencies, config | `chore/vercel-config` |

- When the task is done, open a pull request into `main`, check the Vercel preview, then merge and delete the branch.

### Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short summary in imperative mood

Optional body: WHY the change was made and anything non-obvious.
Wrap at ~72 characters.
```

**Rules for a good commit**

- **One logical change per commit.** "Add rested slider" and "fix calendar bug" are two commits.
- **Imperative mood**, as if finishing "This commit will…": `add`, `fix`, `remove`, not `added` / `fixes`.
- **Summary ≤ 50 characters**, lowercase after the colon, no full stop at the end.
- **Scope** = the area touched: `sleep`, `steps`, `mood`, `anxiety`, `crying`, `one-thing`, `checkin`, `home`, `calendar`, `store`, `firebase`, `styles`, `a11y`.
- **Body explains why**, not what. The diff already shows what.
- **Never commit** `.env.local`, secrets, `node_modules`, `dist` or commented-out code.

**Types:** `feat` (new feature), `fix` (bug fix), `style` (visual/SCSS only), `refactor`, `docs`, `test`, `chore` (config, deps, tooling).

**Good examples**

```
feat(sleep): add rested slider to sleep check-in

fix(date): use server time for today's date

Phone clocks can be changed manually, which put entries on the
wrong day. Today's date now comes from the server's Date header,
with the device clock as offline fallback.

style(mood): darken mood colors to meet 3:1 contrast

a11y(calendar): add full date labels to day buttons

chore: add vercel.json with SPA rewrite
```

**Avoid**

```
update            → what was updated?
fix stuff         → which stuff?
WIP               → finish the work, or squash before merging
changes to files  → says nothing
```

### Before pushing

- Run `npm run lint` and `npm run type-check`, and go through the accessibility definition of done (section 7.6).
- Run tests when you decide to (AI assistants only run them when asked, see Project rules).

---

## 14. Deployment

Deploy with **Vercel**, connected to the GitHub repo. Firebase stays the database only.

### 14.1 SPA rewrite

Vue Router uses real URLs (`/sleep`, `/mood`). Without a rewrite, refreshing `/sleep` on Vercel returns a 404. Add `vercel.json` to the repo root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 14.2 Connect the repo

1. Go to **vercel.com**, sign in with GitHub, click **Add New → Project**, and import `tracker-app`.
2. Framework preset: **Vite** (detected automatically). Build command `npm run build`, output directory `dist`.
3. Under **Environment Variables**, add every `VITE_FIREBASE_*` value from `.env.local`, for both Production and Preview.
4. Click **Deploy**.

### 14.3 How deploys work after that

| You do | Vercel does |
|---|---|
| Push a branch / open a pull request | Builds a **preview URL** for that branch, posted on the PR |
| Merge into `main` | Deploys to **production** |

Env var changes only apply to the next deploy, so redeploy after editing them.

### 14.4 Firebase notes

- Email/Password sign-in works from any domain, so nothing to configure in Firebase for it.
- If you add Google login later, add your production domain (`tracker-app.vercel.app` or a custom one) under **Firebase → Authentication → Settings → Authorized domains**.

---

## 15. Build order checklist

Work top to bottom; each step ends with something you can see working, matches its prototype artboard (rule 5), and meets WCAG 2.2 AA (section 7) before it's ticked off.

- [ ] **1. Setup:** scaffold, clean starter, push to GitHub (section 3)
- [ ] **2. Styles:** `_tokens.scss`, `_mixins.scss`, `main.scss` wired in (section 6)
- [ ] **3. Firebase:** project, env vars, rules, `firebase/index.ts` (section 8)
- [ ] **4. Auth:** username + password login with `auth.service`, `auth.store`, `SignInView`, `CreateAccountView` and the router guard (section 8)
- [ ] **5. Data layer:** `types/entry.ts`, `env.d.ts`, `time.service`, `utils/date.ts` + tests, `entries.service`, `entries.store`
- [ ] **6. Layout:** `App.vue` shell with skip link and live region, `BottomNav`, page titles and focus on route change
- [ ] **7. Check-in:** `CheckinView` + the six step components, saving to Firestore, then `DoneView`
- [ ] **8. Home:** `HomeView` with `HighlightCard` and the five `TrackerWeekCard`s
- [ ] **9. Tracker pages:** `TrackerView` with `RangeTabs`, `YearGrid`, `MonthCalendar`, `WeekBars`, legend and summaries
- [ ] **10. One thing:** `OneThingView` with earlier days
- [ ] **11. Edit missed days:** tapping an empty day opens `CheckinView` for that date
- [ ] **12. Deploy:** `vercel.json` + Vercel connected to GitHub (section 14)
- [ ] **13. Character and motion:** mascot components and the prototype's animations (with reduced-motion fallbacks)
- [ ] **13b. Design check:** every view side by side with its prototype artboard; fix any difference
- [ ] **14. Full accessibility audit:** whole app with axe, DevTools Accessibility pane and keyboard only (section 7.5)
