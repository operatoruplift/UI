import React from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'
import { AgentBuilds } from './AgentBuilds'
import { AgentLegal } from './AgentLegal'
import { AgentActions } from './AgentActions'

interface AgentContentProps {
  agent: Agent
  currentPlatform: string | null
  isInstalled: boolean
  isToggling: boolean
  downloadProgress: { downloaded: number; total: number; percentage: number } | null
  onToggle: () => void
}

export const AgentContent: React.FC<AgentContentProps> = ({
  agent,
  currentPlatform,
  isInstalled,
  isToggling,
  downloadProgress,
  onToggle,
}) => {
  return (
    <div className="flex flex-col gap-6 col-span-2">
      <div className="space-y-3">
        <h1 className="text-4xl text-foreground">{agent.name}</h1>
        {agent.data_json_endpoint && (
          <p className="text-sm text-foreground/60">
            Data endpoint: {agent.data_json_endpoint}
          </p>
        )}
      </div>

      <AgentBuilds agent={agent} currentPlatform={currentPlatform} />
      <AgentLegal agent={agent} />
      <AgentActions
        agent={agent}
        isInstalled={isInstalled}
        isToggling={isToggling}
        downloadProgress={downloadProgress}
        onToggle={onToggle}
      />
    </div>
  )
}

