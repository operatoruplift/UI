import React, { useState, useEffect } from 'react'
import { Keyboard, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Shortcut {
  id: string
  label: string
  description: string
  defaultShortcut: string
  currentShortcut: string
}

export const ShortcutsSection: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    {
      id: 'open-uplift',
      label: 'Open Uplift',
      description: 'Toggle the Uplift window',
      defaultShortcut: 'CommandOrControl+Alt+K',
      currentShortcut: 'CommandOrControl+Alt+K'
    },
    {
      id: 'voice-activation',
      label: 'Voice Activation',
      description: 'Activate voice chat',
      defaultShortcut: 'CommandOrControl+Space',
      currentShortcut: 'CommandOrControl+Space'
    }
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [platform, setPlatform] = useState<string>('win32')

  useEffect(() => {
    // Get platform info
    if (window.electronAPI?.getDeviceInfo) {
      window.electronAPI.getDeviceInfo().then((deviceInfo: any) => {
        if (deviceInfo?.platform) {
          setPlatform(deviceInfo.platform)
        }
      }).catch((err: any) => {
        console.error('Failed to get device info:', err)
      })
    }

    // Load shortcuts from IPC
    if (window.electronAPI?.getShortcuts) {
      window.electronAPI.getShortcuts().then((loadedShortcuts: Shortcut[]) => {
        if (loadedShortcuts) {
          setShortcuts(loadedShortcuts)
        }
      }).catch((err: any) => {
        console.error('Failed to load shortcuts:', err)
      })
    }
  }, [])

  const handleEdit = (shortcut: Shortcut) => {
    setEditingId(shortcut.id)
    setEditValue(shortcut.currentShortcut)
  }

  const handleSave = async (id: string) => {
    const updatedShortcuts = shortcuts.map(s => 
      s.id === id ? { ...s, currentShortcut: editValue } : s
    )
    setShortcuts(updatedShortcuts)
    setEditingId(null)
    setEditValue('')

    // Save to IPC
    if (window.electronAPI?.updateShortcut) {
      try {
        await window.electronAPI.updateShortcut(id, editValue)
      } catch (err) {
        console.error('Failed to update shortcut:', err)
        // Revert on error
        setShortcuts(shortcuts)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleReset = async (id: string) => {
    const shortcut = shortcuts.find(s => s.id === id)
    if (!shortcut) return

    const updatedShortcuts = shortcuts.map(s => 
      s.id === id ? { ...s, currentShortcut: s.defaultShortcut } : s
    )
    setShortcuts(updatedShortcuts)

    // Save to IPC
    if (window.electronAPI?.updateShortcut) {
      try {
        await window.electronAPI.updateShortcut(id, shortcut.defaultShortcut)
      } catch (err) {
        console.error('Failed to reset shortcut:', err)
        setShortcuts(shortcuts)
      }
    }
  }

  const formatShortcut = (shortcut: string) => {
    return shortcut
      .replace('CommandOrControl', platform === 'darwin' ? '⌘' : 'Ctrl')
      .replace('Alt', 'Alt')
      .replace('Shift', 'Shift')
      .replace('Space', 'Space')
      .replace('+', ' + ')
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto flex flex-col h-full">
      {shortcuts.map(shortcut => (
        <div key={shortcut.id} className="flex items-center justify-between p-5 rounded-lg bg-foreground/5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <Keyboard className="w-5 h-5 text-foreground/60" />
              <p className="font-semibold text-foreground">{shortcut.label}</p>
            </div>
            <p className="text-sm text-foreground/60 ml-8">{shortcut.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {editingId === shortcut.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Press keys..."
                  className="w-32"
                  onKeyDown={(e) => {
                    e.preventDefault()
                    const keys: string[] = []
                    if (e.ctrlKey || e.metaKey) keys.push('CommandOrControl')
                    if (e.altKey) keys.push('Alt')
                    if (e.shiftKey) keys.push('Shift')
                    if (e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Alt' && e.key !== 'Shift') {
                      keys.push(e.key === ' ' ? 'Space' : e.key)
                    }
                    if (keys.length > 0) {
                      setEditValue(keys.join('+'))
                    }
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSave(shortcut.id)}
                  className="h-8 w-8 p-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="px-3 py-1.5 rounded bg-foreground/10 text-sm font-mono text-foreground/80">
                  {formatShortcut(shortcut.currentShortcut)}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(shortcut)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                {shortcut.currentShortcut !== shortcut.defaultShortcut && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReset(shortcut.id)}
                    className="h-8 text-xs"
                  >
                    Reset
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

