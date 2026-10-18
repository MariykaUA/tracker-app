# Tracker App: rules for Claude

Read `IMPLEMENTATION.md` before any task. It is the plan for this project: stack, folder structure, data model, accessibility, Git workflow and deployment. Follow it; if a task needs something it doesn't cover, ask Mariia first.

## Project rules (always)

1. **WCAG 2.2 AA.** Every screen and component meets it (IMPLEMENTATION.md section 7). The one exception is colour: prototype colours are used as they are (rule 5).
2. **Don't run tests unless Mariia asks** in that request. Writing tests is fine; running `npm run test:unit` or other test commands is not.
3. **New branch for every new task**, created from an up-to-date `main`. Never commit to `main` directly (the very first scaffold commit is the only exception). Naming: `feature/`, `fix/`, `style/`, `a11y/`, `refactor/`, `docs/`, `chore/` + short-description.
4. **Good commits.** One logical change per commit, Conventional Commits (`feat(sleep): add rested slider`), imperative summary ≤ 50 characters, body explains why. Never commit `.env.local`, secrets, `node_modules` or `dist`.
5. **Build exactly from the design prototype** in `design/prototype/` (see `design/README.md`). Its screens, flows, copy, icons, character, colours, fonts, spacing, radii, shadows and animations are the source of truth. Prototype colours win over `design/tokens.json` and are never changed to fix contrast. Don't invent screens or rewrite copy; ask if something is missing.

## Stack

Vue 3 + TypeScript (strict, no `any`) + Vite + Vue Router + Pinia + SCSS, Firebase (Email/Password Auth + Firestore), deployed on Vercel. Login is username + password: usernames map to an internal email in `src/constants/auth.ts` that is never shown, and signed-out users are sent to `/sign-in` by the router guard. Today's date comes from the server (`time.service.ts`), not the device clock.

## Working style

- Small components, `<script setup lang="ts">`, typed props and emits, shared types in `src/types/`.
- Components never import Firestore; only `src/services/` does.
- Before finishing a task: `npm run lint` and `npm run type-check`.
- When a task is done, push the branch and tell Mariia it's ready for a pull request.
