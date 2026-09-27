---
name: nouveau-composant
description: Génère un nouveau composant UI TaskFlow et son test à partir des templates du projet. Utiliser quand on demande de créer, générer ou scaffolder un composant.
argument-hint: <NomDuComposant>
---

# Nouveau composant

Nom demandé : $ARGUMENTS

1. Vérifie que le nom est en PascalCase et que `src/components/$ARGUMENTS.ts` n'existe pas encore. Sinon, arrête-toi et explique pourquoi.
2. Lis `template.ts.tpl` **dans le dossier de ce skill** (`.claude/skills/nouveau-composant/`), remplace chaque `__NAME__` par le nom demandé et écris le résultat dans `src/components/$ARGUMENTS.ts`.
3. Fais de même avec `template.test.ts.tpl` → `src/__tests__/$ARGUMENTS.test.ts`.
4. Lance `npm test` et affiche le résultat.

Ne modifie aucun autre fichier. Ne branche pas le composant dans l'app : l'utilisateur le fera ensuite.

> Les templates portent l'extension `.tpl` : sinon Vitest exécuterait `template.test.ts` comme un vrai test.
