import type { Priority, Task } from '../types.js';

export interface TaskFilter {
  priority: Priority | 'ALL';
  query: string;
}

export const EMPTY_FILTER: TaskFilter = { priority: 'ALL', query: '' };

/** Filtre les tâches par priorité et par texte (titre ou description, sans tenir compte de la casse ni des accents). */
export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const q = normalize(filter.query.trim());
  return tasks.filter((t) =>
    (filter.priority === 'ALL' || t.priority === filter.priority) &&
    (!q || normalize(`${t.title} ${t.description}`).includes(q))
  );
}
