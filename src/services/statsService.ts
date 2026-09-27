import type { Task, TaskStatus } from '../types.js';

export interface ProjectStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  completionRate: number;
  overdue: number;
}

/** À implémenter au Lab 10 — voir docs/specs/stats.md. */
export function getProjectStats(_projectId: string, _tasks: Task[]): ProjectStats {
  throw new Error('Non implémenté : voir docs/specs/stats.md');
}
