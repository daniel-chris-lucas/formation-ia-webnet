import type { Task } from '../types.js';
import { canReopen } from '../services/taskService.js';
import { formatDate, getDueState } from '../utils/date.js';

// Styles : src/styles/components/_task-card.scss et _pill.scss (BEM)
const BADGES = {
  overdue: `<span class="pill pill--overdue">En retard</span>`,
  today: `<span class="pill pill--today">Aujourd'hui</span>`,
};

export function isClosed(task: Task): boolean {
  return task.status === 'DONE' || task.status === 'CANCELLED';
}

export function taskCardClass(task: Task): string {
  return [
    'task-card',
    task.priority === 'CRITICAL' ? 'task-card--critical' : '',
    isClosed(task) ? 'task-card--closed' : '',
  ].filter(Boolean).join(' ');
}

function actionsHtml(task: Task): string {
  if (task.status === 'TODO') return `<button class="btn-primary btn-start">▶ Démarrer</button><button class="btn-secondary btn-cancel">✗ Annuler</button>`;
  if (task.status === 'IN_PROGRESS') return `<button class="btn-primary btn-done">✓ Terminer</button><button class="btn-secondary btn-cancel">✗ Annuler</button>`;
  if (task.status === 'DONE') {
    return canReopen(task)
      ? `<button class="btn-secondary btn-reopen">↩ Réouvrir</button>`
      : `<button class="btn-ghost btn-reopen" disabled title="Réouverture possible après 7 jours">↩ Réouvrir</button>`;
  }
  return '';
}

export function taskCardHtml(task: Task): string {
  const state = getDueState(task.dueDate, isClosed(task));
  return `
    <div class="task-card__body">
      <div class="task-card__main">
        <div class="task-card__heading">
          <strong class="task-card__title">${task.title}</strong>
          ${state ? BADGES[state] : ''}<span class="pill pill--priority pill--${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
        ${task.description ? `<p class="task-card__desc">${task.description}</p>` : ''}
        <div class="task-card__meta">Échéance : ${formatDate(task.dueDate)} · <strong>${task.status}</strong></div>
      </div>
    </div>
    <div class="task-card__actions task-actions">
      ${actionsHtml(task)}
      <button class="btn-danger btn-delete task-card__delete">🗑</button>
    </div>`;
}
