import axios from 'axios';
import { Project, Task, User, APIResponse } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const sessionToken = localStorage.getItem('taskflow_token');
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to transform backend entities to frontend types
const transform = {
  project: (p: any): Project => ({
    id: p._id || p.id,
    title: p.title,
    description: p.description,
    owner_id: p.owner,
    created_at: p.createdAt || p.created_at
  }),
  task: (t: any): Task => ({
    id: t._id || t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate || t.due_date,
    project: t.project?._id || t.project,
    assignedTo: t.assignedTo?._id || t.assignedTo,
    created_by: t.created_by,
    created_at: t.createdAt || t.created_at
  })
};

/**
 * PRODUCTION API SERVICE
 * Connects to the Node.js/Express backend pulse.
 */
export const api = {
  projects: {
    list: async (): Promise<APIResponse<Project[]>> => {
      try {
        const { data } = await apiClient.get('/projects');
        return { data: data.map(transform.project), error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to fetch projects' };
      }
    },
    get: async (id: string): Promise<APIResponse<Project>> => {
      try {
        const { data } = await apiClient.get(`/projects/${id}`);
        return { data: transform.project(data), error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Project not found' };
      }
    },
    create: async (payload: Omit<Project, 'id' | 'created_at'>): Promise<APIResponse<Project>> => {
      try {
        const { data } = await apiClient.post('/projects', payload);
        return { data: transform.project(data), error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to create project' };
      }
    },
    update: async (id: string, updates: Partial<Project>): Promise<APIResponse<Project>> => {
      try {
        const { data } = await apiClient.put(`/projects/${id}`, updates);
        return { data: transform.project(data), error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to update project' };
      }
    },
    delete: async (id: string): Promise<APIResponse<null>> => {
      try {
        await apiClient.delete(`/projects/${id}`);
        return { data: null, error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to delete project' };
      }
    }
  },

  tasks: {
    list: async (projectId?: string): Promise<APIResponse<Task[]>> => {
      try {
        const { data } = await apiClient.get('/tasks');
        const tasks = data.map(transform.task);
        if (projectId) {
          return { data: tasks.filter((t: Task) => t.project === projectId), error: null };
        }
        return { data: tasks, error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to fetch tasks' };
      }
    },
    create: async (payload: Omit<Task, 'id' | 'created_at'>): Promise<APIResponse<Task>> => {
      try {
        // Backend expects project_id for creation to find the project
        const backendPayload = {
          title: payload.title,
          description: payload.description,
          status: payload.status,
          priority: payload.priority,
          dueDate: payload.dueDate,
          project_id: payload.project,
          assigned_to: payload.assignedTo
        };
        const { data } = await apiClient.post('/tasks', backendPayload);
        return { data: transform.task(data), error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to create task' };
      }
    },
    update: async (id: string, updates: Partial<Task>): Promise<APIResponse<Task>> => {
      try {
        const { data } = await apiClient.put(`/tasks/${id}`, updates);
        return { data: transform.task(data), error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to update task' };
      }
    },
    delete: async (id: string): Promise<APIResponse<null>> => {
      try {
        await apiClient.delete(`/tasks/${id}`);
        return { data: null, error: null };
      } catch (error: any) {
        return { data: null, error: error.response?.data?.message || 'Failed to delete task' };
      }
    }
  },

  profiles: {
    list: async (): Promise<APIResponse<User[]>> => {
      try {
        const { data } = await apiClient.get('/users/me');
        // Ensure data matches User type
        const user: User = {
          id: data.id || data._id,
          name: data.name,
          email: data.email,
          role: data.role === 'admin' ? 'admin' : 'user'
        };
        return { data: [user], error: null };
      } catch (error: any) {
        return { data: null, error: 'Failed to fetch profiles' };
      }
    }
  }
};
