import type { AppState, Project, Task, Comment } from './types.js';
import { generateId } from './utils/ids.js';

const STORAGE_KEY = 'taskflow_state';

function getState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { projects: [], tasks: [], comments: [] };
  return JSON.parse(raw) as AppState;
}

function setState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getAll<K extends keyof AppState>(key: K): AppState[K] {
  return getState()[key];
}

// --- Projects ---
export function getProjects(): Project[] {
  return getState().projects;
}

export function addProject(data: Omit<Project, 'id' | 'createdAt'>): Project {
  const state = getState();
  const project: Project = {
    id: generateId(),
    createdAt: new Date().toISOString().split('T')[0],
    ...data,
  };
  state.projects.push(project);
  setState(state);
  return project;
}

export function deleteProject(id: string): void {
  const state = getState();
  state.projects = state.projects.filter(p => p.id !== id);
  setState(state);
}

// --- Tasks ---
export function getTasks(): Task[] {
  return getState().tasks;
}

export function getTasksByProject(projectId: string): Task[] {
  return getState().tasks.filter(t => t.projectId === projectId);
}

export function addTask(data: Omit<Task, 'id' | 'createdAt'>): Task {
  const state = getState();
  const task: Task = {
    id: generateId(),
    createdAt: new Date().toISOString().split('T')[0],
    ...data,
  };
  state.tasks.push(task);
  setState(state);
  return task;
}

export function updateTask(id: string, changes: Partial<Task>): Task | null {
  const state = getState();
  const idx = state.tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  state.tasks[idx] = { ...state.tasks[idx], ...changes };
  setState(state);
  return state.tasks[idx];
}

export function deleteTask(id: string): void {
  const state = getState();
  state.tasks = state.tasks.filter(t => t.id !== id);
  state.comments = state.comments.filter(c => c.taskId !== id);
  setState(state);
}

// --- Comments ---
export function getCommentsByTask(taskId: string): Comment[] {
  return getState().comments.filter(c => c.taskId === taskId);
}

export function addComment(taskId: string, content: string): Comment {
  const state = getState();
  const comment: Comment = {
    id: generateId(),
    taskId,
    content,
    createdAt: new Date().toISOString().split('T')[0],
  };
  state.comments.push(comment);
  setState(state);
  return comment;
}

// Seeding au premier démarrage
export function seedIfEmpty(): void {
  const state = getState();
  if (state.projects.length > 0) return;

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const addDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return fmt(d);
  };

  const p1: Project = { id: 'p1', name: 'Refonte portail client', description: 'Modernisation du portail client B2B', createdAt: addDays(-60) };
  const p2: Project = { id: 'p2', name: 'Migration base de données', description: 'Migration PostgreSQL 12 → 16', createdAt: addDays(-90) };

  const tasks: Task[] = [
    { id: 't1', projectId: 'p1', title: 'Maquettes homepage', description: 'Concevoir les maquettes Figma de la page d\'accueil', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: fmt(today), createdAt: addDays(-15) },
    { id: 't2', projectId: 'p1', title: 'Intégration API paiement', description: 'Connecter Stripe pour le flux de checkout', status: 'TODO', priority: 'CRITICAL', dueDate: addDays(3), createdAt: addDays(-10) },
    { id: 't3', projectId: 'p1', title: 'Tests e2e checkout', description: 'Playwright — parcours achat complet', status: 'TODO', priority: 'MEDIUM', dueDate: addDays(7), createdAt: addDays(-5) },
    { id: 't4', projectId: 'p2', title: 'Script de migration', description: 'Script pg_dump + restore avec validation', status: 'DONE', priority: 'HIGH', dueDate: addDays(-30), closedAt: addDays(-10), createdAt: addDays(-80) },
    { id: 't5', projectId: 'p2', title: 'Validation des données', description: 'Vérifier l\'intégrité post-migration sur 100 tables', status: 'DONE', priority: 'HIGH', dueDate: addDays(-20), closedAt: addDays(-3), createdAt: addDays(-70) },
    { id: 't6', projectId: 'p2', title: 'Rapport de migration', description: 'Rédiger le rapport de fin de projet', status: 'CANCELLED', priority: 'LOW', dueDate: addDays(-15), closedAt: addDays(-2), createdAt: addDays(-60) },
  ];

  const comments: Comment[] = [
    { id: 'c1', taskId: 't1', content: 'Première version validée par le client', createdAt: addDays(-12) },
    { id: 'c2', taskId: 't1', content: 'Retour : changer la palette de couleurs', createdAt: addDays(-8) },
    { id: 'c3', taskId: 't1', content: 'Nouvelle version envoyée pour validation', createdAt: addDays(-3) },
  ];

  setState({ projects: [p1, p2], tasks, comments });
}
