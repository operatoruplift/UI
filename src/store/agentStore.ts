import { create } from 'zustand';
import { Agent, getAllAgents, getAgentById } from '@/services/dashboard/hub/agentService';
import {
  getUserInstalledAgents,
  installAgent as installAgentService,
  uninstallAgent as uninstallAgentService,
  isAgentInstalled,
  InstalledAgent,
} from '@/services/dashboard/workspace/installedAgentsService';
import {
  listRuntimeAgents,
  RuntimeAgent,
} from '@/services/dashboard/runtime/runtimeAgentsService';

/**
 * Map Rust runtime agents into the Supabase-shaped `Agent` type used by the
 * Hub UI. This lets demo mode show real agents from the Rust runtime without
 * touching the hub components.
 */
function runtimeAgentToHubAgent(ra: RuntimeAgent): Agent {
  return {
    id: ra.id,
    user_id: 'runtime',
    name: ra.name,
    author: ra.provider || 'Operator Uplift',
    logo_url: undefined,
    website_url: undefined,
    terms_and_condition: undefined,
    privacy_policy: undefined,
    access_url: undefined,
    data_json_endpoint: undefined,
    created_at: ra.created_at || new Date().toISOString(),
    updated_at: ra.updated_at || new Date().toISOString(),
    builds: [],
  } as Agent;
}

/**
 * Demo-mode fallback catalog. Used when neither Supabase nor the Rust
 * runtime returns agents. Matches the website store so the app and site
 * stay in sync even offline.
 */
const FALLBACK_AGENTS: Agent[] = [
  {
    id: 'demo-agent',
    user_id: 'runtime',
    name: 'Demo Agent',
    author: 'Operator Uplift',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    builds: [],
  } as Agent,
  {
    id: 'calendar-agent',
    user_id: 'runtime',
    name: 'Calendar Agent',
    author: 'Operator Uplift',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    builds: [],
  } as Agent,
  {
    id: 'x402-agent',
    user_id: 'runtime',
    name: 'x402 Web3 Agent',
    author: 'Operator Uplift',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    builds: [],
  } as Agent,
  {
    id: 'memory-agent',
    user_id: 'runtime',
    name: 'Memory Agent',
    author: 'Operator Uplift',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    builds: [],
  } as Agent,
  {
    id: 'mcp-agent',
    user_id: 'runtime',
    name: 'MCP Tool Agent',
    author: 'Operator Uplift',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    builds: [],
  } as Agent,
];

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
    set({ isLoading: true, error: null });

    // 1. Prefer the Rust runtime (works in demo mode with no auth).
    try {
      const runtimeAgents = await listRuntimeAgents();
      if (runtimeAgents.length > 0) {
        const mapped = runtimeAgents.map(runtimeAgentToHubAgent);
        // Merge runtime agents with the fallback catalog so every promised
        // agent is visible even if only demo-agent is registered in the DB.
        const byId = new Map<string, Agent>();
        for (const a of mapped) byId.set(a.id, a);
        for (const a of FALLBACK_AGENTS) if (!byId.has(a.id)) byId.set(a.id, a);
        set({ agents: Array.from(byId.values()), isLoading: false });
        return;
      }
    } catch (runtimeErr) {
      console.warn('Runtime agents unreachable, falling back:', runtimeErr);
    }

    // 2. Fall back to Supabase (production / authed path).
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 10000);
      });
      const agents = (await Promise.race([
        getAllAgents(),
        timeoutPromise,
      ])) as Agent[];
      if (agents && agents.length > 0) {
        set({ agents, isLoading: false });
        return;
      }
    } catch (supabaseErr) {
      console.warn('Supabase agents unavailable, using fallback:', supabaseErr);
    }

    // 3. Last resort: static fallback so the hub is never empty on stage.
    set({ agents: FALLBACK_AGENTS, isLoading: false });
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
    set({ error: null });

    // Runtime-sourced agents (shown in demo mode) are "installed" by
    // simply adding them to the in-memory installed list. The Supabase
    // install table doesn't apply — there's no user_id to write against.
    const agent = get().agents.find((a) => a.id === agentId);
    const isRuntimeSourced = agent?.user_id === 'runtime';

    if (isRuntimeSourced) {
      const current = get().installedAgentIds;
      if (!current.includes(agentId)) {
        set({ installedAgentIds: [...current, agentId] });
      }
      return;
    }

    try {
      await installAgentService(agentId, metadata);
      const installedAgents = await getUserInstalledAgents();
      const installedAgentIds = installedAgents.map(ia => ia.agent_id);
      set({ installedAgents, installedAgentIds });
    } catch (error: any) {
      console.error('Error installing agent:', error);
      let friendlyError = error?.message || "Unable to install agent right now.";
      if (friendlyError.includes('timeout') || friendlyError.includes('Timeout')) {
        friendlyError = "Install timed out. Please try again.";
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

