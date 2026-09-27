# Audit de couverture des tests — TaskFlow

> Rapport produit par le subagent `test-coverage-auditor` (Lab 8), écrit par l'agent principal. Exemple de référence : le vôtre sera formulé différemment.

## 1. Résumé

| Périmètre | Lignes couvertes |
|---|---|
| Global | ~20 % (l'UI n'est pas testée : attendu pour ce projet) |
| `services/taskService.ts` | ~87 % |
| `utils/date.ts` | ~88 % |

Les règles métier sont majoritairement testées, mais plusieurs **cas de refus** manquent.

## 2. Règles non couvertes

| Règle | Fichier | Cas manquant |
|---|---|---|
| Règle des 7 jours | `taskService.test.ts` | Réouverture **refusée** d'une tâche fermée depuis moins de 7 jours (le test existe mais est commenté) |
| Règle des 7 jours | `taskService.test.ts` | Cas limite : exactement 7 jours → autorisée |
| Règle des 7 jours | `taskService.test.ts` | `closedAt` absent sur une tâche DONE (le code autorise la réouverture : est-ce voulu ?) |
| Suppression de projet | `taskService.test.ts` | `canDeleteProject` et `isProjectActive` ne sont pas testés |
| Transitions | `taskService.test.ts` | `IN_PROGRESS → TODO` (déprioritisation) est autorisé par la fiche PO mais **refusé par le code** : écart à arbitrer |

## 3. Tests proposés

```ts
import { canReopen, applyTransition, canDeleteProject, isProjectActive } from '../services/taskService.js';

describe('règle des 7 jours — cas de refus', () => {
  it('refuse la réouverture d\'une tâche fermée depuis 3 jours', () => {
    const task = makeClosedTask(daysAgo(3));
    expect(() => applyTransition(task, 'TODO')).toThrow(/7 jours/);
  });
  it('autorise la réouverture à exactement 7 jours', () => {
    expect(canReopen(makeClosedTask(daysAgo(7)))).toBe(true);
  });
});

describe('suppression de projet', () => {
  const t = (status: Task['status']): Task => ({ ...makeClosedTask(daysAgo(1)), status });
  it('refuse la suppression si une tâche est encore ouverte', () => {
    expect(canDeleteProject('p1', [t('DONE'), t('TODO')])).toBe(false);
  });
  it('autorise la suppression si toutes les tâches sont fermées', () => {
    expect(canDeleteProject('p1', [t('DONE'), t('CANCELLED')])).toBe(true);
  });
  it('un projet avec une tâche IN_PROGRESS est actif', () => {
    expect(isProjectActive('p1', [t('IN_PROGRESS')])).toBe(true);
  });
});
```
