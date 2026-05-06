// Modèle de données TaskFlow

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO 8601 "YYYY-MM-DD"
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;   // ISO 8601 "YYYY-MM-DD"
  closedAt?: string; // renseigné quand status passe à DONE ou CANCELLED
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  createdAt: string;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
}
