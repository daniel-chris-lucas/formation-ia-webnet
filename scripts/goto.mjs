#!/usr/bin/env node
// Formation « Travailler avec Claude Code » — repartir du point de départ d'un lab.
// Usage : npm run goto -- 6
// Le travail en cours est mis de côté (git stash), jamais supprimé.
import { execSync } from 'node:child_process';

const arg = process.argv[2];
const n = Number(arg);
if (!arg || !Number.isInteger(n) || n < 2 || n > 10) {
  console.error('Usage : npm run goto -- <numéro du lab, de 2 à 10>');
  process.exit(1);
}
const num = String(n).padStart(2, '0');
const tag = `lab-${num}-start`;
const branch = `travail-lab-${num}`;

const git = (cmd, opts = {}) => execSync(`git ${cmd}`, { encoding: 'utf8', stdio: 'pipe', ...opts }).trim();

try {
  git(`rev-parse --verify --quiet refs/tags/${tag}`);
} catch {
  console.error(`❌ Le tag ${tag} est introuvable. Faites « git fetch --tags » puis réessayez.`);
  process.exit(1);
}

const dirty = git('status --porcelain');
if (dirty) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  git(`stash push -u -m "avant-${tag}-${stamp}"`);
  console.log('📦 Votre travail en cours a été mis de côté (voir « git stash list »).');
}

git(`switch -C ${branch} ${tag}`);
console.log(`✅ Vous êtes sur la branche ${branch}, au départ du lab ${n}.`);
console.log('   Pensez à relancer Claude Code (ou /clear) pour repartir d\'un contexte propre.');
