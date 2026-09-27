// Hook PostToolUse (Edit|Write) — vérifie les types du fichier TypeScript modifié.
// Ne remonte que les erreurs du fichier touché, pour ne pas noyer Claude.
import { execSync } from 'node:child_process';
import { relative } from 'node:path';

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  const { tool_input = {}, cwd = process.cwd() } = JSON.parse(raw || '{}');
  const file = String(tool_input.file_path ?? '');
  if (!file.endsWith('.ts')) process.exit(0);

  const rel = relative(cwd, file).replace(/\\/g, '/');
  try {
    execSync('npx tsc --noEmit', { cwd, stdio: 'pipe' });
    process.exit(0);
  } catch (e) {
    const errors = String(e.stdout ?? '')
      .split('\n')
      .filter((line) => line.replace(/\\/g, '/').startsWith(rel));
    if (errors.length === 0) process.exit(0); // erreurs ailleurs : pas le sujet de cette modification
    console.error(`Erreurs TypeScript dans ${rel} après ta modification :\n${errors.join('\n')}`);
    process.exit(2);
  }
});
