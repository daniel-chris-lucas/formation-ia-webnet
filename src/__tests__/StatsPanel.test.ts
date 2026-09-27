import { describe, it, expect } from 'vitest';
import { statsPanelHtml } from '../components/StatsPanel.js';
import type { ProjectStats } from '../services/statsService.js';

// Fixture conforme au contrat : le front n'a pas besoin que getProjectStats soit implémenté.
const fixture: ProjectStats = {
  total: 12,
  byStatus: { TODO: 5, IN_PROGRESS: 2, DONE: 5, CANCELLED: 1 },
  completionRate: 42,
  overdue: 3,
};

describe('StatsPanel', () => {
  it('affiche les 4 indicateurs de la maquette', () => {
    const html = statsPanelHtml(fixture);
    for (const label of ['Tâches actives', 'Terminées', 'En retard', 'Annulées']) expect(html).toContain(label);
    expect(html).toContain('42 %');
  });
  it('est une région nommée avec une jauge accessible', () => {
    const html = statsPanelHtml(fixture);
    expect(html).toContain('aria-label="Statistiques du projet"');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="42"');
  });
  it('met les retards en évidence seulement s\'il y en a', () => {
    expect(statsPanelHtml(fixture)).toContain('stat-card--danger');
    expect(statsPanelHtml({ ...fixture, overdue: 0 })).not.toContain('stat-card--danger');
  });
});
