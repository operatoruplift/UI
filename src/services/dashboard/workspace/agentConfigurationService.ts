/**
 * Service for agent configuration file operations
 */

import { checkElectronAPI, parseErrorMessage } from './utils';

/**
 * Write agent configuration to data.json file
 */
export const saveAgentConfiguration = async (
  dataJsonPath: string,
  dataJson: any,
  editableFields: Record<string, any>
): Promise<{ success: boolean; error?: string }> => {
  try {
    checkElectronAPI();

    const updatedDataJson = {
      ...dataJson,
      editable: editableFields,
    };

    const result = await (window as any).electronAPI.writeFile(
      dataJsonPath,
      JSON.stringify(updatedDataJson, null, 2)
    );

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.error || 'Failed to save configuration',
    };
  } catch (error) {
    return {
      success: false,
      error: parseErrorMessage(error),
    };
  }
};

