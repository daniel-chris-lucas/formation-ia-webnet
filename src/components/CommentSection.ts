import { getCommentsByTask, addComment } from '../store.js';
import { validateComment } from '../services/taskService.js';
import { formatDate } from '../utils/date.js';

export function renderCommentSection(container: HTMLElement, taskId: string): void {
  const comments = getCommentsByTask(taskId);

  container.innerHTML = `
    <div style="border-top:1px solid #e2e8f0;margin-top:1rem;padding-top:1rem;">
      <h4 style="font-size:0.9rem;color:#64748b;margin-bottom:0.75rem;">
        Commentaires (${comments.length})
      </h4>
      <div id="comments-list">
        ${comments.length === 0
          ? '<p style="color:#94a3b8;font-size:0.85rem;font-style:italic;">Aucun commentaire.</p>'
          : comments.map(c => `
              <div style="background:#f8fafc;border-radius:6px;padding:0.6rem 0.8rem;margin-bottom:0.5rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem;">
                  <span style="font-size:0.8rem;font-weight:600;color:#475569;">Anonyme</span>
                  <span style="font-size:0.75rem;color:#94a3b8;">${formatDate(c.createdAt)}</span>
                </div>
                <p style="font-size:0.85rem;color:#334155;">${c.content}</p>
              </div>
            `).join('')
        }
      </div>
      <div style="margin-top:0.75rem;">
        <textarea id="new-comment" rows="2" placeholder="Ajouter un commentaire..." style="width:100%;margin-bottom:0.4rem;"></textarea>
        <span id="comment-error" style="color:#ef4444;font-size:0.8rem;display:none;"></span>
        <button id="btn-add-comment" class="btn-primary">Envoyer</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-add-comment')!.addEventListener('click', () => {
    const textarea = container.querySelector<HTMLTextAreaElement>('#new-comment')!;
    const content = textarea.value;
    const err = validateComment(content);
    const errEl = container.querySelector<HTMLElement>('#comment-error')!;
    if (err) { errEl.textContent = err; errEl.style.display = 'block'; return; }
    errEl.style.display = 'none';
    const result = addComment(taskId, content.trim());
    if (result) {
      textarea.value = '';
      renderCommentSection(container, taskId);
    }
  });
}
