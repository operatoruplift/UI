import React from 'react'
import { InstalledAgentWithDetails } from '@/services/dashboard/workspace/installedAgentsService'
import { AgentCommandPanel } from './InstallAgentCommandPanel'

interface InstalledAgentDetailProps {
  installedAgent: InstalledAgentWithDetails
  onBack: () => void
  onUninstall?: () => void
}

export const InstalledAgentDetail: React.FC<InstalledAgentDetailProps> = ({
  installedAgent,
  onBack,
  onUninstall,
}) => {
  const agent = installedAgent.agent
  return (
    <AgentCommandPanel
      agent={agent}
      onBack={onBack}
      onUninstall={onUninstall || (() => { })}
    />
  )
}

