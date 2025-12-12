import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface Toast {
  id: string
  title: string
  message: string
  duration?: number
  isExiting?: boolean
}

interface ToastContextType {
  showToast: (title: string, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((title: string, message: string, duration: number = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: Toast = { id, title, message, duration }
    
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => 
        prev.map((toast) => 
          toast.id === id ? { ...toast, isExiting: true } : toast
        )
      )
      
      // Remove after animation completes
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 300)
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => 
      prev.map((toast) => 
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    )
    
    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 300)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isEntering, setIsEntering] = useState(true)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger enter animation after mount
    requestAnimationFrame(() => {
      setIsEntering(false)
    })
  }, [])

  const getStyle = (): React.CSSProperties => {
    if (toast.isExiting) {
      return {
        transform: 'translateX(100%)',
        opacity: 0,
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
      }
    }
    if (isEntering) {
      return {
        transform: 'translateX(100%)',
        opacity: 0,
      }
    }
    return {
      transform: 'translateX(0)',
      opacity: 1,
      transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    }
  }

  return (
    <div
      ref={elementRef}
      className="flex items-start gap-3 p-4 rounded-lg border border-foreground/10 bg-[#0b0b0b] shadow-lg min-w-[300px] max-w-[400px]"
      style={getStyle()}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{toast.title}</p>
        <p className="text-sm text-foreground/60 mt-1">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  )
}

