import React from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'

interface AgentInstalledMessageProps {
  agent: Agent
  isInstalled: boolean
}

export const AgentInstalledMessage: React.FC<AgentInstalledMessageProps> = ({
  agent,
  isInstalled,
}) => {
  if (!isInstalled) return null

  return (
    <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
      <p className="text-sm text-foreground/70">
        ✓ {agent.name} is now installed and ready to use in your workspace.
      </p>
    </div>
  )
}

