import type { Task } from '../types.js';
import { PRIORITY_LABELS } from '../utils/labels.js';

/** Rendu HTML pur (testable sans DOM). Styles : .pill--<priorité> dans src/styles/components/_pill.scss. */
export function PriorityBadgeHtml(task: Task): string {
  return `<span class="pill pill--${task.priority.toLowerCase()}">${PRIORITY_LABELS[task.priority]}</span>`;
}

/** Composant : crée l'élément et y injecte le rendu. */
export function renderPriorityBadge(task: Task): HTMLElement {
  const el = document.createElement('span');
  el.innerHTML = PriorityBadgeHtml(task);
  return el;
}
