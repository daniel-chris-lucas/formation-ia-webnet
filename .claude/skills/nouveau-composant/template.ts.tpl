import type { Task } from '../types.js';

/** Rendu HTML pur (testable sans DOM). */
export function __NAME__Html(task: Task): string {
  return `<span class="__NAME__">${task.title}</span>`;
}

/** Composant : crée l'élément et y injecte le rendu. */
export function render__NAME__(task: Task): HTMLElement {
  const el = document.createElement('span');
  el.innerHTML = __NAME__Html(task);
  return el;
}
