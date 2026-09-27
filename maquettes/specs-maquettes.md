# TaskFlow — Specs des maquettes (export designer)

> Le designer n'a pas pu donner l'accès Dev Mode : voici l'export des tokens et des mesures. Les maquettes PNG sont dans ce dossier (desktop 1280 px, mobile 375 px).

## Tokens

| Token | Valeur | Usage |
|---|---|---|
| `color-primary` | `#2563eb` | Bouton principal (texte blanc : contraste 5,2:1) |
| `color-text` | `#0f172a` | Texte principal |
| `color-muted` | `#475569` | Texte secondaire, méta (7,6:1 sur blanc) |
| `color-border` | `#e2e8f0` | Bordures, séparateurs |
| `color-bg` | `#f1f5f9` | Fond de page |
| `color-surface` | `#ffffff` | Cartes |
| `color-danger` / `-bg` / `-text` | `#dc2626` / `#fef2f2` / `#b91c1c` | En retard, critique, suppression |
| `color-warning` / `-bg` / `-text` | `#c2410c` / `#fff7ed` / `#9a3412` | Aujourd'hui, priorité haute |
| `color-success` | `#15803d` | Barre de progression |
| Priorités (bordure gauche) | LOW `#475569` · MEDIUM `#2563eb` · HIGH `#c2410c` · CRITICAL `#dc2626` | |
| Espacements | 4 · 8 · 12 · 16 · 24 · 32 px | `space-1` … `space-8` |
| Rayons | carte 12 px · bouton 8 px · pastille 999 px | |
| Ombre carte | `0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.1)` | |
| Typo | system-ui ; base 16 px ; titre carte 18 px / 600 ; description 15 px ; méta 14 px ; pastille 12 px / 600 | |

## Carte tâche v2 (`maquette-carte-tache-*.png`)
- Carte : padding 16 × 24 px (16 px en mobile), bordure gauche 4 px couleur de priorité, sections espacées de 12 px.
- En-tête : titre à gauche, pastille de priorité à droite (libellés FR : Basse, Moyenne, Haute, Critique).
- Badge d'échéance sous le titre : « ⚠ En retard » (fond danger) ou « Aujourd'hui » (fond warning), texte blanc.
- Pied : séparateur 1 px, méta (date + statut en FR : À faire, En cours, Terminée, Annulée) à gauche, actions à droite.
- Boutons : hauteur min. 40 px ; supprimer = bouton icône 40 × 40 avec libellé accessible.
- **Mobile (≤ 480 px)** : le pied passe en colonne, les boutons texte se partagent la largeur, le bouton icône garde 40 px.
- Annulation impossible (CRITICAL) : bouton « Annuler » désactivé (opacité 50 %).

## Panneau statistiques (`maquette-stats-*.png`)
- 4 cartes KPI : Tâches actives (hors annulées) · Terminées (% + barre de progression) · En retard (valeur en `danger-text`) · Annulées.
- Desktop : grille de 4 colonnes, gouttière 16 px. **Mobile (≤ 640 px)** : 2 × 2, gouttière 12 px, valeur 24 px au lieu de 32 px.
- Libellé 14 px `muted`, valeur 32 px / 700, aide 13 px `muted`.
- La barre de progression est un `progressbar` accessible (valeur 0–100).
