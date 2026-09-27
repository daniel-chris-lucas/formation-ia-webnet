import { seedIfEmpty, getProjects, getTasksByProject } from './store.js';
import { renderProjectList } from './components/ProjectList.js';
import { renderTaskCard } from './components/TaskCard.js';
import { renderTaskForm } from './components/TaskForm.js';
import { renderTaskEditForm } from './components/TaskEditForm.js';
import { renderCommentSection } from './components/CommentSection.js';
import { renderFilterBar } from './components/FilterBar.js';
import { filterTasks, EMPTY_FILTER, type TaskFilter } from './utils/filterTasks.js';

let selectedProjectId: string | null = null;
let showTaskForm = false;
let editingTaskId: string | null = null;
let viewingTaskId: string | null = null;
let taskFilter: TaskFilter = { ...EMPTY_FILTER };

export function initApp(root: HTMLElement): void {
  seedIfEmpty();

  const projects = getProjects();
  if (projects.length > 0 && !selectedProjectId) {
    selectedProjectId = projects[0].id;
  }

  render(root);
}

function render(root: HTMLElement): void {
  root.innerHTML = `
    <div id="sidebar" style="width:260px;background:#1e293b;color:#fff;padding:1rem;flex-shrink:0;min-height:100vh;"></div>
    <div id="main" style="flex:1;padding:1.5rem;max-width:780px;"></div>
  `;

  const sidebar = root.querySelector<HTMLElement>('#sidebar')!;
  const main = root.querySelector<HTMLElement>('#main')!;

  renderProjectList(
    sidebar,
    selectedProjectId,
    (id) => { selectedProjectId = id; showTaskForm = false; editingTaskId = null; viewingTaskId = null; render(root); },
    () => render(root)
  );

  renderMain(main, root);
}

function renderMain(main: HTMLElement, root: HTMLElement): void {
  if (!selectedProjectId) {
    main.innerHTML = '<p style="color:#94a3b8;margin-top:2rem;text-align:center;">Sélectionnez un projet dans la sidebar.</p>';
    return;
  }

  const projects = getProjects();
  const project = projects.find(p => p.id === selectedProjectId);
  if (!project) return;

  const allTasks = getTasksByProject(selectedProjectId);
  const tasks = filterTasks(allTasks, taskFilter);

  main.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;">
      <div>
        <h2 style="font-size:1.4rem;color:#1e293b;font-weight:700;">${project.name}</h2>
        ${project.description ? `<p style="color:#64748b;font-size:0.9rem;margin-top:0.2rem;">${project.description}</p>` : ''}
      </div>
      <button id="btn-show-form" class="btn-primary">+ Nouvelle tâche</button>
    </div>
    <div id="task-form-container"></div>
    <div id="filter-bar"></div>
    <div id="task-list"></div>
    <div id="task-detail"></div>
  `;

  main.querySelector('#btn-show-form')!.addEventListener('click', () => {
    showTaskForm = true; editingTaskId = null; viewingTaskId = null;
    renderMain(main, root);
  });

  if (showTaskForm) {
    renderTaskForm(
      main.querySelector<HTMLElement>('#task-form-container')!,
      selectedProjectId!,
      () => { showTaskForm = false; render(root); },
      () => { showTaskForm = false; renderMain(main, root); }
    );
  }

  renderFilterBar(main.querySelector<HTMLElement>('#filter-bar')!, taskFilter, (f) => {
    taskFilter = f;
    renderTaskList(main, root, filterTasks(allTasks, taskFilter), allTasks.length);
  });
  renderTaskList(main, root, tasks, allTasks.length);
}

function renderTaskList(main: HTMLElement, root: HTMLElement, tasks: ReturnType<typeof getTasksByProject>, totalCount: number): void {
  const listEl = main.querySelector<HTMLElement>('#task-list')!;
  listEl.innerHTML = '';

  if (tasks.length === 0) {
    listEl.innerHTML = `<p style="color:#94a3b8;font-style:italic;">${totalCount === 0 ? 'Aucune tâche dans ce projet.' : 'Aucune tâche ne correspond aux filtres.'}</p>`;
  } else {
    tasks.forEach(task => {
      if (editingTaskId === task.id) {
        const wrapper = document.createElement('div');
        renderTaskEditForm(
          wrapper, task,
          () => { editingTaskId = null; render(root); },
          () => { editingTaskId = null; renderMain(main, root); }
        );
        listEl.appendChild(wrapper);
      } else {
        const card = renderTaskCard(task, () => render(root));

        // Bouton d'édition dans la card
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️ Modifier';
        editBtn.className = 'btn-ghost';
        editBtn.style.fontSize = '0.8rem';
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          editingTaskId = task.id;
          viewingTaskId = null;
          showTaskForm = false;
          renderMain(main, root);
        });

        // Toggle commentaires
        const commentsBtn = document.createElement('button');
        commentsBtn.textContent = viewingTaskId === task.id ? '▲ Masquer commentaires' : '💬 Commentaires';
        commentsBtn.className = 'btn-ghost';
        commentsBtn.style.fontSize = '0.8rem';
        commentsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          viewingTaskId = viewingTaskId === task.id ? null : task.id;
          renderMain(main, root);
        });

        const actionsRow = card.querySelector('.task-actions')!;
        actionsRow.appendChild(editBtn);
        actionsRow.appendChild(commentsBtn);

        if (viewingTaskId === task.id) {
          const commentContainer = document.createElement('div');
          renderCommentSection(commentContainer, task.id);
          card.appendChild(commentContainer);
        }

        listEl.appendChild(card);
      }
    });
  }
}
