import type { Task } from '../types.js';
import { updateTask } from '../store.js';
import { validateTaskInput, hasErrors } from '../services/taskService.js';
import { showErrors } from './formErrors.js';

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

    const errors = validateTaskInput({ title, description, dueDate }, false);
    showErrors(container, { title: '#edit-title-error', description: '#edit-desc-error', dueDate: '#edit-due-error' }, errors);
    if (hasErrors(errors)) return;

    const result = updateTask(task.id, { title: title.trim(), description, priority, dueDate });
    if (result) onSaved();
  });
}
