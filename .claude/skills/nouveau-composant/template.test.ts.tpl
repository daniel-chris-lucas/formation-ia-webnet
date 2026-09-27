import { describe, it, expect } from 'vitest';
import { __NAME__Html } from '../components/__NAME__.js';
import type { Task } from '../types.js';

const task: Task = {
  id: 't', projectId: 'p', title: 'Exemple', description: '',
  status: 'TODO', priority: 'MEDIUM', dueDate: '2026-12-01', createdAt: '2026-01-01',
};

describe('__NAME__', () => {
  it('rend le titre de la tâche', () => {
    expect(__NAME__Html(task)).toContain('Exemple');
  });
});
