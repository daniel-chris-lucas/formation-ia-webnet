import type { Priority } from '../types.js';
import type { TaskFilter } from '../utils/filterTasks.js';
import { PRIORITY_LABELS } from '../utils/labels.js';

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

/** Rendu pur de la barre de filtres (styles : src/styles/components/_filter-bar.scss). */
export function filterBarHtml(filter: TaskFilter): string {
  const options = PRIORITIES.map((p) => `<option value="${p}"${filter.priority === p ? ' selected' : ''}>${PRIORITY_LABELS[p]}</option>`).join('');
  return `
    <div class="filter-bar" role="search">
      <div class="filter-bar__field filter-bar__field--search">
        <label class="filter-bar__label" for="filter-query">Rechercher</label>
        <input class="filter-bar__input" type="search" id="filter-query" value="${filter.query}" placeholder="Titre ou description" />
      </div>
      <div class="filter-bar__field">
        <label class="filter-bar__label" for="filter-priority">Priorité</label>
        <select class="filter-bar__input" id="filter-priority">
          <option value="ALL"${filter.priority === 'ALL' ? ' selected' : ''}>Toutes</option>${options}
        </select>
      </div>
    </div>`;
}

export function renderFilterBar(container: HTMLElement, filter: TaskFilter, onChange: (f: TaskFilter) => void): void {
  container.innerHTML = filterBarHtml(filter);
  const query = container.querySelector<HTMLInputElement>('#filter-query')!;
  const priority = container.querySelector<HTMLSelectElement>('#filter-priority')!;
  const emit = () => onChange({ query: query.value, priority: priority.value as TaskFilter['priority'] });
  query.addEventListener('input', emit);
  priority.addEventListener('change', emit);
}
