import React, { useEffect } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { staticConfig } from '@/config/static'

export const WindowNavbar: React.FC = () => {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow()
    }
  }

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow()
    }
  }

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow()
    }
  }

  // Handle F5 key press for hard refresh (works on all platforms)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Support F5 on Windows/Linux, and also Cmd+R / Ctrl+R on macOS
      const isF5 = event.key === 'F5'
      const isMacRefresh = (event.metaKey || event.ctrlKey) && event.key === 'r'
      
      if (isF5 || isMacRefresh) {
        event.preventDefault()
        // Hard refresh - bypass cache
        if (window.electronAPI) {
          // In Electron, reload the page
          window.location.reload()
        } else {
          // In web browser, use location.reload() or force reload
          window.location.reload()
        }
      }
    }

    // Add listener to window for global keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Only show navbar in Electron environment
  if (!window.electronAPI) {
    return null
  }

  return (
    <div className="flex z-10 relative items-center justify-between h-8 bg-background border-b border-border/50 px-2 gap-1 drag-region">
      <img src={staticConfig.logo} alt={staticConfig.appName} className="w-4 h-4 grayscale" />
      <div className="flex items-center gap-1">

        {/* theme toggle button */}
        <button
          onClick={handleMinimize}
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-foreground/10 transition-colors no-drag"
          aria-label="Minimize"
        >
          <Minus size={14} className="text-foreground/70" />
        </button>
        <button
          onClick={handleMaximize}
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-foreground/10 transition-colors no-drag"
          aria-label="Maximize"
        >
        <Square size={12} className="text-foreground/70" />
        </button>
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-destructive/20 hover:text-destructive transition-colors no-drag"
          aria-label="Close"
        >
          <X size={14} className="text-foreground/70" />
        </button>
      </div>
    </div>
  )
}

