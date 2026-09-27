import { describe, it, expect } from 'vitest';
import { PriorityBadgeHtml } from '../components/PriorityBadge.js';
import type { Task } from '../types.js';

const task = (priority: Task['priority']): Task => ({
  id: 't', projectId: 'p', title: 'Exemple', description: '',
  status: 'TODO', priority, dueDate: '2026-12-01', createdAt: '2026-01-01',
});

describe('PriorityBadge', () => {
  it('affiche la priorité en français', () => {
    expect(PriorityBadgeHtml(task('HIGH'))).toContain('Haute');
  });
  it('applique le modificateur de priorité (couleur via les tokens)', () => {
    expect(PriorityBadgeHtml(task('CRITICAL'))).toContain('pill--critical');
  });
});
