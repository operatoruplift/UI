import { useAuthStore, withAuth } from '@/store/authStore';

export interface AgentBuild {
  id: string;
  agent_id: string;
  platform: 'windows' | 'mac' | 'android' | 'iphone' | 'linux';
  description?: string;
  how_it_works?: string;
  access_required?: string;
  build_file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  website_url?: string;
  terms_and_condition?: string;
  privacy_policy?: string;
  logo_url?: string;
  author: string;
  access_url?: string;
  data_json_endpoint?: string;
  created_at: string;
  updated_at: string;
  builds?: AgentBuild[]; // Related builds
}

/**
 * Fetch all agents (public agents, not filtered by user_id)
 * In a marketplace, we typically show all agents
 */
export const getAllAgents = async (): Promise<Agent[]> => {
  try {
    // Fetch agents with their builds
    const { data: agents, error: agentsError } = await withAuth(async (supabase, token) =>
      supabase
      .from('agents')
      .select(`*`)
      .order('created_at', { ascending: false })
    );
    
    if (agentsError) throw agentsError;
    
    // Map the data to include builds
    return (agents || []).map((agent: any) => ({
      ...agent,
      builds: agent.agent_builds || [],
    }));
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

/**
 * Fetch a single agent by ID with builds
 */
export const getAgentById = async (agentId: string): Promise<Agent | null> => {
  try {
    const { data: agent, error } = await withAuth(async (supabase, token) =>
      supabase
      .from('agents')
      .select(`
        *,
        agent_builds (*)
      `)
      .eq('id', agentId)
      .single()
    );

    if (error) throw error;

    if (!agent) return null;

    return {
      ...agent,
      builds: agent.agent_builds || [],
    };
  } catch (error: any) {
    console.error('Error fetching agent:', error);
    throw error;
  }
};

/**
 * Fetch agents by user_id (for user's own agents)
 */
export const getUserAgents = async (userId: string): Promise<Agent[]> => {
  try {
    const { data: agents, error } = await withAuth(async (supabase, token) =>
      supabase
      .from('agents')
      .select(`
        *,
        agent_builds (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    );

    if (error) throw error;

    // Map the data
    return (agents || []).map((agent: any) => ({
      ...agent,
      builds: agent.agent_builds || [],
    }));
  } catch (error: any) {
    console.error('Error fetching user agents:', error);
    throw error;
  }
};

