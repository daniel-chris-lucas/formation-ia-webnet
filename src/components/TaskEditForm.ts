import type { Task } from '../types.js';
import { updateTask } from '../store.js';
import { validateDueDate } from '../services/taskService.js';

function validateTitle(title: string): string | null {
  if (!title.trim()) return 'Le titre est requis';
  if (title.trim().length < 3) return 'Le titre doit faire au moins 3 caractères';
  if (title.trim().length > 100) return 'Le titre ne peut pas dépasser 100 caractères';
  return null;
}

function validateDescription(description: string): string | null {
  if (description.length > 500) return 'La description ne peut pas dépasser 500 caractères';
  return null;
}

export function renderTaskEditForm(
  container: HTMLElement,
  task: Task,
  onSaved: () => void,
  onCancel: () => void
): void {
  container.innerHTML = `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:1.2rem;margin-bottom:1rem;">
      <h3 style="margin-bottom:1rem;color:#1e293b;">Modifier la tâche</h3>
      <div style="margin-bottom:0.75rem;">
        <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Titre *</label>
        <input type="text" id="edit-title" value="${task.title}" />
        <span id="edit-title-error" style="color:#ef4444;font-size:0.8rem;display:none;"></span>
      </div>
      <div style="margin-bottom:0.75rem;">
        <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Description</label>
        <textarea id="edit-desc" rows="3" style="width:100%;">${task.description}</textarea>
        <span id="edit-desc-error" style="color:#ef4444;font-size:0.8rem;display:none;"></span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
        <div>
          <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Priorité</label>
          <select id="edit-priority">
            <option value="LOW" ${task.priority === 'LOW' ? 'selected' : ''}>Low</option>
            <option value="MEDIUM" ${task.priority === 'MEDIUM' ? 'selected' : ''}>Medium</option>
            <option value="HIGH" ${task.priority === 'HIGH' ? 'selected' : ''}>High</option>
            <option value="CRITICAL" ${task.priority === 'CRITICAL' ? 'selected' : ''}>Critical</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:0.25rem;">Échéance</label>
          <input type="date" id="edit-due" value="${task.dueDate}" />
          <span id="edit-due-error" style="color:#ef4444;font-size:0.8rem;display:none;"></span>
        </div>
      </div>
      <div style="display:flex;gap:0.5rem;">
        <button id="btn-save-task" class="btn-primary">Enregistrer</button>
        <button id="btn-cancel-edit" class="btn-secondary">Annuler</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-cancel-edit')!.addEventListener('click', onCancel);

  container.querySelector('#btn-save-task')!.addEventListener('click', () => {
    const title = (container.querySelector<HTMLInputElement>('#edit-title')!).value;
    const description = (container.querySelector<HTMLTextAreaElement>('#edit-desc')!).value;
    const priority = (container.querySelector<HTMLSelectElement>('#edit-priority')!).value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    const dueDate = (container.querySelector<HTMLInputElement>('#edit-due')!).value;

    let valid = true;
    const showErr = (id: string, msg: string | null) => {
      const el = container.querySelector<HTMLElement>(id)!;
      if (msg) { el.textContent = msg; el.style.display = 'block'; valid = false; }
      else el.style.display = 'none';
    };
    showErr('#edit-title-error', validateTitle(title));
    showErr('#edit-desc-error', validateDescription(description));
    showErr('#edit-due-error', validateDueDate(dueDate, false));

    if (!valid) return;

    const result: any = updateTask(task.id, { title: title.trim(), description, priority, dueDate });
    if (result) onSaved();
  });
}
