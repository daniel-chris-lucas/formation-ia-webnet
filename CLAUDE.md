# TaskFlow — CLAUDE.md

Mini-application de gestion de tâches (projets, tâches, commentaires). Aucun backend : persistance LocalStorage.

## Stack
- Vite 5 + TypeScript 5.4 (strict, `noUnusedLocals`), **sans framework** (DOM natif)
- Vitest 1.6 (environnement `node`), couverture via `@vitest/coverage-v8`
- **Aucune dépendance runtime** : pas de librairie de date ni de validation. Ne pas en ajouter sans accord.

## Commandes
- `npm run dev` — serveur de développement (http://localhost:5173)
- `npm test` — tests unitaires (`vitest run`)
- `npm run test:coverage` — tests + rapport de couverture
- `npm run build` — vérification TypeScript (`tsc`) + build Vite
- `npm run preview` — prévisualisation du build
- Il n'y a **pas** de linter configuré.

## Architecture
- `src/main.ts` — point d'entrée, monte l'app
- `src/app.ts` — orchestration UI : état de navigation et rendu (pas de routeur)
- `src/store.ts` — lecture/écriture LocalStorage + données de démo (`seedIfEmpty`)
- `src/services/taskService.ts` — règles métier : validations, transitions de statut, règle des 7 jours
- `src/components/` — composants UI (fonctions `renderXxx(container, …)`)
- `src/utils/date.ts` — utilitaires de date natifs ; `src/utils/ids.ts` — `crypto.randomUUID()`
- `src/__tests__/` — tests Vitest

## Conventions
- Dates stockées en chaîne ISO `YYYY-MM-DD`
- Validation manuelle dans `taskService.ts` : chaque fonction renvoie un message d'erreur en français ou `null`
- Code, messages et tests en français
