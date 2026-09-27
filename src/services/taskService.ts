import type { Task, TaskStatus } from '../types.js';
import { todayIso } from '../utils/date.js';

// ── Validation ──────────────────────────────────────────────────────────────

export function validateTitle(title: string): string | null {
  if (!title.trim()) return 'Le titre est obligatoire';
  if (title.trim().length < 3) return 'Le titre doit faire au moins 3 caractères';
  if (title.trim().length > 100) return 'Le titre ne peut pas dépasser 100 caractères';
  return null;
}

export function validateDescription(description: string): string | null {
  if (description.length > 500) return 'La description ne peut pas dépasser 500 caractères';
  return null;
}

export function validateDueDate(dueDate: string, isCreation: boolean): string | null {
  if (!dueDate) return "La date d'échéance est obligatoire";
  if (isCreation) {
    if (dueDate < todayIso()) return "La date d'échéance doit être aujourd'hui ou dans le futur";
  }
  return null;
}

export function validateComment(content: string): string | null {
  if (!content.trim()) return 'Le commentaire ne peut pas être vide';
  if (content.length > 1000) return 'Le commentaire ne peut pas dépasser 1000 caractères';
  return null;
}

export interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
}

export type TaskInputErrors = Record<keyof TaskInput, string | null>;

/** Validation centralisée des formulaires de création et d'édition de tâche. */
export function validateTaskInput(input: TaskInput, isCreation: boolean): TaskInputErrors {
  return {
    title: validateTitle(input.title),
    description: validateDescription(input.description),
    dueDate: validateDueDate(input.dueDate, isCreation),
  };
}

export function hasErrors(errors: TaskInputErrors): boolean {
  return Object.values(errors).some((e) => e !== null);
}

// ── Transitions de statut ────────────────────────────────────────────────────

const ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['DONE', 'CANCELLED'],
  DONE: ['TODO'],
  CANCELLED: [], // état terminal : aucune sortie possible
};

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Règle des 7 jours : une tâche DONE ne peut être réouverte (→ TODO)
 * que si au moins 7 jours calendaires se sont écoulés depuis closedAt.
 * Une tâche CANCELLED ne peut jamais être réouverte (état terminal).
 */
export function canReopen(task: Task): boolean {
  if (task.status !== 'DONE') return false;
  if (!task.closedAt) return true;

  // closedAt est une date ISO « YYYY-MM-DD » ; on tolère un horodatage complet (données anciennes).
  const parts = task.closedAt.slice(0, 10).split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const closedDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - closedDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 7;
}

export function applyTransition(task: Task, to: TaskStatus): Task {
  if (!canTransition(task.status, to)) {
    throw new Error(`Transition ${task.status} → ${to} non autorisée`);
  }
  if (to === 'TODO' && !canReopen(task)) {
    throw new Error("Cette tâche ne peut pas être réouverte avant 7 jours");
  }

  const updated: Task = { ...task, status: to };

  if (to === 'DONE' || to === 'CANCELLED') {
    updated.closedAt = todayIso(); // format « YYYY-MM-DD », attendu par canReopen
  }
  if (to === 'TODO') {
    updated.closedAt = undefined;
  }

  return updated;
}

// ── Règles de suppression projet ─────────────────────────────────────────────

export function canDeleteProject(projectId: string, tasks: Task[]): boolean {
  return tasks
    .filter(t => t.projectId === projectId)
    .every(t => t.status === 'DONE' || t.status === 'CANCELLED');
}

export function isProjectActive(projectId: string, tasks: Task[]): boolean {
  return tasks
    .filter(t => t.projectId === projectId)
    .some(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
}
