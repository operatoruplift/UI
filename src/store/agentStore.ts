import { create } from 'zustand';
import { Agent, getAllAgents, getAgentById } from '@/services/dashboard/hub/agentService';
import {
  getUserInstalledAgents,
  installAgent as installAgentService,
  uninstallAgent as uninstallAgentService,
  isAgentInstalled,
  InstalledAgent,
} from '@/services/dashboard/workspace/installedAgentsService';

interface AgentState {
  agents: Agent[];
  currentAgent: Agent | null;
  installedAgents: InstalledAgent[];
  installedAgentIds: string[];
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  fetchAgentById: (agentId: string) => Promise<void>;
  fetchInstalledAgents: () => Promise<void>;
  installAgent: (agentId: string, metadata?: Record<string, any>) => Promise<void>;
  uninstallAgent: (agentId: string) => Promise<void>;
  checkIfInstalled: (agentId: string) => Promise<boolean>;
  setCurrentAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  currentAgent: null,
  installedAgents: [],
  installedAgentIds: [],
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    try {
      set({ isLoading: true, error: null });

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Looks like I'm unable to connect with your system. Please check your internet connection and try again.")), 30000);
      });

      const agents = await Promise.race([
        getAllAgents(),
        timeoutPromise
      ]) as Agent[];

      set({ agents, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      // Convert technical errors to friendly messages
      let friendlyError = error?.message || "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";

      if (friendlyError.includes('timeout') || friendlyError.includes('Timeout')) {
        friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
      } else if (friendlyError.includes('not authenticated') || friendlyError.includes('401')) {
        friendlyError = "Your session has expired. Please log in again.";
      }

      set({ error: friendlyError, isLoading: false });
    }
  },

  fetchAgentById: async (agentId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Looks like I'm unable to connect with your system. Please check your internet connection and try again.")), 30000);
      });

      const agent = await Promise.race([
        getAgentById(agentId),
        timeoutPromise
      ]) as Agent | null;

      set({ currentAgent: agent, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching agent:', error);
      // Convert technical errors to friendly messages
      let friendlyError = error?.message || "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";

      if (friendlyError.includes('timeout') || friendlyError.includes('Timeout')) {
        friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
      } else if (friendlyError.includes('not authenticated') || friendlyError.includes('401')) {
        friendlyError = "Your session has expired. Please log in again.";
      }

      set({ error: friendlyError, isLoading: false });
    }
  },

  fetchInstalledAgents: async () => {
    try {
      set({ isLoading: true, error: null });

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Looks like I'm unable to connect with your system. Please check your internet connection and try again.")), 30000);
      });

      const installedAgents = await Promise.race([
        getUserInstalledAgents(),
        timeoutPromise
      ]) as InstalledAgent[];

      const installedAgentIds = installedAgents.map(ia => ia.agent_id);
      set({ installedAgents, installedAgentIds, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching installed agents:', error);
      // Convert technical errors to friendly messages
      let friendlyError = error?.message || "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";

      if (friendlyError.includes('timeout') || friendlyError.includes('Timeout')) {
        friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
      } else if (friendlyError.includes('not authenticated') || friendlyError.includes('401')) {
        friendlyError = "Your session has expired. Please log in again.";
      }

      set({ error: friendlyError, isLoading: false });
    }
  },

  installAgent: async (agentId: string, metadata?: Record<string, any>) => {
    try {
      set({ error: null });
      await installAgentService(agentId, metadata);
      // Refresh installed agents list (without showing full-screen loader)
      const installedAgents = await getUserInstalledAgents();
      const installedAgentIds = installedAgents.map(ia => ia.agent_id);
      set({ installedAgents, installedAgentIds });
    } catch (error: any) {
      console.error('Error installing agent:', error);
      // Convert technical errors to friendly messages
      let friendlyError = error?.message || "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";

      if (friendlyError.includes('timeout') || friendlyError.includes('Timeout')) {
        friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
      } else if (friendlyError.includes('not authenticated') || friendlyError.includes('401')) {
        friendlyError = "Your session has expired. Please log in again.";
      }

      set({ error: friendlyError });
      throw new Error(friendlyError);
    }
  },

  uninstallAgent: async (agentId: string) => {
    try {
      set({ error: null });
      await uninstallAgentService(agentId);
      // Refresh installed agents list (without showing full-screen loader)
      const installedAgents = await getUserInstalledAgents();
      const installedAgentIds = installedAgents.map(ia => ia.agent_id);
      set({ installedAgents, installedAgentIds });
    } catch (error: any) {
      console.error('Error uninstalling agent:', error);
      // Convert technical errors to friendly messages
      let friendlyError = error?.message || "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";

      if (friendlyError.includes('timeout') || friendlyError.includes('Timeout')) {
        friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again.";
      } else if (friendlyError.includes('not authenticated') || friendlyError.includes('401')) {
        friendlyError = "Your session has expired. Please log in again.";
      }

      set({ error: friendlyError });
      throw new Error(friendlyError);
    }
  },

  checkIfInstalled: async (agentId: string) => {
    try {
      return await isAgentInstalled(agentId);
    } catch (error: any) {
      console.error('Error checking if agent is installed:', error);
      return false;
    }
  },

  setCurrentAgent: (agent: Agent | null) => set({ currentAgent: agent }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),
}));

