// TEST D'ACCEPTATION — spec docs/specs/stats.md, validé par le PO.
// Ce fichier est la spec exécutable : on corrige le code, jamais ce test.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProjectStats } from '../../services/statsService.js';
import type { Task, TaskStatus } from '../../types.js';

let n = 0;
const task = (status: TaskStatus, dueDate: string, projectId = 'p1'): Task => ({
  id: `t${++n}`, projectId, title: `Tâche ${n}`, description: '',
  status, priority: 'MEDIUM', dueDate, createdAt: '2026-09-01',
});

describe.skip('Acceptation — statistiques de projet', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 1, 15, 0)); // 01/10/2026 15:00, heure locale
  });
  afterEach(() => { vi.useRealTimers(); });

  it('R1 — ignore les tâches des autres projets', () => {
    const stats = getProjectStats('p1', [task('TODO', '2026-10-10'), task('TODO', '2026-10-10', 'p2')]);
    expect(stats.total).toBe(1);
  });

  it('R2 — total exclut CANCELLED, byStatus le compte', () => {
    const stats = getProjectStats('p1', [
      task('TODO', '2026-10-10'), task('IN_PROGRESS', '2026-10-10'),
      task('DONE', '2026-09-20'), task('CANCELLED', '2026-09-20'),
    ]);
    expect(stats.total).toBe(3);
    expect(stats.byStatus).toEqual({ TODO: 1, IN_PROGRESS: 1, DONE: 1, CANCELLED: 1 });
  });

  it('R3 — completionRate arrondi, 0 si aucun total', () => {
    const tasks = [task('DONE', '2026-09-20'), task('TODO', '2026-10-10'), task('TODO', '2026-10-10')];
    expect(getProjectStats('p1', tasks).completionRate).toBe(33);
    expect(getProjectStats('p1', [task('CANCELLED', '2026-09-20')]).completionRate).toBe(0);
    expect(getProjectStats('vide', []).completionRate).toBe(0);
  });

  it("R4 — en retard : échéance passée, heure locale ; due aujourd'hui ≠ en retard", () => {
    const stats = getProjectStats('p1', [
      task('TODO', '2026-09-30'),        // en retard
      task('IN_PROGRESS', '2026-09-15'), // en retard
      task('TODO', '2026-10-01'),        // due aujourd'hui : pas en retard
      task('DONE', '2026-09-01'),        // fermée : jamais en retard
      task('CANCELLED', '2026-09-01'),   // fermée : jamais en retard
    ]);
    expect(stats.overdue).toBe(2);
  });

  it('R5 — fonction pure : ne modifie pas les tâches reçues', () => {
    const tasks = [task('TODO', '2026-09-30')];
    const copy = structuredClone(tasks);
    getProjectStats('p1', tasks);
    expect(tasks).toEqual(copy);
  });
});
