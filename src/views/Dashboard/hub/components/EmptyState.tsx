import React from 'react'

export const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-1">
        <p className="text-sm text-foreground/60">
          No agents found
        </p>
        <p className="text-xs text-foreground/40">
          Try different filters or search terms
        </p>
      </div>
    </div>
  )
}

