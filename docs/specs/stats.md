# Spec — Statistiques de projet

**Statut** : validée par le PO · **Test d'acceptation** : `src/__tests__/acceptance/projectStats.test.ts` (ne pas modifier)

## Besoin
En haut de la liste des tâches d'un projet, l'utilisateur veut voir d'un coup d'œil l'avancement du projet.

## Fonction à implémenter
`getProjectStats(projectId: string, tasks: Task[]): ProjectStats` dans `src/services/statsService.ts`.

```ts
interface ProjectStats {
  total: number;                          // tâches du projet, hors CANCELLED
  byStatus: Record<TaskStatus, number>;   // comptage par statut (CANCELLED inclus)
  completionRate: number;                 // % entier de tâches DONE sur total (0 si total = 0)
  overdue: number;                        // tâches TODO ou IN_PROGRESS dont l'échéance est dépassée
}
```

## Règles
1. Seules les tâches du projet `projectId` sont prises en compte.
2. `total` exclut les tâches CANCELLED (elles restent comptées dans `byStatus.CANCELLED`).
3. `completionRate` = `Math.round(DONE / total × 100)` ; vaut `0` quand `total` vaut `0`.
4. Une tâche est **en retard** si elle est TODO ou IN_PROGRESS et que son échéance est **strictement antérieure à aujourd'hui, en heure locale**. Une tâche due aujourd'hui n'est pas en retard. Les tâches DONE ou CANCELLED ne sont jamais en retard.
5. Fonction pure : pas d'accès au LocalStorage.

## Hors périmètre
Graphiques, historique, statistiques multi-projets.

## Bonus UI
Un bandeau sous le titre du projet : `12 tâches · 42 % terminées · 3 en retard`.
