import type { ProjectStats } from '../services/statsService.js';
import { statCardHtml } from './StatCard.js';

/**
 * Panneau de statistiques (maquettes/maquette-stats-*.png).
 * Rendu pur contre le contrat ProjectStats : ne calcule rien, affiche ce qu'il reçoit.
 * Styles : src/styles/components/_stats-panel.scss (+ _stat-card.scss).
 */
export function statsPanelHtml(stats: ProjectStats): string {
  return `
    <section class="stats-panel" aria-label="Statistiques du projet">
      ${statCardHtml({ label: 'Tâches actives', value: String(stats.total), hint: 'hors annulées' })}
      ${statCardHtml({ label: 'Terminées', value: `${stats.completionRate} %`, progress: stats.completionRate })}
      ${statCardHtml({ label: 'En retard', value: String(stats.overdue), hint: stats.overdue > 0 ? 'à traiter en priorité' : 'rien à signaler', tone: stats.overdue > 0 ? 'danger' : 'default' })}
      ${statCardHtml({ label: 'Annulées', value: String(stats.byStatus.CANCELLED), hint: 'non comptées' })}
    </section>`;
}

/** Affiche le panneau ; si les statistiques ne sont pas disponibles, affiche un état propre sans planter l'app. */
export function renderStatsPanel(container: HTMLElement, getStats: () => ProjectStats): void {
  try {
    container.innerHTML = statsPanelHtml(getStats());
  } catch {
    container.innerHTML = '<p class="stats-panel__unavailable" role="status">Statistiques indisponibles pour le moment.</p>';
  }
}
