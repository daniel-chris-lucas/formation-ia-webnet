---
name: integrer-maquette
description: Intègre une maquette PNG en composant TaskFlow (fonction de rendu TS + partial Sass BEM), à partir de l'image et de maquettes/specs-maquettes.md. À invoquer avec /integrer-maquette <chemin-image> <NomComposant>.
argument-hint: <chemin-image> <NomComposant>
disable-model-invocation: true
---

# Intégrer une maquette

Arguments reçus : $ARGUMENTS (1er = chemin de l'image, 2e = nom du composant en PascalCase).

Applique les conventions du skill `integration-css` à chaque étape.

1. **Lire** l'image et `maquettes/specs-maquettes.md`. Si le nom de composant manque ou n'est pas en PascalCase, arrête-toi et demande-le.
2. **Analyser** et afficher, avant d'écrire du code :
   - la liste des sous-éléments (futurs `__elements` BEM) et des variantes (futurs `--modificateurs`) ;
   - les tokens nécessaires, en distinguant ceux qui existent déjà dans `src/styles/_tokens.scss` et ceux qui **manquent**. Un token manquant est **signalé et proposé**, jamais inventé ni codé en dur dans le composant ;
   - toute mesure que la maquette ne permet pas de déterminer.
3. **Générer** :
   - `src/components/<Nom>.ts` : une fonction pure `<nomCamel>Html(props)` qui retourne le HTML, plus un type `<Nom>Props`. Le composant **ne va pas chercher de données** : il reçoit des props ;
   - `src/styles/components/_<nom-kebab>.scss` : BEM, mobile-first, tokens uniquement, puis l'ajouter avec `@use` dans `src/styles/main.scss` ;
   - `src/__tests__/<Nom>.test.ts` : au moins un test de rendu et un test par variante.
4. **Vérifier l'accessibilité** : sémantique, nom accessible, contrastes des couples de tokens utilisés, rôle ARIA si le composant affiche une jauge ou un état.
5. **Contrôler visuellement** si le serveur MCP Playwright est disponible : afficher le composant (page de démo temporaire ou dans l'app si l'utilisateur l'y a branché), faire une capture à 375 px et à 1280 px, comparer avec la maquette et lister les écarts restants.
6. Lancer `npm test` et terminer par un récapitulatif : fichiers créés, tokens ajoutés, écarts connus.

Ne branche pas le composant dans l'application et ne modifie aucun autre composant sans accord.
