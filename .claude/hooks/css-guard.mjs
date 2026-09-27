// Hook PreToolUse (Edit|Write) — conventions d'intégration rendues non négociables.
// Ne juge que le contenu AJOUTÉ (Edit → new_string, Write → content) : la dette existante n'est pas bloquée.
// Entrée : JSON sur stdin. Sortie : exit 2 = action bloquée, stderr renvoyé à Claude.
let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  const { tool_input = {} } = JSON.parse(raw || '{}');
  const file = String(tool_input.file_path ?? '').replace(/\\/g, '/');
  if (!/\.s?css$/.test(file)) process.exit(0);

  const added = String(tool_input.new_string ?? tool_input.content ?? '');
  const problems = [];
  if (/!important/.test(added)) {
    problems.push('`!important` est interdit : corrige la spécificité (BEM) au lieu de la forcer.');
  }
  if (!file.endsWith('/_tokens.scss') && /#[0-9a-f]{3,8}\b/i.test(added.replace(/\/\/.*$/gm, ''))) {
    problems.push('Couleur en dur interdite hors de src/styles/_tokens.scss : utilise un token var(--color-…), ou ajoute-le dans _tokens.scss.');
  }
  if (problems.length) {
    console.error("BLOQUÉ (conventions d'intégration) :\n- " + problems.join('\n- '));
    process.exit(2);
  }
  process.exit(0);
});
