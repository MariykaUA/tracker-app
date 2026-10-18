# Design source

Exported from Mariia's **Tracker App Prototype** canvas on claude.ai (17 October 2026). This folder is the source of truth for how the app looks and behaves (project rule 5).

## What's here

| Path | What |
|---|---|
| `prototype/Main.dc.html` | The interactive mobile prototype: all screens and the full logic (tracker definitions, levels, colours, labels, copy, flows). The `TR` and `FG` tables in its script are the tracker definitions to copy into `src/constants/trackers.ts`. |
| `prototype/Character.dc.html` | Character sheet: the mascot and its poses. Rebuild as Vue SVG components in `src/components/mascot/`. |
| `prototype/screens/01-Home … 17-Done` | One static artboard per screen (390 × 844). Build each view to match its artboard. |
| `prototype/assets/icon-*.png` | Tracker icons used on Home and the tracker pages: one-thing, sleep, steps, mood, anxiety, crying. Copy into `src/assets/icons/`. |
| `prototype/canvas.json` | Canvas layout: artboard titles and order. |
| `tokens.json` | The Tracking Journal design system tokens. Use only for values the screens don't show; where they differ, the screens win. |

## Screen → view map

| Artboard | Route / view |
|---|---|
| 01 Home | `/` → `HomeView` |
| 02 Most important | `/one-thing` → `OneThingView` |
| 03–07 Sleep, Steps, Mood, Anxiety, Crying calendar | `/tracker/:id` → `TrackerView`, Calendar tab |
| 08 Mood month | `TrackerView`, Month tab |
| 09 Sleep week | `TrackerView`, Week tab |
| 10–15 Check-in 1–6 | `/checkin` → `CheckinView` steps |
| 16 Edit a missed day | `/checkin?date=YYYY-MM-DD` |
| 17 Done | `/done` → `DoneView` |

## How to read the files

They're HTML with inline styles. Open them in a text editor to copy exact values (colours, sizes, radii, shadows, keyframes, copy, `aria-label`s). They use the claude.ai design runtime, so they won't render fully when opened directly in a browser; compare visually against the canvas on claude.ai instead.
