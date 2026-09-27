import type { Task, TaskStatus } from '../types.js';
import { updateTask, deleteTask } from '../store.js';
import { applyTransition } from '../services/taskService.js';

export function bindTaskCardActions(card: HTMLElement, task: Task, onUpdate: () => void): void {
  const actions = card.querySelector('.task-actions')!;
  const transition = (to: TaskStatus) => {
    try { updateTask(task.id, applyTransition(task, to)); onUpdate(); }
    catch (e) { alert((e as Error).message); }
  };
  actions.querySelector('.btn-start')?.addEventListener('click', () => transition('IN_PROGRESS'));
  actions.querySelector('.btn-done')?.addEventListener('click', () => transition('DONE'));
  actions.querySelector('.btn-cancel')?.addEventListener('click', () => transition('CANCELLED'));
  actions.querySelector('.btn-reopen')?.addEventListener('click', () => transition('TODO'));
  actions.querySelector('.btn-delete')?.addEventListener('click', () => {
    if (confirm(`Supprimer "${task.title}" ?`)) { deleteTask(task.id); onUpdate(); }
  });
}
