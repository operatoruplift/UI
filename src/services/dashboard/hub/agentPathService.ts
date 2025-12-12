/**
 * Service for agent path utilities
 */

/**
 * Get the download path for an agent
 * Format: agents/agent-id/
 */
export const getAgentDownloadPath = async (agentId: string): Promise<string> => {
  if (typeof window === 'undefined' || !(window as any).electronAPI) {
    throw new Error('Electron API not available');
  }

  const userDataPath = await (window as any).electronAPI.getUserDataPath();
  // Use forward slashes - Node.js path.join will handle conversion on Windows
  // We'll pass this to main process which uses path.join
  return `${userDataPath}/agents/${agentId}`;
};

/**
 * Get file extension from URL
 */
export const getFileExtension = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = pathname.substring(pathname.lastIndexOf('.'));
    return ext || '';
  } catch {
    // If URL parsing fails, try to extract extension from string
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? `.${match[1]}` : '';
  }
};

/**
 * Get filename from URL
 */
export const getFilenameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    return filename || 'download';
  } catch {
    // If URL parsing fails, try to extract filename from string
    const match = url.match(/\/([^\/\?]+)(?:\?|$)/);
    return match ? match[1] : 'download';
  }
};

