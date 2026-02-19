export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Todo' | 'In Progress' | 'Done';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar_url?: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  project: string;
  assignedTo: string | null;
  created_by: string;
  created_at: string;
}

export interface APIResponse<T> {
  data: T | null;
  error: string | null;
}
