import type { Task } from '../types.js';
import { canReopen } from '../services/taskService.js';
import { formatDate, getDueState } from '../utils/date.js';

const PRIORITY_COLORS: Record<Task['priority'], string> = { LOW: '#94a3b8', MEDIUM: '#3b82f6', HIGH: '#f97316', CRITICAL: '#ef4444' };
const PILL = 'color:#fff;padding:2px 8px;border-radius:10px;font-size:0.75rem;';
const BADGES = {
  overdue: `<span style="background:#ef4444;${PILL}margin-left:8px;">En retard</span>`,
  today: `<span style="background:#f97316;${PILL}margin-left:8px;">Aujourd'hui</span>`,
};

export function isClosed(task: Task): boolean {
  return task.status === 'DONE' || task.status === 'CANCELLED';
}

export function taskCardStyle(task: Task): string {
  return `background:#fff;border-radius:8px;padding:1rem;margin-bottom:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.08);${task.priority === 'CRITICAL' ? 'border-left:4px solid #ef4444;' : ''}opacity:${isClosed(task) ? '0.6' : '1'};`;
}

function actionsHtml(task: Task): string {
  if (task.status === 'TODO') return `<button class="btn-primary btn-start">▶ Démarrer</button><button class="btn-secondary btn-cancel">✗ Annuler</button>`;
  if (task.status === 'IN_PROGRESS') return `<button class="btn-primary btn-done">✓ Terminer</button><button class="btn-secondary btn-cancel">✗ Annuler</button>`;
  if (task.status === 'DONE') {
    return canReopen(task)
      ? `<button class="btn-secondary btn-reopen">↩ Réouvrir</button>`
      : `<button class="btn-ghost btn-reopen" disabled title="Réouverture possible après 7 jours" style="opacity:0.5;cursor:not-allowed;">↩ Réouvrir</button>`;
  }
  return '';
}

export function taskCardHtml(task: Task): string {
  const closed = isClosed(task);
  const state = getDueState(task.dueDate, closed);
  return `
    <div style="display:flex;align-items:flex-start;">
      <div style="flex:1;">
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
          <strong style="text-decoration:${closed ? 'line-through' : 'none'};color:${closed ? '#94a3b8' : '#1e293b'};">${task.title}</strong>
          ${state ? BADGES[state] : ''}<span style="background:${PRIORITY_COLORS[task.priority]};${PILL}font-size:0.72rem;">${task.priority}</span>
        </div>
        ${task.description ? `<p style="color:#64748b;font-size:0.85rem;margin-top:0.3rem;">${task.description}</p>` : ''}
        <div style="font-size:0.8rem;color:#94a3b8;margin-top:0.4rem;">Échéance : ${formatDate(task.dueDate)} · <strong>${task.status}</strong></div>
      </div>
    </div>
    <div style="margin-top:0.75rem;display:flex;flex-wrap:wrap;gap:0.4rem;" class="task-actions">
      ${actionsHtml(task)}
      <button class="btn-danger btn-delete" style="margin-left:auto;">🗑</button>
    </div>`;
}
