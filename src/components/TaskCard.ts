import type { Task } from '../types.js';
import { updateTask, deleteTask } from '../store.js';
import { applyTransition, canReopen } from '../services/taskService.js';
import { isOverdue, isToday, formatDate } from '../utils/date.js';

export function renderTaskCard(task: Task, onUpdate: () => void): HTMLElement {
  const card = document.createElement('div');
  const isDone = task.status === 'DONE' || task.status === 'CANCELLED';

  let badge = '';
  if (!isDone && isOverdue(task.dueDate))
    badge = '<span style="background:#ef4444;color:#fff;padding:2px 8px;border-radius:10px;font-size:0.75rem;margin-left:8px;">En retard</span>';
  else if (!isDone && isToday(task.dueDate))
    badge = '<span style="background:#f97316;color:#fff;padding:2px 8px;border-radius:10px;font-size:0.75rem;margin-left:8px;">Aujourd\'hui</span>';

  const pColors: Record<string, string> = { LOW:'#94a3b8', MEDIUM:'#3b82f6', HIGH:'#f97316', CRITICAL:'#ef4444' };
  card.style.cssText = `background:#fff;border-radius:8px;padding:1rem;margin-bottom:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.08);${task.priority==='CRITICAL'?'border-left:4px solid #ef4444;':''}opacity:${isDone?'0.6':'1'};`;
  card.innerHTML = `
    <div style="display:flex;align-items:flex-start;">
      <div style="flex:1;">
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
          <strong style="text-decoration:${isDone?'line-through':'none'};color:${isDone?'#94a3b8':'#1e293b'};">${task.title}</strong>
          ${badge}<span style="background:${pColors[task.priority]};color:#fff;padding:2px 8px;border-radius:10px;font-size:0.72rem;">${task.priority}</span>
        </div>
        ${task.description?`<p style="color:#64748b;font-size:0.85rem;margin-top:0.3rem;">${task.description}</p>`:''}
        <div style="font-size:0.8rem;color:#94a3b8;margin-top:0.4rem;">Échéance : ${formatDate(task.dueDate)} · <strong>${task.status}</strong></div>
      </div>
    </div>
    <div style="margin-top:0.75rem;display:flex;flex-wrap:wrap;gap:0.4rem;" class="task-actions">
      ${task.status==='TODO'?`<button class="btn-primary btn-start">▶ Démarrer</button><button class="btn-secondary btn-cancel-todo">✗ Annuler</button>`:''}
      ${task.status==='IN_PROGRESS'?`<button class="btn-primary btn-done">✓ Terminer</button><button class="btn-secondary btn-cancel">✗ Annuler</button>`:''}
      ${task.status==='DONE'?`<button class="${canReopen(task)?'btn-secondary':'btn-ghost'} btn-reopen"${!canReopen(task)?' disabled title="Réouverture possible après 7 jours" style="opacity:0.5;cursor:not-allowed;"':''}>↩ Réouvrir</button>`:''}
      <button class="btn-danger btn-delete" style="margin-left:auto;">🗑</button>
    </div>`;

  const act = card.querySelector('.task-actions')!;
  const transition = (to: Parameters<typeof applyTransition>[1]) => {
    try { updateTask(task.id, applyTransition(task, to)); onUpdate(); }
    catch (e) { alert((e as Error).message); }
  };
  act.querySelector('.btn-start')?.addEventListener('click', () => transition('IN_PROGRESS'));
  act.querySelector('.btn-done')?.addEventListener('click', () => transition('DONE'));
  act.querySelector('.btn-cancel')?.addEventListener('click', () => transition('CANCELLED'));
  act.querySelector('.btn-cancel-todo')?.addEventListener('click', () => transition('CANCELLED'));
  act.querySelector('.btn-reopen')?.addEventListener('click', () => transition('TODO'));
  act.querySelector('.btn-delete')?.addEventListener('click', () => {
    if (confirm(`Supprimer "${task.title}" ?`)) { deleteTask(task.id); onUpdate(); }
  });

  return card;
}
