import { describe, it, expect } from 'vitest';
import { statCardHtml } from '../components/StatCard.js';

describe('StatCard', () => {
  it('affiche le libellé, la valeur et l\'aide', () => {
    const html = statCardHtml({ label: 'Tâches actives', value: '12', hint: 'hors annulées' });
    expect(html).toContain('Tâches actives');
    expect(html).toContain('12');
    expect(html).toContain('hors annulées');
  });
  it('variante danger', () => {
    expect(statCardHtml({ label: 'En retard', value: '3', tone: 'danger' })).toContain('stat-card--danger');
  });
  it('barre de progression accessible et bornée à 0–100', () => {
    const html = statCardHtml({ label: 'Terminées', value: '42 %', progress: 142 });
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="100"');
  });
});
