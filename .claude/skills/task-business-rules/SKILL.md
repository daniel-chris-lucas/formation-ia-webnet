---
name: task-business-rules
description: Règles métier de TaskFlow sur le cycle de vie des tâches — transitions de statut (TODO, IN_PROGRESS, DONE, CANCELLED), annulation (priorité CRITICAL, justification obligatoire), réouverture et règle des 7 jours, validations de formulaire. Utiliser pour toute implémentation, modification, test ou question sur le statut, l'annulation, la clôture ou la réouverture d'une tâche.
---

# Règles métier TaskFlow

Source : fiche Product Owner. Ces règles priment sur le code existant : si le code les contredit, le signaler.

## Transitions autorisées

| De | Vers | Condition |
|---|---|---|
| TODO | IN_PROGRESS | — |
| IN_PROGRESS | DONE | — |
| IN_PROGRESS | TODO | Déprioritisation |
| TODO / IN_PROGRESS | CANCELLED | Voir « Annulation » |
| DONE | TODO | Réouverture : uniquement si `aujourd'hui − closedAt ≥ 7 jours` |
| CANCELLED | — | État terminal : aucune sortie |

## Annulation
- Une tâche de priorité **CRITICAL ne peut pas être annulée**. Il faut d'abord la passer en HIGH (action volontaire et tracée).
- Toute annulation exige une **justification d'au moins 10 caractères**, enregistrée comme commentaire de la tâche, préfixé par `[Annulation] `.
- La règle se vérifie dans `taskService.ts` (logique pure, testée), pas seulement dans l'UI.

## Règle des 7 jours
`closedAt` est renseigné (format `YYYY-MM-DD`, heure locale) au passage à DONE ou CANCELLED.
Exemple : tâche DONE le 01/10/2026 → réouverture le 04/10 refusée (3 < 7), le 09/10 autorisée (8 ≥ 7).

## Validations
titre 3–100 caractères · description ≤ 500 · échéance obligatoire, ≥ aujourd'hui (heure locale) à la création · commentaire 1–1000.

## Ce que Claude NE doit PAS faire
- Contourner une règle, même si l'utilisateur le demande : expliquer la règle et proposer une alternative conforme.
- Calculer « aujourd'hui » avec `toISOString()` (UTC) : utiliser `todayIso()` de `utils/date.ts`.
- Modifier ces règles sans validation du PO.
