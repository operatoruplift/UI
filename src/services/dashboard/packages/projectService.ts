const PROJECT_API_ENDPOINT = 'http://localhost:45793';

export interface Project {
  id: string;
  name: string;
  description?: string;
  storage_path?: string;
  sessions?: Session[];
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: string;
  name: string;
  memory?: boolean;
}

/**
 * Check if the project service is healthy
 * @returns Promise<boolean> - true if service is healthy (200 status), false otherwise
 */
export const checkProjectServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error checking project service health:', error);
    return false;
  }
};

/**
 * Get all projects from the service
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Create a new project
 */
export const createProject = async (projectData: { name: string }): Promise<Project> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update a project name
 */
export const updateProjectName = async (projectId: string, projectData: { name: string }): Promise<Project> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects/${projectId}/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project name: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project name:', error);
    throw error;
  }
};

/**
 * Update a project description
 */
export const updateProjectDescription = async (projectId: string, projectData: { description: string }): Promise<Project> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects/${projectId}/description`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project description: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project description:', error);
    throw error;
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Get project storage path
 */
export const getProjectStoragePath = async (projectId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects/${projectId}/storage-path`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get storage path: ${response.statusText}`);
    }

    const data = await response.json();
    return data.storage_path || null;
  } catch (error) {
    console.error('Error getting storage path:', error);
    throw error;
  }
};

/**
 * Update project storage path
 */
export const updateProjectStoragePath = async (projectId: string, storagePath: string): Promise<Project> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects/${projectId}/storage-path`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storage_path: storagePath }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update storage path: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating storage path:', error);
    throw error;
  }
};

/**
 * Get sessions for a project
 */
export const getSessions = async (projectId: string): Promise<Session[]> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects/${projectId}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

/**
 * Create a new session
 */
export const createSession = async (projectId: string, sessionData: { name: string; llm_id: string }): Promise<Session> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/projects/${projectId}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Update a session name
 */
export const updateSessionName = async (sessionId: string, sessionData: { name: string }): Promise<Session> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/sessions/${sessionId}/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update session name: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating session name:', error);
    throw error;
  }
};

/**
 * Delete a session
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

/**
 * Get LLM model for a session
 */
export const getSessionLLMModel = async (sessionId: string): Promise<string> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/sessions/${sessionId}/llm-model`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get session LLM model: ${response.statusText}`);
    }

    const data = await response.json();
    return data.llm_id || 'auto';
  } catch (error) {
    console.error('Error getting session LLM model:', error);
    throw error;
  }
};

/**
 * Update LLM model for a session
 */
export const updateSessionLLMModel = async (sessionId: string, llmId: string): Promise<void> => {
  try {
    const response = await fetch(`${PROJECT_API_ENDPOINT}/sessions/${sessionId}/llm-model`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ llm_id: llmId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update session LLM model: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating session LLM model:', error);
    throw error;
  }
};

