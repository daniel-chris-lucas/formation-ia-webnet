---
name: integration-css
description: Conventions d'intégration HTML/CSS de TaskFlow — architecture Sass, design tokens, nommage BEM, responsive mobile-first, unités, accessibilité (contrastes, clavier, focus, labels). Utiliser pour toute création ou modification de style, de composant visuel, de mise en page responsive, de maquette à intégrer ou de correction d'affichage (CSS, SCSS, HTML).
---

# Conventions d'intégration TaskFlow

## Architecture Sass et tokens
- Un partial par composant : `src/styles/components/_<bloc>.scss`, ajouté avec `@use` dans `src/styles/main.scss`.
- Tokens dans `src/styles/_tokens.scss` uniquement, en CSS custom properties nommées par **rôle** (`--color-danger`, pas `--red`).
- **Aucune couleur en dur** hors de `_tokens.scss`. Si un token manque : le proposer dans `_tokens.scss`, ne pas coder la valeur dans le composant.

## Nommage BEM et sélecteurs
- `.bloc`, `.bloc__element`, `.bloc--modificateur` ; en Sass : `&__element`, `&--modificateur`.
- Pas d'élément d'élément (`.bloc__a__b`), pas d'ID, pas de sélecteur de balise dans un composant.
- Imbrication : 3 niveaux maximum.
- **`!important` interdit** : corriger la spécificité.

## Responsive et unités
- **Mobile-first** : styles de base = mobile, puis `@media (min-width: …)`. Points de rupture : 481 / 768 / 1024 px.
- `rem` pour la typo et les espacements (via les tokens `--space-*`) ; `px` seulement pour bordures et ombres.
- Cibles tactiles ≥ 40 px (`var(--touch-target)`).

## Accessibilité (non négociable)
- Contraste texte ≥ 4,5:1 (3:1 si ≥ 24 px ou ≥ 18,5 px gras) : vérifier chaque couple de tokens utilisé.
- Élément interactif = `<button>` ou `<a>` natif, jamais un `<div>` cliquable.
- `:focus-visible` explicite (token `--focus-ring`).
- Chaque champ a un `<label for>` ; erreurs reliées par `aria-describedby` et annoncées (`role="alert"`).
- Bouton icône : `aria-label`, emoji décoratif en `aria-hidden="true"`.
- Animations désactivées sous `prefers-reduced-motion: reduce`.

## Organisation du code TS
- Rendu HTML dans une fonction pure `xxxHtml(...)` (testable sans DOM), branchement des événements à part.

## Ce que Claude NE doit PAS faire
- Ajouter `!important`, une couleur en dur ou une taille de police en `px` « pour aller plus vite », même si l'utilisateur le demande : expliquer la convention et proposer la correction propre.
- Inventer une valeur absente des maquettes (`maquettes/specs-maquettes.md`) : la signaler.
- Ajouter une dépendance CSS (framework, reset, icônes) sans accord.
