# TaskFlow — CLAUDE.md

## Stack
Vite + TypeScript + Vitest. Persistance LocalStorage.
Formatage des dates via **date-fns** (voir `src/utils/date.ts`).

## Commandes
- `npm run dev` — serveur de développement
- `npm run test` — tests unitaires
- `npm run test:ui` — interface graphique Vitest
- `npm run build` — build production
- `npm run preview` — prévisualisation du build
- `npm run lint` — ESLint

## Architecture
- `src/services/taskService.ts` — règles métier
- `src/components/` — composants UI
- `src/store.ts` — persistance LocalStorage
- `src/router.ts` — gestion de la navigation

## Conventions
- Les IDs sont générés avec `crypto.randomUUID()`
- Les dates sont stockées au format ISO 8601 (`YYYY-MM-DD`)
- La validation des formulaires utilise **Zod** (schemas dans `src/schemas/`)

## Tests
- Les tests unitaires sont dans `src/__tests__/`
- Couverture cible : 80 % (pas encore atteinte)
