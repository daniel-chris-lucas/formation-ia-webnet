import { describe, it, expect } from 'vitest';
import { formatDate, daysSince } from '../utils/date.js';

describe('formatDate', () => {
  it('formate une date ISO en DD/MM/YYYY', () => {
    expect(formatDate('2026-05-06')).toBe('06/05/2026');
  });
});

describe('daysSince', () => {
  it("retourne 0 pour aujourd'hui", () => {
    const today = new Date().toISOString().split('T')[0];
    expect(daysSince(today)).toBe(0);
  });
});

// TODO : tester que isOverdue retourne false pour une tâche due aujourd'hui
