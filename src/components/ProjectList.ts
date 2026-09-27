import { getProjects, addProject, getTasksByProject } from '../store.js';
import { isProjectActive } from '../services/taskService.js';

export function renderProjectList(
  container: HTMLElement,
  selectedProjectId: string | null,
  onSelect: (id: string) => void,
  onRefresh: () => void
): void {
  const projects = getProjects();
  const allTasks = projects.flatMap(p => getTasksByProject(p.id));

  container.innerHTML = `
    <h1>TaskFlow</h1>
    <div id="project-list" style="margin-bottom: 1rem;">
      ${projects.map(p => {
        const active = isProjectActive(p.id, allTasks);
        const selected = p.id === selectedProjectId;
        return `
          <div style="
            padding: 0.6rem 0.8rem;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 0.3rem;
            background: ${selected ? '#3b82f6' : 'transparent'};
            display: flex;
            align-items: center;
            justify-content: space-between;
          " data-project-id="${p.id}">
            <span style="font-size: 0.9rem;">
              ${active ? '🟢' : '✅'} ${p.name}
            </span>
          </div>`;
      }).join('')}
    </div>
    <button id="btn-add-project" class="btn-primary" style="width:100%; margin-top:0.5rem;">
      + Nouveau projet
    </button>
    <div id="add-project-form" style="display:none; margin-top: 0.8rem;">
      <input type="text" id="new-project-name" placeholder="Nom du projet" style="margin-bottom: 0.4rem;" />
      <textarea id="new-project-desc" placeholder="Description (optionnelle)" rows="2" style="margin-bottom: 0.4rem; width:100%; border:1px solid #475569; background:#334155; color:#fff; border-radius:4px; padding:0.4rem;"></textarea>
      <div style="display:flex; gap:0.4rem;">
        <button id="btn-confirm-project" class="btn-primary" style="flex:1;">Créer</button>
        <button id="btn-cancel-project" class="btn-secondary" style="flex:1;">Annuler</button>
      </div>
    </div>
  `;

  // Style des inputs dans la sidebar
  const inputs = container.querySelectorAll<HTMLInputElement>('input');
  inputs.forEach(el => {
    el.style.background = '#334155';
    el.style.color = '#fff';
    el.style.border = '1px solid #475569';
  });

  // Sélection projet
  container.querySelectorAll<HTMLElement>('[data-project-id]').forEach(el => {
    el.addEventListener('click', () => onSelect(el.dataset.projectId!));
  });

  // Formulaire ajout projet
  const btnAdd = container.querySelector<HTMLButtonElement>('#btn-add-project')!;
  const form = container.querySelector<HTMLElement>('#add-project-form')!;
  btnAdd.addEventListener('click', () => { form.style.display = 'block'; btnAdd.style.display = 'none'; });
  container.querySelector('#btn-cancel-project')!.addEventListener('click', () => {
    form.style.display = 'none'; btnAdd.style.display = 'block';
  });
  container.querySelector('#btn-confirm-project')!.addEventListener('click', () => {
    const name = (container.querySelector<HTMLInputElement>('#new-project-name')!).value.trim();
    if (!name) { alert('Le nom est obligatoire'); return; }
    addProject({ name, description: (container.querySelector<HTMLTextAreaElement>('#new-project-desc')!).value });
    onRefresh();
  });
}
