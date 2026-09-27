# Audit d'accessibilité — TaskFlow

> Rapport produit par le subagent `a11y-auditor` (Lab 8, parcours Front), écrit par l'agent principal. Exemple de référence : le vôtre sera formulé différemment. État audité : tag `lab-08-start`.

## 1. Synthèse

| Gravité | Nombre |
|---|---|
| Bloquant | 2 |
| Majeur | 5 |
| Mineur | 3 |

La carte de tâche v2 et la barre de filtres (Labs 4 et 6) sont conformes. Les problèmes se concentrent sur les **composants non retouchés** : formulaires, liste des projets, commentaires et états vides.

## 2. Détail

| Gravité | WCAG | RGAA | Fichier | Problème | Correctif |
|---|---|---|---|---|---|
| Bloquant | 2.1.1 Clavier | 7 Scripts / 12 Navigation | `ProjectList.ts` (liste des projets) | Projets = `<div data-project-id>` avec écouteur `click` : **impossible de changer de projet au clavier** | `<button type="button">` (ou `<a>`) dans une `<nav aria-label="Projets">`, avec `aria-current="true"` sur le projet actif |
| Bloquant | 1.3.1 Info et relations | 11 Formulaires | `TaskForm.ts`, `TaskEditForm.ts` | `<label>` sans `for` : aucun champ n'a d'étiquette associée | `for`/`id` sur chaque couple label/champ |
| Majeur | 3.3.1 Identification des erreurs | 11 Formulaires | `TaskForm.ts`, `TaskEditForm.ts`, `CommentSection.ts` | Messages d'erreur affichés sans annonce ni lien avec le champ | `role="alert"` sur le message, `aria-describedby` + `aria-invalid="true"` sur le champ |
| Majeur | 1.4.3 Contraste | 3 Couleurs | formulaires, `CommentSection.ts` | Texte d'erreur `#ef4444` sur blanc : **3,76:1** | Token `--color-danger-text` (`#b91c1c`, 5,9:1) |
| Majeur | 1.4.3 Contraste | 3 Couleurs | `app.ts` (états vides), `CommentSection.ts` (dates, « Aucun commentaire ») | `#94a3b8` sur `#f1f5f9` ou `#f8fafc` : **2,3 à 2,5:1** | Token `--color-text-muted` (`#475569`) |
| Majeur | 1.3.1 / 4.1.2 | 11 Formulaires | `CommentSection.ts` | `<textarea>` de commentaire sans label (placeholder seul) | `<label for="new-comment">` (visible ou `visually-hidden`) |
| Majeur | 4.1.3 Messages d'état | 7 Scripts | `TaskCard.handlers.ts`, `ProjectList.ts` | `alert()` / `prompt()` natifs pour les erreurs et la justification d'annulation | Dialogue `<dialog>` accessible, ou message inline en `role="alert"` |
| Mineur | 1.4.3 Contraste | 3 Couleurs | `app.ts` (description du projet) | `#64748b` sur `#f1f5f9` : **4,34:1**, juste sous le seuil | Token `--color-text-muted` |
| Mineur | 1.3.1 | 9 Structuration | `app.ts` | Pas de landmarks : `#sidebar` et `#main` sont des `<div>` | `<nav>` pour la sidebar, `<main>` pour le contenu |
| Mineur | 2.4.6 | 9 Structuration | `CommentSection.ts` | Titre « Commentaires » en `<h4>` sous un `<h3>` de carte : niveau correct, mais le compteur n'est pas mis à jour pour les lecteurs d'écran après ajout | `aria-live="polite"` sur la liste des commentaires |

## 3. À corriger en premier
1. Liste des projets accessible au clavier (bloquant, et une seule modification).
2. Labels associés dans les deux formulaires (bloquant, mécanique).
3. Tokens de contraste pour les erreurs et les textes secondaires (majeur, touche plusieurs écrans).

## Limites de l'audit statique
Non vérifiés : contrastes réellement rendus (héritage CSS, opacité des cartes fermées à 60 %), ordre de tabulation, restitution par un lecteur d'écran, zoom à 200 %. → Défi du Lab 8 : même audit avec Playwright (navigation clavier réelle et couleurs calculées).
