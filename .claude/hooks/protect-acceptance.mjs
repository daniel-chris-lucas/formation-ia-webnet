// Hook PreToolUse (Edit|Write) — interdit de modifier les tests d'acceptation.
// Entrée : JSON sur stdin. Sortie : exit 2 = action bloquée, stderr renvoyé à Claude.
let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  const { tool_input = {} } = JSON.parse(raw || '{}');
  const path = String(tool_input.file_path ?? '').replace(/\\/g, '/');
  if (path.includes('src/__tests__/acceptance/')) {
    console.error(
      "BLOQUÉ : les tests d'acceptation (src/__tests__/acceptance/) sont la spec validée par le PO. " +
        'Ne les modifie pas : corrige le code de production pour les faire passer.'
    );
    process.exit(2);
  }
  process.exit(0);
});
