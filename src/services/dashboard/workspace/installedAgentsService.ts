import { Agent } from '../hub/agentService';
import { useAuthStore, withAuth } from '@/store/authStore';
import { getUserId } from './utils';

export interface InstalledAgent {
  id: string;
  user_id: string;
  agent_id: string;
  is_active: boolean;
  installed_at: string;
  last_used_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface InstalledAgentWithDetails extends InstalledAgent {
  agent: Agent;
}

/**
 * Get all installed agents for the current user with full agent details
 */
export const getUserInstalledAgentsWithDetails = async (): Promise<InstalledAgentWithDetails[]> => {
  try {
    const userId = getUserId();
    const { data, error } = await withAuth(async (supabase) =>
      supabase.from('installed_agents')
        .select('*, agents (*, agent_builds (*))')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('installed_at', { ascending: false })
    );

    if (error) throw error;

    return ((data as any[]) || []).map((ia: any) => ({
      ...ia,
      agent: {
        ...ia.agents,
        builds: ia.agents?.agent_builds || [],
      },
    }));
  } catch (error) {
    console.error('Error fetching installed agents with details:', error);
    throw error;
  }
};

/**
 * Get all installed agents for the current user
 */
export const getUserInstalledAgents = async (): Promise<InstalledAgent[]> => {
  try {
    const userId = getUserId();
    const { data, error } = await withAuth(async (supabase) =>
      supabase.from('installed_agents')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('installed_at', { ascending: false })
    );

    if (error) throw error;
    return (data as InstalledAgent[]) || [];
  } catch (error) {
    console.error('Error fetching installed agents:', error);
    throw error;
  }
};

/**
 * Check if an agent is installed for the current user
 */
export const isAgentInstalled = async (agentId: string): Promise<boolean> => {
  try {
    const userId = getUserId();
    const { data, error } = await withAuth(async (supabase) =>
      supabase.from('installed_agents')
        .select('id')
        .eq('user_id', userId)
        .eq('agent_id', agentId)
        .eq('is_active', true)
        .single()
    );

    // PGRST116 is "not found" error - this is expected when agent is not installed
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if agent is installed:', error);
    return false;
  }
};

/**
 * Install an agent for the current user
 */
export const installAgent = async (
  agentId: string,
  metadata?: Record<string, any>
): Promise<InstalledAgent> => {
  try {
    const userId = getUserId();
    const now = new Date().toISOString();

    // Check if agent is already installed
    const { data: checkData, error: checkError } = await withAuth(async (supabase) =>
      supabase.from('installed_agents')
        .select('id')
        .eq('user_id', userId)
        .eq('agent_id', agentId)
        .single()
    );

    // If exists, update to active
    if (checkData && !checkError) {
      const { data: updateData, error: updateError } = await withAuth(async (supabase) =>
        supabase.from('installed_agents')
          .update({
            is_active: true,
            installed_at: now,
            metadata: metadata || {},
            updated_at: now,
          })
          .eq('id', checkData.id)
          .select()
          .single()
      );

      if (updateError) throw updateError;
      if (!updateData) throw new Error('Failed to update installed agent');
      return updateData as InstalledAgent;
    }

    // Create new installation
    const { data: insertData, error: insertError } = await withAuth(async (supabase) =>
      supabase.from('installed_agents')
        .insert({
          user_id: userId,
          agent_id: agentId,
          is_active: true,
          metadata: metadata || {},
        })
        .select()
        .single()
    );

    if (insertError) throw insertError;
    if (!insertData) throw new Error('Failed to create installed agent');
    return insertData as InstalledAgent;
  } catch (error) {
    console.error('Error installing agent:', error);
    throw error;
  }
};

/**
 * Uninstall an agent for the current user (soft delete by setting is_active to false)
 * Also deletes downloaded files from local storage
 */
export const uninstallAgent = async (agentId: string): Promise<void> => {
  try {
    const userId = getUserId();

    // Delete agent files from local storage (non-blocking)
    try {
      const { deleteAgentFiles } = await import('./agentFileService');
      await deleteAgentFiles(agentId);
    } catch (fileError) {
      console.warn('Error deleting agent files:', fileError);
    }

    // Clear agent state from localStorage (non-blocking)
    try {
      const { clearAgentState } = await import('../hub/agentStateService');
      clearAgentState(agentId);
    } catch (stateError) {
      console.warn('Error clearing agent state:', stateError);
    }

    // Update database to mark as uninstalled
    const { error } = await withAuth(async (supabase) =>
      supabase.from('installed_agents')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('agent_id', agentId)
    );

    if (error) throw error;
  } catch (error) {
    console.error('Error uninstalling agent:', error);
    throw error;
  }
};

/**
 * Update last used timestamp for an installed agent
 */
export const updateLastUsed = async (agentId: string): Promise<void> => {
  try {
    const userId = getUserId();
    const now = new Date().toISOString();

    const { error } = await withAuth(async (supabase) =>
      supabase.from('installed_agents')
        .update({
          last_used_at: now,
          updated_at: now,
        })
        .eq('user_id', userId)
        .eq('agent_id', agentId)
        .eq('is_active', true)
    );

    if (error) throw error;
  } catch (error) {
    console.error('Error updating last used:', error);
    throw error;
  }
};

/**
 * Get installed agent IDs as an array (for filtering)
 */
export const getInstalledAgentIds = async (): Promise<string[]> => {
  try {
    const installedAgents = await getUserInstalledAgents();
    return installedAgents.map((ia) => ia.agent_id);
  } catch (error) {
    console.error('Error getting installed agent IDs:', error);
    return [];
  }
};
