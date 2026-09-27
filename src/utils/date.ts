// Les dates métier sont des chaînes « YYYY-MM-DD » en heure LOCALE.
// ⚠️ new Date('YYYY-MM-DD') les interprète à minuit UTC, et toISOString() renvoie la date UTC :
// on compare donc des chaînes ISO locales (l'ordre lexicographique = l'ordre chronologique).
export function isOverdue(dueDate: string): boolean {
  return dueDate < todayIso();
}

export function isToday(dueDate: string): boolean {
  return dueDate === todayIso();
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function daysSince(dateStr: string): number {
  const past = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - past.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function toLocalIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function todayIso(): string {
  return toLocalIso(new Date());
}

export type DueState = 'overdue' | 'today' | null;

/** État d'échéance affiché sur une carte (aucun badge pour une tâche fermée). */
export function getDueState(dueDate: string, isClosed: boolean): DueState {
  if (isClosed) return null;
  if (isOverdue(dueDate)) return 'overdue';
  if (isToday(dueDate)) return 'today';
  return null;
}
