import type { Task } from '../types.js';
import { canReopen } from '../services/taskService.js';
import { formatDate, getDueState } from '../utils/date.js';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/labels.js';

// Carte v2 (maquettes/maquette-carte-tache-*.png) — styles : src/styles/components/_task-card.scss et _pill.scss
const BADGES = {
  overdue: `<span class="pill pill--overdue">⚠ En retard</span>`,
  today: `<span class="pill pill--today">Aujourd'hui</span>`,
};

export function isClosed(task: Task): boolean {
  return task.status === 'DONE' || task.status === 'CANCELLED';
}

export function taskCardClass(task: Task): string {
  return ['task-card', `task-card--${task.priority.toLowerCase()}`, isClosed(task) ? 'task-card--closed' : '']
    .filter(Boolean).join(' ');
}

function actionsHtml(task: Task): string {
  if (task.status === 'TODO') return `<button class="btn-primary btn-start">▶ Démarrer</button><button class="btn-secondary btn-cancel">Annuler</button>`;
  if (task.status === 'IN_PROGRESS') return `<button class="btn-primary btn-done">✓ Terminer</button><button class="btn-secondary btn-cancel">Annuler</button>`;
  if (task.status === 'DONE') {
    return canReopen(task)
      ? `<button class="btn-secondary btn-reopen">↩ Réouvrir</button>`
      : `<button class="btn-secondary btn-reopen" disabled title="Réouverture possible après 7 jours">↩ Réouvrir</button>`;
  }
  return '';
}

export function taskCardHtml(task: Task): string {
  const state = getDueState(task.dueDate, isClosed(task));
  return `
    <div class="task-card__header">
      <h3 class="task-card__title">${task.title}</h3>
      <span class="pill pill--${task.priority.toLowerCase()}">${PRIORITY_LABELS[task.priority]}</span>
    </div>
    ${state ? `<div>${BADGES[state]}</div>` : ''}
    ${task.description ? `<p class="task-card__desc">${task.description}</p>` : ''}
    <div class="task-card__footer">
      <div class="task-card__meta">
        <span><span aria-hidden="true">📅</span> ${formatDate(task.dueDate)}</span>
        <span class="task-card__status">${STATUS_LABELS[task.status]}</span>
      </div>
      <div class="task-card__actions task-actions">
        ${actionsHtml(task)}
        <button class="btn-icon btn-delete task-card__delete" aria-label="Supprimer la tâche « ${task.title} »"><span aria-hidden="true">🗑</span></button>
      </div>
    </div>`;
}
