import type { Task, TaskStatus } from '../types.js';
import { isOverdue } from '../utils/date.js';

export interface ProjectStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  completionRate: number;
  overdue: number;
}

const OPEN_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS'];

/** Statistiques d'avancement d'un projet — spec : docs/specs/stats.md. Fonction pure. */
export function getProjectStats(projectId: string, tasks: Task[]): ProjectStats {
  const byStatus: Record<TaskStatus, number> = { TODO: 0, IN_PROGRESS: 0, DONE: 0, CANCELLED: 0 };
  let overdue = 0;

  for (const task of tasks) {
    if (task.projectId !== projectId) continue;
    byStatus[task.status]++;
    if (OPEN_STATUSES.includes(task.status) && isOverdue(task.dueDate)) overdue++;
  }

  const total = byStatus.TODO + byStatus.IN_PROGRESS + byStatus.DONE;
  const completionRate = total === 0 ? 0 : Math.round((byStatus.DONE / total) * 100);
  return { total, byStatus, completionRate, overdue };
}

export function formatStatsBanner(stats: ProjectStats): string {
  const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? 's' : ''}`;
  return `${plural(stats.total, 'tâche')} · ${stats.completionRate} % terminées · ${stats.overdue} en retard`;
}
