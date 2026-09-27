---
name: commit
description: Prépare un message de commit Conventional Commits en français à partir des changements indexés, puis commite après confirmation.
disable-model-invocation: true
---

# Commit

1. Lance `git diff --staged`. S'il est vide, propose les fichiers à indexer et arrête-toi.
2. Rédige un message **Conventional Commits en français** :
   - `type(portée): résumé` — types : feat, fix, refactor, test, docs, chore ; résumé ≤ 72 caractères, à l'impératif
   - un corps court qui explique le *pourquoi*, pas le *comment*
3. Affiche le message et **attends une confirmation explicite** avant de lancer `git commit`.
4. Ne fais jamais `git push`, `--amend` ni `--no-verify`.
