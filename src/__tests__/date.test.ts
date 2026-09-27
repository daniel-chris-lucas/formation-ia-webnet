import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatDate, daysSince, isOverdue, isToday } from '../utils/date.js';

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

describe('isOverdue / isToday (heure locale)', () => {
  afterEach(() => { vi.useRealTimers(); });

  // 01/10/2026 à 15:00 heure locale : en France, c'est déjà « après » minuit UTC.
  const setNow = () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 1, 15, 0));
  };

  it("une tâche due aujourd'hui n'est pas en retard", () => {
    setNow();
    expect(isOverdue('2026-10-01')).toBe(false);
    expect(isToday('2026-10-01')).toBe(true);
  });

  it('une tâche due hier est en retard', () => {
    setNow();
    expect(isOverdue('2026-09-30')).toBe(true);
  });

  it("à 00:30 heure locale, « aujourd'hui » reste la date locale", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 1, 0, 30));
    expect(isToday('2026-10-01')).toBe(true);
  });
});
