import { create } from 'zustand';
import { 
  checkProjectServiceHealth, 
  getProjects, 
  createProject, 
  updateProjectName,
  updateProjectDescription,
  updateProjectStoragePath,
  getProjectStoragePath,
  getSessions,
  createSession,
  updateSessionName,
  deleteSession,
  getSessionLLMModel,
  updateSessionLLMModel,
  deleteProject,
  Project,
  Session
} from '@/services/dashboard/packages/projectService';

// Re-export types for convenience
export type { Project, Session };

interface ProjectState {
  projects: Project[];
  isHealthy: boolean;
  isLoading: boolean;
  error: string | null;
  checkHealth: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  addProject: (name: string) => Promise<void>;
  updateProjectName: (projectId: string, name: string) => Promise<void>;
  updateProjectDescription: (projectId: string, description: string) => Promise<void>;
  updateProjectStoragePath: (projectId: string, storagePath: string) => Promise<void>;
  getProjectStoragePath: (projectId: string) => Promise<string | null>;
  fetchSessions: (projectId: string) => Promise<void>;
  addSession: (projectId: string, name: string) => Promise<void>;
  updateSessionName: (projectId: string, sessionId: string, name: string) => Promise<void>;
  getSessionLLMModel: (sessionId: string) => Promise<string>;
  updateSessionLLMModel: (sessionId: string, llmId: string) => Promise<void>;
  removeSession: (projectId: string, sessionId: string) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isHealthy: false,
  isLoading: false,
  error: null,

  checkHealth: async () => {
    try {
      set({ isLoading: true, error: null });
      const isHealthy = await checkProjectServiceHealth();
      set({ isHealthy, isLoading: false });
    } catch (error: any) {
      console.error('Error checking project service health:', error);
      set({ 
        isHealthy: false, 
        error: error?.message || 'Failed to connect to project service',
        isLoading: false 
      });
    }
  },

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // First check health
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
          isLoading: false 
        });
        return;
      }

      // If healthy, fetch projects
      const projects = await getProjects();
      set({ projects, isHealthy: true, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      set({ 
        isHealthy: false,
        error: error?.message || 'Failed to fetch projects',
        isLoading: false 
      });
    }
  },

  addProject: async (name: string) => {
    try {
      // Don't set global isLoading to avoid full screen refresh
      // Check health first
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      const newProject = await createProject({ name });
      set((state) => ({
        projects: [...state.projects, newProject],
      }));
    } catch (error: any) {
      console.error('Error creating project:', error);
      set({ 
        error: error?.message || 'Failed to create project',
      });
      throw error;
    }
  },

  updateProjectName: async (projectId: string, name: string) => {
    try {
      // Don't set global isLoading to avoid full screen refresh
      // Check health first
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      const updatedProject = await updateProjectName(projectId, { name });
      set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
      }));
    } catch (error: any) {
      console.error('Error updating project name:', error);
      set({ 
        error: error?.message || 'Failed to update project name',
      });
      throw error;
    }
  },

  updateProjectDescription: async (projectId: string, description: string) => {
    try {
      // Don't set global isLoading to avoid full screen refresh
      // Check health first
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      const updatedProject = await updateProjectDescription(projectId, { description });
      set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
      }));
    } catch (error: any) {
      console.error('Error updating project description:', error);
      set({ 
        error: error?.message || 'Failed to update project description',
      });
      throw error;
    }
  },

  updateProjectStoragePath: async (projectId: string, storagePath: string) => {
    try {
      // Don't set global isLoading to avoid full screen refresh
      // Check health first
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      const updatedProject = await updateProjectStoragePath(projectId, storagePath);
      set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
      }));
    } catch (error: any) {
      console.error('Error updating storage path:', error);
      set({ 
        error: error?.message || 'Failed to update storage path',
      });
      throw error;
    }
  },

  getProjectStoragePath: async (projectId: string) => {
    try {
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        throw new Error('Project service is not available');
      }

      return await getProjectStoragePath(projectId);
    } catch (error: any) {
      console.error('Error getting storage path:', error);
      throw error;
    }
  },

  fetchSessions: async (projectId: string) => {
    try {
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        throw new Error('Project service is not available');
      }

      const sessions = await getSessions(projectId);
      set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId ? { ...p, sessions } : p
        ),
      }));
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  addSession: async (projectId: string, name: string) => {
    try {
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      const newSession = await createSession(projectId, { name, llm_id: 'auto' });
      set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { ...p, sessions: [...(p.sessions || []), newSession] }
            : p
        ),
      }));
    } catch (error: any) {
      console.error('Error creating session:', error);
      set({ 
        error: error?.message || 'Failed to create session',
      });
      throw error;
    }
  },

  updateSessionName: async (projectId: string, sessionId: string, name: string) => {
    try {
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      const updatedSession = await updateSessionName(sessionId, { name });
      set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { 
                ...p, 
                sessions: p.sessions?.map(s => 
                  s.id === sessionId ? updatedSession : s
                ) || []
              }
            : p
        ),
      }));
    } catch (error: any) {
      console.error('Error updating session name:', error);
      set({ 
        error: error?.message || 'Failed to update session name',
      });
      throw error;
    }
  },

  getSessionLLMModel: async (sessionId: string) => {
    try {
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        throw new Error('Project service is not available');
      }

      return await getSessionLLMModel(sessionId);
    } catch (error: any) {
      console.error('Error getting session LLM model:', error);
      throw error;
    }
  },

  updateSessionLLMModel: async (sessionId: string, llmId: string) => {
    try {
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      await updateSessionLLMModel(sessionId, llmId);
    } catch (error: any) {
      console.error('Error updating session LLM model:', error);
      set({ 
        error: error?.message || 'Failed to update session LLM model',
      });
      throw error;
    }
  },

  removeSession: async (projectId: string, sessionId: string) => {
    try {
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      await deleteSession(sessionId);
      set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { 
                ...p, 
                sessions: p.sessions?.filter(s => s.id !== sessionId) || []
              }
            : p
        ),
      }));
    } catch (error: any) {
      console.error('Error deleting session:', error);
      set({ 
        error: error?.message || 'Failed to delete session',
      });
      throw error;
    }
  },

  removeProject: async (projectId: string) => {
    try {
      // Don't set global isLoading to avoid full screen refresh
      // Check health first
      const isHealthy = await checkProjectServiceHealth();
      if (!isHealthy) {
        set({ 
          isHealthy: false, 
          error: 'Project service is not available',
        });
        throw new Error('Project service is not available');
      }

      await deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
      }));
    } catch (error: any) {
      console.error('Error deleting project:', error);
      set({ 
        error: error?.message || 'Failed to delete project',
      });
      throw error;
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),
}));

