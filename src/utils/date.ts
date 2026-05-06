export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

export function isToday(dueDate: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dueDate === today;
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

export function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}
