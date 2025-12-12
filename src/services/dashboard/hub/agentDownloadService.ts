/**
 * Service for downloading agent files (builds and data.json)
 */

import { getAgentDownloadPath, getFileExtension, getFilenameFromUrl } from './agentPathService';

/**
 * Download a build file for an offline agent with progress tracking
 */
export const downloadBuildFile = async (
  agentId: string,
  buildFileUrl: string,
  platform: string,
  onProgress?: (downloaded: number, total: number, percentage: number) => void
): Promise<string> => {
  if (typeof window === 'undefined' || !(window as any).electronAPI) {
    throw new Error('Electron API not available');
  }

  const agentPath = await getAgentDownloadPath(agentId);
  const filename = getFilenameFromUrl(buildFileUrl);
  const ext = getFileExtension(buildFileUrl);

  // Ensure filename has extension
  const finalFilename = filename.includes('.') ? filename : `${filename}${ext}`;
  // Use forward slashes - main process will handle path conversion
  const filePath = `${agentPath}/${finalFilename}`;

  // Set up progress listener if callback provided
  let cleanup: (() => void) | undefined;
  if (onProgress) {
    cleanup = (window as any).electronAPI.onDownloadProgress((progress: any) => {
      // Match by normalized path or original path or agent ID
      const pathMatches = progress.filePath === filePath ||
        progress.originalFilePath === filePath ||
        progress.filePath.includes(agentId) ||
        progress.filePath.endsWith(filePath.split('/').pop() || '');

      if (pathMatches) {
        onProgress(progress.downloaded, progress.total, progress.percentage);
      }
    });

  }

  try {
    const result = await (window as any).electronAPI.downloadFile(buildFileUrl, filePath);
    return result.path || filePath;
  } catch (error) {
    throw error;
  } finally {
    if (cleanup) {
      cleanup();
    }
  }
};

/**
 * Download data.json for an online agent
 */
export const downloadAgentData = async (
  agentId: string,
  dataJsonEndpoint: string
): Promise<string> => {
  if (typeof window === 'undefined' || !(window as any).electronAPI) {
    throw new Error('Electron API not available');
  }

  const agentPath = await getAgentDownloadPath(agentId);
  // Use forward slashes - main process will handle path conversion
  const filePath = `${agentPath}/data.json`;

  await (window as any).electronAPI.downloadJson(dataJsonEndpoint, filePath);
  return filePath;
};
