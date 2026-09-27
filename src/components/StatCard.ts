export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'danger';
  /** Pourcentage 0–100 : affiche une barre de progression accessible. */
  progress?: number;
}

/** Carte KPI (maquettes/maquette-stats-*.png). Styles : src/styles/components/_stat-card.scss. */
export function statCardHtml({ label, value, hint, tone = 'default', progress }: StatCardProps): string {
  const pct = progress === undefined ? undefined : Math.max(0, Math.min(100, Math.round(progress)));
  return `
    <div class="stat-card${tone === 'danger' ? ' stat-card--danger' : ''}">
      <span class="stat-card__label">${label}</span>
      <span class="stat-card__value">${value}</span>
      ${pct === undefined ? '' : `
      <div class="stat-card__progress" role="progressbar" aria-label="${label}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="stat-card__progress-bar" style="--progress: ${pct}%"></div>
      </div>`}
      ${hint ? `<span class="stat-card__hint">${hint}</span>` : ''}
    </div>`;
}
