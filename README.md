# TaskFlow

Mini-application de gestion de tâches construite avec Vite et TypeScript. Elle permet de gérer des projets, des tâches avec statuts et priorités, et des commentaires. Toutes les données sont persistées en LocalStorage — aucun backend requis.

---

## Prérequis

- Node.js 20+
- npm 10+

---

## Installation

```bash
git clone https://github.com/webnet-training/taskflow
cd taskflow
npm install
npm run dev
```

L'application s'ouvre automatiquement sur [http://localhost:5173](http://localhost:5173).

---

## Commandes disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (hot reload) |
| `npm run build` | Build de production (TypeScript + Vite) |
| `npm run preview` | Prévisualisation du build de production |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run test:coverage` | Tests avec rapport de couverture |

---

## Structure du projet

```
taskflow/
├── index.html                   — point d'entrée HTML
├── src/
│   ├── main.ts                  — bootstrap de l'application
│   ├── app.ts                   — orchestration UI (rendu et état global)
│   ├── types.ts                 — interfaces TypeScript (Project, Task, Comment)
│   ├── store.ts                 — lecture/écriture LocalStorage + seeding initial
│   ├── utils/
│   │   ├── date.ts              — utilitaires de date (isOverdue, isToday, formatDate)
│   │   └── ids.ts               — générateur d'UUID
│   ├── components/
│   │   ├── ProjectList.ts       — sidebar : liste des projets
│   │   ├── TaskCard.ts          — carte d'une tâche (rendu + actions)
│   │   ├── TaskForm.ts          — formulaire de création de tâche
│   │   ├── TaskEditForm.ts      — formulaire d'édition de tâche
│   │   └── CommentSection.ts   — liste et ajout de commentaires
│   ├── services/
│   │   └── taskService.ts       — règles métier : transitions, validation, 7 jours
│   └── __tests__/
│       ├── taskService.test.ts  — tests des règles métier
│       ├── date.test.ts         — tests des utilitaires de date
│       └── validation.test.ts   — tests de validation des formulaires
└── CLAUDE.md                    — contexte pour Claude Code
```

---

## Règles métier

### Transitions de statut autorisées

```
TODO  ──►  IN_PROGRESS  ──►  DONE
 │               │
 └───────────────┴──►  CANCELLED
```

Une tâche DONE peut être réouverte (→ TODO) **uniquement si au moins 7 jours calendaires se sont écoulés depuis sa fermeture** (`closedAt`). Une tâche CANCELLED est définitive : elle ne peut pas être réouverte.

### Autres règles

- Titre : obligatoire, 3 à 100 caractères
- Description : optionnelle, 500 caractères max
- Priorité par défaut : `MEDIUM`
- Date d'échéance : doit être ≥ aujourd'hui à la **création** (pas de blocage à l'édition)
- Commentaire : non vide, 1000 caractères max
- Suppression d'un projet : impossible si des tâches `TODO` ou `IN_PROGRESS` existent

---

## Formation « Travailler avec Claude Code »

| Commande | Rôle |
|---|---|
| `npm run check -- setup` | Vérifie les prérequis |
| `npm run check -- <n>` | Vérifie le Core du lab *n* (parcours Back) |
| `npm run check -- <n> front` | Vérifie le Core du lab *n* (parcours Front) |
| `npm run goto -- <n>` | Met votre travail de côté et repart du point de départ du lab *n* |

Les maquettes du parcours Front sont dans `maquettes/` (PNG desktop et mobile + `specs-maquettes.md`).
