#!/usr/bin/env node
// Formation « Travailler avec Claude Code » — auto-vérification des labs.
// Usage : npm run check -- <setup|2..10> [front]
// Affiche ✅ / ❌ par critère. Ne modifie rien.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { homedir } from 'node:os';

const lab = process.argv[2];
const track = (process.argv[3] ?? 'back').toLowerCase() === 'front' ? 'front' : 'back';
const results = [];
const ok = (label, pass, hint = '') => results.push({ label, pass: !!pass, hint });
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const json = (p) => { try { return JSON.parse(read(p)); } catch { return null; } };

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

/** Lit un frontmatter YAML simple (clés de premier niveau, valeurs sur une ou plusieurs lignes). */
function frontmatter(text) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  let key = null;
  for (const line of m[1].split('\n')) {
    const k = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (k) { key = k[1]; fm[key] = k[2]; }
    else if (key) fm[key] += ' ' + line.trim();
  }
  for (const k of Object.keys(fm)) fm[k] = fm[k].replace(/^[>|]-?\s*/, '').replace(/^["']|["']$/g, '').trim();
  return fm;
}

function runTests(extraArgs = []) {
  const r = spawnSync('npx', ['vitest', 'run', ...extraArgs], { encoding: 'utf8', shell: true });
  return r.status === 0;
}
const EXCLUDE_ACCEPTANCE = ['--exclude', '"src/__tests__/acceptance/**"'];

function hooksFor(settings, event) {
  return (settings?.hooks?.[event] ?? []).flatMap((m) => (m.hooks ?? []).map((h) => ({ ...h, matcher: m.matcher })));
}

const checks = {
  setup() {
    const major = Number(process.versions.node.split('.')[0]);
    ok(`Node ≥ 20 (actuel : ${process.versions.node})`, major >= 20, 'Installez Node 20 ou plus récent.');
    let claude = '';
    try { claude = execSync('claude --version', { encoding: 'utf8', stdio: 'pipe' }).trim(); } catch {}
    ok(`Claude Code installé${claude ? ` (${claude})` : ''}`, claude, 'Voir la page d\'installation : https://code.claude.com/docs');
    ok('Dépendances installées (node_modules)', existsSync('node_modules'), 'Lancez « npm install ».');
    ok('Sass installé', existsSync('node_modules/sass'), 'Lancez « npm install ».');
    const pwCache = process.env.PLAYWRIGHT_BROWSERS_PATH
      || (process.platform === 'win32' ? join(process.env.LOCALAPPDATA ?? '', 'ms-playwright')
        : process.platform === 'darwin' ? join(homedir(), 'Library/Caches/ms-playwright') : join(homedir(), '.cache/ms-playwright'));
    const hasChromium = existsSync(pwCache) && readdirSync(pwCache).some((d) => d.startsWith('chromium'));
    ok('Navigateur Playwright installé (Lab 5)', hasChromium, 'Lancez « npx playwright install chromium ».');
    let tags = '';
    try { tags = execSync('git tag -l "lab-*"', { encoding: 'utf8', stdio: 'pipe' }); } catch {}
    ok('Tags des labs présents', tags.includes('lab-02-start'), 'Lancez « git fetch --tags ».');
  },

  2() {
    const md = read('CLAUDE.md') || read('AGENTS.md');
    ok('CLAUDE.md présent', md);
    const stale = [['date-fns', /date-fns/i], ['Zod', /zod/i], ['src/router.ts', /router\.ts/i], ['npm run lint', /npm run lint/i], ['npm run test:ui', /test:ui/i]];
    for (const [name, re] of stale) {
      ok(`CLAUDE.md ne mentionne plus « ${name} »`, !re.test(md), 'Information périmée : vérifiez-la dans le code (si vous la citez pour dire qu\'elle est absente, ignorez ce ❌).');
    }
    const s = json('.claude/settings.json');
    ok('.claude/settings.json est un JSON valide', s, 'Attention aux virgules finales.');
    ok('Une règle « allow » autorise les tests', (s?.permissions?.allow ?? []).some((r) => /test|vitest/i.test(r)), 'Ex. : "Bash(npm run test *)"');
  },

  3() {
    const card = read('src/components/TaskCard.ts');
    const lines = card.split('\n').length;
    ok(`TaskCard.ts ≤ 35 lignes (actuel : ${lines})`, card && lines <= 35);
    const defs = walk('src').filter((f) => f.endsWith('.ts') && !f.includes('__tests__'))
      .filter((f) => /(function|const)\s+validateTaskInput\b/.test(read(f)));
    ok(`validateTaskInput défini une seule fois (trouvé : ${defs.length})`, defs.length === 1);
    for (const f of ['src/components/TaskForm.ts', 'src/components/TaskEditForm.ts']) {
      const t = read(f);
      ok(`${f} utilise validateTaskInput`, /validateTaskInput/.test(t));
      ok(`${f} n'a plus de validateTitle local`, !/function\s+validateTitle/.test(t));
    }
  },

  4() {
    const t = read('src/__tests__/date.test.ts');
    ok('date.test.ts fige l\'heure (setSystemTime)', /setSystemTime/.test(t));
    ok('date.test.ts teste isOverdue', /isOverdue/.test(t));
    ok('Toute la suite de tests est verte', runTests(EXCLUDE_ACCEPTANCE), 'Lancez « npm test » pour voir ce qui échoue.');
  },

  5() {
    const m = json('.mcp.json');
    ok('.mcp.json présent et valide', m, 'Utilisez « claude mcp add … --scope project ».');
    ok('Serveur playwright déclaré', m?.mcpServers?.playwright, 'claude mcp add --scope project playwright -- npx @playwright/mcp@latest');
    ok('Pas de clé API en clair dans .mcp.json', !/api[_-]?key"?\s*[:=]\s*"[^"$]{8,}/i.test(read('.mcp.json')), 'Une clé ne se versionne pas : variable d\'environnement.');
  },

  6() {
    const p = '.claude/skills/task-business-rules/SKILL.md';
    const fm = frontmatter(read(p));
    ok(`${p} présent avec un frontmatter`, fm);
    ok('name = task-business-rules', fm?.name === 'task-business-rules');
    const d = (fm?.description ?? '').toLowerCase();
    ok(`Description ≥ 120 caractères (actuel : ${d.length})`, d.length >= 120, 'La description est le déclencheur : soyez précis.');
    for (const [kw, re] of [['annul…', /annul/], ['réouv…', /r[ée]ouv/], ['statut', /statut/]]) {
      ok(`Description contient « ${kw} »`, re.test(d));
    }
  },

  7() {
    const dir = '.claude/skills/nouveau-composant';
    ok(`${dir}/SKILL.md présent`, existsSync(`${dir}/SKILL.md`));
    const files = existsSync(dir) ? readdirSync(dir) : [];
    ok(`Au moins 2 templates bundlés (trouvé : ${files.filter((f) => f !== 'SKILL.md').length})`, files.filter((f) => f !== 'SKILL.md').length >= 2);
    ok('src/components/PriorityBadge.ts généré', existsSync('src/components/PriorityBadge.ts'), 'Lancez « /nouveau-composant PriorityBadge ».');
  },

  8() {
    const p = '.claude/agents/test-coverage-auditor.md';
    const fm = frontmatter(read(p));
    ok(`${p} présent avec un frontmatter`, fm);
    ok('Champ description renseigné', (fm?.description ?? '').length > 30);
    ok('tools défini (moindre privilège)', fm?.tools, 'Sans « tools », l\'agent hérite de tous les outils.');
    ok('Pas de Write / Edit dans tools', fm?.tools && !/\b(Write|Edit)\b/.test(fm.tools));
    ok('coverage-audit.md produit', existsSync('coverage-audit.md'));
  },

  9() {
    const s = json('.claude/settings.json');
    ok('.claude/settings.json valide', s);
    ok('Une règle deny protège .env', (s?.permissions?.deny ?? []).some((r) => /\.env/.test(r)));
    const pre = hooksFor(s, 'PreToolUse');
    const post = hooksFor(s, 'PostToolUse');
    ok('Hook PreToolUse déclaré', pre.length);
    ok('Hook PostToolUse déclaré', post.length);
    const guard = pre.find((h) => h.type === 'command' && /protect/i.test(h.command ?? '')) ?? pre.find((h) => h.type === 'command');
    if (guard) {
      const env = { ...process.env, CLAUDE_PROJECT_DIR: process.cwd() };
      const simulate = (file) => spawnSync(guard.command, { input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Edit', tool_input: { file_path: file } }), shell: true, encoding: 'utf8', env }).status;
      ok('Simulation : édition d\'un test d\'acceptation → bloquée (exit 2)', simulate(join(process.cwd(), 'src/__tests__/acceptance/projectStats.test.ts')) === 2, 'Le blocage se fait avec « exit 2 » (et non exit 1).');
      ok('Simulation : édition de src/app.ts → autorisée (exit 0)', simulate(join(process.cwd(), 'src/app.ts')) === 0);
    }
  },

  10() {
    ok('Test d\'acceptation projectStats vert', runTests(['src/__tests__/acceptance']), 'Lancez « npx vitest run src/__tests__/acceptance ».');
    ok('Toute la suite est verte', runTests());
  },
};

// ── Parcours Front ───────────────────────────────────────────────────────────
const styleFiles = () => walk('src/styles').filter((f) => /\.s?css$/.test(f));
const noImportant = () => ok('Aucun !important dans src/styles', styleFiles().length && !styleFiles().some((f) => /!important/.test(read(f))));
const skillCheck = (name, keywords) => {
  const fm = frontmatter(read(`.claude/skills/${name}/SKILL.md`));
  ok(`.claude/skills/${name}/SKILL.md présent avec un frontmatter`, fm);
  ok(`name = ${name}`, fm?.name === name);
  const d = (fm?.description ?? '').toLowerCase();
  ok(`Description ≥ 120 caractères (actuel : ${d.length})`, d.length >= 120, 'La description est le déclencheur : soyez précis.');
  for (const kw of keywords) ok(`Description contient « ${kw} »`, d.includes(kw.toLowerCase()));
};

const frontChecks = {
  3() {
    const cards = walk('src/components').filter((f) => /TaskCard[^/\\]*\.ts$/.test(f));
    const inline = cards.filter((f) => /style="/.test(read(f)));
    ok(`Plus aucun style inline dans TaskCard (fichiers concernés : ${inline.length})`, cards.length && inline.length === 0);
    ok('src/styles/_tokens.scss présent', existsSync('src/styles/_tokens.scss'));
    const card = read('src/styles/components/_task-card.scss');
    ok('src/styles/components/_task-card.scss présent', card);
    ok('Nommage BEM (.task-card__… ou &__…)', /\.task-card__|&__/.test(card));
    ok('main.scss importé par main.ts', /styles\/main\.scss/.test(read('src/main.ts')));
    noImportant();
  },
  4() {
    const tokens = read('src/styles/_tokens.scss').toLowerCase();
    ok('Tokens des specs présents (#2563eb, #475569)', tokens.includes('#2563eb') && tokens.includes('#475569'), 'Voir maquettes/specs-maquettes.md');
    ok('_task-card.scss contient un point de rupture', /@media/.test(read('src/styles/components/_task-card.scss')));
    const cards = walk('src/components').filter((f) => /TaskCard[^/\\]*\.ts$/.test(f)).map(read).join('\n');
    ok('Bouton supprimer avec un nom accessible (aria-label)', /aria-label/.test(cards));
    noImportant();
  },
  6() { skillCheck('integration-css', ['CSS', 'BEM', 'token']); },
  7() {
    ok('.claude/skills/integrer-maquette/SKILL.md présent', existsSync('.claude/skills/integrer-maquette/SKILL.md'));
    ok('src/components/StatCard.ts généré', existsSync('src/components/StatCard.ts'), 'Lancez « /integrer-maquette maquettes/maquette-stats-desktop.png StatCard ».');
    ok('src/styles/components/_stat-card.scss généré', existsSync('src/styles/components/_stat-card.scss'));
    noImportant();
  },
  8() {
    const fm = frontmatter(read('.claude/agents/a11y-auditor.md'));
    ok('.claude/agents/a11y-auditor.md présent avec un frontmatter', fm);
    ok('tools défini (moindre privilège)', fm?.tools);
    ok('Lecture seule stricte : ni Write, ni Edit, ni Bash', fm?.tools && !/\b(Write|Edit|Bash)\b/.test(fm.tools));
    ok('a11y-audit.md produit', existsSync('a11y-audit.md'));
  },
  9() {
    checks[9]();
    const s = json('.claude/settings.json');
    const guard = hooksFor(s, 'PreToolUse').find((h) => h.type === 'command' && /css/i.test(h.command ?? ''));
    ok('Hook PreToolUse de garde CSS déclaré', guard, 'Ex. : node .claude/hooks/css-guard.mjs');
    if (guard) {
      const sim = (file, new_string) => spawnSync(guard.command, { input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Edit', tool_input: { file_path: join(process.cwd(), file), new_string } }), shell: true, encoding: 'utf8' }).status;
      ok('Simulation : !important dans un .scss → bloqué (exit 2)', sim('src/styles/components/_x.scss', 'color: red !important;') === 2);
      ok('Simulation : couleur en dur hors tokens → bloquée (exit 2)', sim('src/styles/components/_x.scss', 'border-color: #ff0000;') === 2);
      ok('Simulation : token → autorisé (exit 0)', sim('src/styles/components/_x.scss', 'color: var(--color-text);') === 0);
      ok('Simulation : couleur dans _tokens.scss → autorisée (exit 0)', sim('src/styles/_tokens.scss', '--color-x: #ff0000;') === 0);
    }
  },
  10() {
    const panel = read('src/components/StatsPanel.ts');
    ok('src/components/StatsPanel.ts présent', panel);
    const statFiles = walk('src/components').filter((f) => /Stat[^/\\]*\.ts$/.test(f)).map(read).join('\n');
    ok('Barre de progression accessible (role="progressbar")', /progressbar/.test(statFiles));
    ok('_stats-panel.scss avec point de rupture', /@media/.test(read('src/styles/components/_stats-panel.scss')));
    const tests = walk('src/__tests__').filter((f) => /StatsPanel/.test(f));
    ok('Test du composant StatsPanel présent', tests.length);
    if (tests.length) ok('Test StatsPanel vert', runTests(tests.map((t) => `"${t.replace(/\\/g, '/')}"`)));
    noImportant();
  },
};

const table = track === 'front' ? { ...checks, ...frontChecks } : checks;
if (!table[lab]) {
  console.error('Usage : npm run check -- <setup|2|3|4|5|6|7|8|9|10> [front]');
  process.exit(1);
}
table[lab]();
console.log(`\nVérification ${lab === 'setup' ? 'des pré-requis' : `du lab ${lab}`}${track === 'front' && frontChecks[lab] ? ' — parcours Front' : ''}\n`);
for (const r of results) console.log(`${r.pass ? '✅' : '❌'} ${r.label}${!r.pass && r.hint ? `\n   → ${r.hint}` : ''}`);
const failed = results.filter((r) => !r.pass).length;
console.log(failed ? `\n${failed} critère(s) à revoir.` : '\n🎉 Tout est bon !');
