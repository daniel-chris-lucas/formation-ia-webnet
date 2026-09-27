import { describe, it, expect } from 'vitest';
import { filterTasks, EMPTY_FILTER } from '../utils/filterTasks.js';
import { filterBarHtml } from '../components/FilterBar.js';
import type { Task } from '../types.js';

const task = (title: string, priority: Task['priority'], description = ''): Task => ({
  id: title, projectId: 'p', title, description, status: 'TODO', priority, dueDate: '2026-12-01', createdAt: '2026-01-01',
});
const tasks = [task('Maquettes homepage', 'HIGH'), task('Intégration API', 'CRITICAL', 'Connecter Stripe'), task('Tests e2e', 'MEDIUM')];

describe('filterTasks', () => {
  it('ne filtre rien avec le filtre vide', () => {
    expect(filterTasks(tasks, EMPTY_FILTER)).toHaveLength(3);
  });
  it('filtre par priorité', () => {
    expect(filterTasks(tasks, { priority: 'CRITICAL', query: '' }).map((t) => t.title)).toEqual(['Intégration API']);
  });
  it('cherche dans le titre et la description, sans casse ni accents', () => {
    expect(filterTasks(tasks, { priority: 'ALL', query: 'integration' })).toHaveLength(1);
    expect(filterTasks(tasks, { priority: 'ALL', query: 'STRIPE' })).toHaveLength(1);
  });
});

describe('FilterBar', () => {
  it('associe chaque champ à son label', () => {
    const html = filterBarHtml(EMPTY_FILTER);
    expect(html).toContain('for="filter-query"');
    expect(html).toContain('id="filter-query"');
    expect(html).toContain('for="filter-priority"');
    expect(html).toContain('id="filter-priority"');
  });
});
