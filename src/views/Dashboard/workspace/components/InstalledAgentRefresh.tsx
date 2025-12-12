import React, { useState } from 'react'
import { RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Agent } from '@/services/dashboard/hub/agentService'
import { downloadAgentData } from '@/services/dashboard/hub/agentDownloadService'

interface InstalledAgentRefreshProps {
  agent: Agent
}

export const InstalledAgentRefresh: React.FC<InstalledAgentRefreshProps> = ({
  agent,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (!agent.data_json_endpoint || !agent.id) return

    setIsRefreshing(true)
    try {
      await downloadAgentData(agent.id, agent.data_json_endpoint)
      // Show success feedback (you could add a toast notification here)
      alert('Data.json refreshed successfully!')
    } catch (error) {
      console.error('Error refreshing data.json:', error)
      alert(`Failed to refresh data.json: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Only show for online agents with data_json_endpoint
  if (!agent.data_json_endpoint) {
    return null
  }

  return (
    <div className="flex justify-between items-center gap-2">
      <div>
        <p>Reset Configuration</p>
        <p className="text-sm text-foreground/60">Reset the configuration of the agent</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            Reset
          </>
        )}
      </Button>
    </div>
  )
}

