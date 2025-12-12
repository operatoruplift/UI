const { globalShortcut, app } = require("electron");

interface ShortcutConfig {
  id: string
  label: string
  description: string
  defaultShortcut: string
  currentShortcut: string
  callback?: () => void
}

const shortcuts = new Map<string, ShortcutConfig>()
let shortcutsRegistered = false

// Default shortcuts
const defaultShortcuts: Omit<ShortcutConfig, 'callback'>[] = [
  {
    id: 'open-uplift',
    label: 'Open Uplift',
    description: 'Toggle the Uplift window',
    defaultShortcut: 'CommandOrControl+Alt+K',
    currentShortcut: 'CommandOrControl+Alt+K'
  },
  // {
  //   id: 'voice-activation',
  //   label: 'Voice Activation',
  //   description: 'Activate voice chat',
  //   defaultShortcut: 'CommandOrControl+Space',
  //   currentShortcut: 'CommandOrControl+Space'
  // }
]

// Alternative shortcuts to try if default fails
const alternativeShortcuts: Record<string, string[]> = {
  'open-uplift': [
    'CommandOrControl+Alt+U',
    'CommandOrControl+Shift+U',
    'CommandOrControl+Alt+T',
    'F12'
  ]
}

const tryRegisterShortcut = (shortcut: string, callback: () => void, label: string): boolean => {
  // Check if shortcut is already registered (by this app or another)
  const isRegistered = globalShortcut.isRegistered(shortcut)
  if (isRegistered) {
    console.warn(`⚠️  Global shortcut ${shortcut} is already registered. Attempting to unregister first...`)
    globalShortcut.unregister(shortcut)
    // Small delay to allow unregistration to complete
    // Note: This is synchronous but helps with timing
  }

  const success = globalShortcut.register(shortcut, callback)
  
  if (success) {
    console.log(`✅ Global shortcut ${shortcut} registered successfully for ${label}`)
  }
  
  return success
}

export const registerShortcuts = (toggleWindow: () => void, voiceActivationCallback?: () => void) => {
  if (shortcutsRegistered) {
    return;
  }

  // Initialize shortcuts with callbacks
  defaultShortcuts.forEach(config => {
    shortcuts.set(config.id, {
      ...config,
      callback: config.id === 'open-uplift' ? toggleWindow : voiceActivationCallback
    })
  })

  // Register all shortcuts with fallback options
  shortcuts.forEach((config) => {
    if (config.callback) {
      let success = tryRegisterShortcut(
        config.currentShortcut,
        () => config.callback?.(),
        config.label
      )

      // If default shortcut fails, try alternatives
      if (!success && alternativeShortcuts[config.id]) {
        console.warn(`⚠️  Default shortcut ${config.currentShortcut} failed. Trying alternatives...`)
        
        for (const altShortcut of alternativeShortcuts[config.id]) {
          success = tryRegisterShortcut(
            altShortcut,
            () => config.callback?.(),
            config.label
          )
          
          if (success) {
            // Update to the working alternative
            config.currentShortcut = altShortcut
            console.log(`   Using alternative shortcut: ${altShortcut}`)
            break
          }
        }
      }

      if (!success) {
        console.error(`❌ Failed to register global shortcut for ${config.label}`)
        console.error(`   Tried: ${config.currentShortcut}`)
        if (alternativeShortcuts[config.id]) {
          console.error(`   Also tried: ${alternativeShortcuts[config.id].join(', ')}`)
        }
        console.error(`   Possible reasons:`)
        console.error(`   - All shortcuts are already in use by another application`)
        console.error(`   - The shortcuts are reserved by the operating system`)
        console.error(`   Solution: Try changing the shortcut in settings or closing other applications.`)
      }
    }
  })

  shortcutsRegistered = true

  // Clean up global shortcuts on quit
  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
};

export const unregisterShortcuts = () => {
  globalShortcut.unregisterAll();
  shortcutsRegistered = false;
}

export const getShortcuts = (): ShortcutConfig[] => {
  return Array.from(shortcuts.values()).map(({ callback, ...config }) => config)
}

export const updateShortcut = (id: string, newShortcut: string): boolean => {
  const shortcut = shortcuts.get(id)
  if (!shortcut) {
    console.error(`Shortcut ${id} not found`)
    return false
  }

  // Store old shortcut for potential rollback
  const oldShortcut = shortcut.currentShortcut

  // Unregister old shortcut
  globalShortcut.unregister(oldShortcut)

  // Register new shortcut if callback exists
  if (shortcut.callback) {
    // Check if new shortcut is already registered
    const isRegistered = globalShortcut.isRegistered(newShortcut)
    if (isRegistered) {
      console.warn(`⚠️  Shortcut ${newShortcut} is already registered. Attempting to unregister first...`)
      globalShortcut.unregister(newShortcut)
    }

    const success = globalShortcut.register(newShortcut, () => {
      shortcut.callback?.()
    })

    if (success) {
      // Only update currentShortcut if registration succeeded
      shortcut.currentShortcut = newShortcut
      console.log(`✅ Updated shortcut ${id} to ${newShortcut}`)
      return true
    } else {
      console.error(`❌ Failed to register updated shortcut ${newShortcut} for ${id}`)
      // Revert to old shortcut on failure
      const revertSuccess = globalShortcut.register(oldShortcut, () => {
        shortcut.callback?.()
      })
      if (revertSuccess) {
        console.log(`   Reverted to previous shortcut: ${oldShortcut}`)
      } else {
        console.error(`   Warning: Failed to revert to previous shortcut ${oldShortcut}`)
      }
      return false
    }
  } else {
    // No callback, just update the shortcut config
    shortcut.currentShortcut = newShortcut
    return true
  }
}

export const resetShortcut = (id: string): boolean => {
  const shortcut = shortcuts.get(id)
  if (!shortcut) {
    console.error(`Shortcut ${id} not found`)
    return false
  }

  return updateShortcut(id, shortcut.defaultShortcut)
}

