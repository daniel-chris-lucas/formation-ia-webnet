import type { Task } from '../types.js';
import { taskCardHtml, taskCardClass } from './TaskCard.view.js';
import { bindTaskCardActions } from './TaskCard.handlers.js';

/** Carte d'une tâche : rendu uniquement, la logique vit dans TaskCard.view / TaskCard.handlers, les styles dans src/styles. */
export function renderTaskCard(task: Task, onUpdate: () => void): HTMLElement {
  const card = document.createElement('div');
  card.className = taskCardClass(task);
  card.innerHTML = taskCardHtml(task);
  bindTaskCardActions(card, task, onUpdate);
  return card;
}
