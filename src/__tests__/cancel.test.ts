import { describe, it, expect } from 'vitest';
import { cancelTask, validateCancellation, canTransition } from '../services/taskService.js';
import type { Task } from '../types.js';

const task = (over: Partial<Task> = {}): Task => ({
  id: 't', projectId: 'p', title: 'Tâche', description: '',
  status: 'TODO', priority: 'MEDIUM', dueDate: '2026-12-01', createdAt: '2026-01-01', ...over,
});

describe('annulation', () => {
  it('annule une tâche TODO avec une justification suffisante', () => {
    const result = cancelTask(task(), 'Doublon du ticket #12');
    expect(result.task.status).toBe('CANCELLED');
    expect(result.task.closedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.comment).toBe('[Annulation] Doublon du ticket #12');
  });

  it('refuse d\'annuler une tâche CRITICAL', () => {
    expect(validateCancellation(task({ priority: 'CRITICAL' }), 'Plus nécessaire du tout')).toMatch(/CRITICAL/);
    expect(() => cancelTask(task({ priority: 'CRITICAL' }), 'Plus nécessaire du tout')).toThrow(/CRITICAL/);
  });

  it('refuse une justification de moins de 10 caractères', () => {
    expect(() => cancelTask(task(), '  court  ')).toThrow(/10 caractères/);
  });

  it('refuse d\'annuler une tâche déjà terminée', () => {
    expect(() => cancelTask(task({ status: 'DONE' }), 'Justification longue')).toThrow();
  });

  it('CANCELLED est un état terminal', () => {
    expect(canTransition('CANCELLED', 'TODO')).toBe(false);
    expect(canTransition('CANCELLED', 'IN_PROGRESS')).toBe(false);
  });
});
