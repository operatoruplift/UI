import React from 'react'
import { Loader2 } from 'lucide-react'

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs px-4 py-2 rounded-lg flex items-center gap-2">
        <Loader2 size={16} className="animate-spin text-foreground/50" />
        <span className="text-foreground/50">Thinking...</span>
      </div>
    </div>
  )
}

