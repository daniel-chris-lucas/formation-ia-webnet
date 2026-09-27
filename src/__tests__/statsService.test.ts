import { describe, it, expect } from 'vitest';
import { formatStatsBanner } from '../services/statsService.js';

describe('formatStatsBanner', () => {
  it('formate le bandeau de statistiques', () => {
    const banner = formatStatsBanner({ total: 12, byStatus: { TODO: 5, IN_PROGRESS: 2, DONE: 5, CANCELLED: 1 }, completionRate: 42, overdue: 3 });
    expect(banner).toBe('12 tâches · 42 % terminées · 3 en retard');
  });
  it('gère le singulier', () => {
    const banner = formatStatsBanner({ total: 1, byStatus: { TODO: 1, IN_PROGRESS: 0, DONE: 0, CANCELLED: 0 }, completionRate: 0, overdue: 0 });
    expect(banner).toBe('1 tâche · 0 % terminées · 0 en retard');
  });
});
