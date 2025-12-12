import React from 'react'
import { Download, LinkIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Agent } from '@/services/dashboard/hub/agentService'

interface AgentActionsProps {
  agent: Agent
  isInstalled: boolean
  isToggling: boolean
  downloadProgress: { downloaded: number; total: number; percentage: number } | null
  onToggle: () => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const AgentActions: React.FC<AgentActionsProps> = ({
  agent,
  isInstalled,
  isToggling,
  downloadProgress,
  onToggle,
}) => {
  return (
    <div className="flex flex-col gap-3 pt-6 border-t border-foreground/10">
      <Button
        size="lg"
        variant="default"
        onClick={onToggle}
        disabled={(!agent.builds || agent.builds.length === 0) || isToggling}
      >
        {isToggling ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            {isInstalled ? 'Uninstalling...' : 'Installing...'}
          </>
        ) : (
          <>
            <Download size={16} className="mr-2" />
            {isInstalled ? 'Uninstall' : 'Install Agent'}
          </>
        )}
      </Button>

      {/* Download Progress */}
      {downloadProgress && downloadProgress.total > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <span>
              {formatFileSize(downloadProgress.downloaded)} / {formatFileSize(downloadProgress.total)}
            </span>
            <span>{downloadProgress.percentage}%</span>
          </div>
          <div className="w-full bg-foreground/10 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-foreground/50">
            {formatFileSize(downloadProgress.total - downloadProgress.downloaded)} remaining
          </p>
        </div>
      )}
    </div>
  )
}

