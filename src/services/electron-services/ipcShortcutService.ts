/**
 * IPC handlers for keyboard shortcuts management
 */

import { getShortcuts, updateShortcut, resetShortcut } from './shortcutService'

/**
 * Register IPC handlers for shortcut operations
 */
export const registerShortcutHandlers = (ipcMain: any) => {
  // Get all shortcuts
  ipcMain.handle('get-shortcuts', async () => {
    try {
      return getShortcuts()
    } catch (error: any) {
      console.error('Error getting shortcuts:', error)
      return []
    }
  })

  // Update a shortcut
  ipcMain.handle('update-shortcut', async (_event: any, id: string, newShortcut: string) => {
    try {
      const success = updateShortcut(id, newShortcut)
      return { success }
    } catch (error: any) {
      console.error('Error updating shortcut:', error)
      return { success: false, error: error.message }
    }
  })

  // Reset a shortcut to default
  ipcMain.handle('reset-shortcut', async (_event: any, id: string) => {
    try {
      const success = resetShortcut(id)
      return { success }
    } catch (error: any) {
      console.error('Error resetting shortcut:', error)
      return { success: false, error: error.message }
    }
  })
}

