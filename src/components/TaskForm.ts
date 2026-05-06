import { addTask } from '../store.js';
import { validateDueDate } from '../services/taskService.js';
import { todayIso } from '../utils/date.js';

function validateTitle(title: string): string | null {
  if (!title.trim()) return 'Le titre est obligatoire';
  if (title.trim().length < 3) return 'Le titre doit faire au moins 3 caractères';
  if (title.trim().length > 100) return 'Le titre ne peut pas dépasser 100 caractères';
  return null;
}

function validateDescription(description: string): string | null {
  if (description.length > 500) return 'La description ne peut pas dépasser 500 caractères';
  return null;
}

export function renderTaskForm(
  container: HTMLElement,
  projectId: string,
  onCreated: () => void,
  onCancel: () => void
): void {
  container.innerHTML = `
    <div style="background:#fff;border-radius:8px;padding:1.2rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);margin-bottom:1rem;">
      <h3 style="margin-bottom:1rem;color:#1e293b;">Nouvelle tâche</h3>
      <div style="margin-bottom:0.75rem;">
        <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Titre *</label>
        <input type="text" id="task-title" placeholder="Titre de la tâche" />
        <span id="title-error" style="color:#ef4444;font-size:0.8rem;display:none;"></span>
      </div>
      <div style="margin-bottom:0.75rem;">
        <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Description</label>
        <textarea id="task-desc" rows="3" placeholder="Description optionnelle..." style="width:100%;"></textarea>
        <span id="desc-error" style="color:#ef4444;font-size:0.8rem;display:none;"></span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
        <div>
          <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Priorité</label>
          <select id="task-priority">
            <option value="LOW">Low</option>
            <option value="MEDIUM" selected>Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Échéance *</label>
          <input type="date" id="task-due" min="${todayIso()}" value="${todayIso()}" />
          <span id="due-error" style="color:#ef4444;font-size:0.8rem;display:none;"></span>
        </div>
      </div>
      <div style="display:flex;gap:0.5rem;">
        <button id="btn-create-task" class="btn-primary">Créer la tâche</button>
        <button id="btn-cancel-task" class="btn-secondary">Annuler</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-cancel-task')!.addEventListener('click', onCancel);

  container.querySelector('#btn-create-task')!.addEventListener('click', () => {
    const title = (container.querySelector<HTMLInputElement>('#task-title')!).value;
    const description = (container.querySelector<HTMLTextAreaElement>('#task-desc')!).value;
    const priority = (container.querySelector<HTMLSelectElement>('#task-priority')!).value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    const dueDate = (container.querySelector<HTMLInputElement>('#task-due')!).value;

    let valid = true;
    const titleErr = validateTitle(title);
    const descErr = validateDescription(description);
    const dueErr = validateDueDate(dueDate, true);

    const showErr = (id: string, msg: string | null) => {
      const el = container.querySelector<HTMLElement>(id)!;
      if (msg) { el.textContent = msg; el.style.display = 'block'; valid = false; }
      else el.style.display = 'none';
    };
    showErr('#title-error', titleErr);
    showErr('#desc-error', descErr);
    showErr('#due-error', dueErr);

    if (!valid) return;

    addTask({ projectId, title: title.trim(), description, status: 'TODO', priority, dueDate });
    onCreated();
  });
}
