import type { TaskInputErrors } from '../services/taskService.js';

/** Affiche (ou masque) les messages d'erreur de validation dans un formulaire. */
export function showErrors(container: HTMLElement, selectors: Record<keyof TaskInputErrors, string>, errors: TaskInputErrors): void {
  for (const field of Object.keys(selectors) as (keyof TaskInputErrors)[]) {
    const el = container.querySelector<HTMLElement>(selectors[field])!;
    const msg = errors[field];
    el.textContent = msg ?? '';
    el.style.display = msg ? 'block' : 'none';
  }
}
