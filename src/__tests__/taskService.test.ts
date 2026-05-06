import { describe, it, expect } from 'vitest';
import { canTransition, canReopen, applyTransition } from '../services/taskService.js';
import type { Task } from '../types.js';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function makeClosedTask(closedAt: string, status: 'DONE' | 'CANCELLED' = 'DONE'): Task {
  return {
    id: 'test-1',
    projectId: 'p1',
    title: 'Test task',
    description: '',
    status,
    priority: 'MEDIUM',
    dueDate: '2026-01-01',
    closedAt,
    createdAt: '2026-01-01',
  };
}

// ── canTransition ────────────────────────────────────────────────────────────

describe('canTransition', () => {
  it('autorise TODO → IN_PROGRESS', () => {
    expect(canTransition('TODO', 'IN_PROGRESS')).toBe(true);
  });
  it('autorise IN_PROGRESS → DONE', () => {
    expect(canTransition('IN_PROGRESS', 'DONE')).toBe(true);
  });
  it('autorise IN_PROGRESS → CANCELLED', () => {
    expect(canTransition('IN_PROGRESS', 'CANCELLED')).toBe(true);
  });
  it('autorise TODO → CANCELLED', () => {
    expect(canTransition('TODO', 'CANCELLED')).toBe(true);
  });
  it('refuse DONE → IN_PROGRESS', () => {
    expect(canTransition('DONE', 'IN_PROGRESS')).toBe(false);
  });
  it('refuse CANCELLED → IN_PROGRESS', () => {
    expect(canTransition('CANCELLED', 'IN_PROGRESS')).toBe(false);
  });
});

// ── canReopen ────────────────────────────────────────────────────────────────

describe('canReopen', () => {
  it('doit autoriser la réouverture après 7 jours', () => {
    const task = makeClosedTask(daysAgo(8));
    expect(applyTransition(task, 'TODO').status).toBe('TODO');
  });

  // TODO : tester qu'une tâche fermée depuis moins de 7 jours ne peut pas être réouverte
  // it('ne doit pas réouvrir une tâche fermée depuis moins de 7 jours', () => {
  //   const task = makeClosedTask(daysAgo(3));
  //   expect(() => applyTransition(task, 'TODO')).toThrow(/7 jours/);
  // });

  it('retourne false pour une tâche non fermée', () => {
    const task: Task = {
      id: 't', projectId: 'p', title: 'T', description: '',
      status: 'IN_PROGRESS', priority: 'MEDIUM',
      dueDate: '2026-06-01', createdAt: '2026-01-01',
    };
    expect(canReopen(task)).toBe(false);
  });
});

// ── applyTransition ──────────────────────────────────────────────────────────

describe('applyTransition', () => {
  it('passe TODO → IN_PROGRESS correctement', () => {
    const task: Task = {
      id: 't', projectId: 'p', title: 'T', description: '',
      status: 'TODO', priority: 'MEDIUM',
      dueDate: '2026-06-01', createdAt: '2026-01-01',
    };
    const result = applyTransition(task, 'IN_PROGRESS');
    expect(result.status).toBe('IN_PROGRESS');
  });

  it('renseigne closedAt lors du passage à DONE', () => {
    const task: Task = {
      id: 't', projectId: 'p', title: 'T', description: '',
      status: 'IN_PROGRESS', priority: 'MEDIUM',
      dueDate: '2026-06-01', createdAt: '2026-01-01',
    };
    const result = applyTransition(task, 'DONE');
    expect(result.closedAt).toBeDefined();
  });

  it('lève une erreur pour une transition invalide', () => {
    const task: Task = {
      id: 't', projectId: 'p', title: 'T', description: '',
      status: 'DONE', priority: 'MEDIUM',
      dueDate: '2026-06-01', createdAt: '2026-01-01',
    };
    expect(() => applyTransition(task, 'IN_PROGRESS')).toThrow();
  });
});
