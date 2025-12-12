import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectErrorProps {
  error: string
  onRetry?: () => void
}

export const ProjectError: React.FC<ProjectErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl text-foreground">Service Unavailable</h2>
          <p className="text-sm text-foreground/60">
            {error || 'Unable to connect to project service'}
          </p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            className="gap-2"
          >
            <RefreshCw size={16} />
            Retry Connection
          </Button>
        )}

        <div className="pt-4 border-t border-foreground/10">
          <p className="text-sm text-foreground/40">
            Make sure the project service is running on localhost:45793
          </p>
        </div>
      </div>
    </div>
  )
}

