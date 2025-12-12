import React from 'react'
import { AgentBuild } from '@/services/dashboard/hub/agentService'

interface AgentBuildCardProps {
  build: AgentBuild
}

export const AgentBuildCard: React.FC<AgentBuildCardProps> = ({ build }) => {
  return (
    <div className="">
      {build.description && (
        <p className="text-xs text-foreground/70 mb-2">{build.description}</p>
      )}
      {build.how_it_works && (
        <div className="mt-2">
          <p className="text-xs text-foreground/60 font-medium mb-1">How it works:</p>
          <p className="text-xs text-foreground/70">{build.how_it_works}</p>
        </div>
      )}
      {build.access_required && (
        <div className="mt-2">
          <p className="text-xs text-foreground/60 font-medium mb-1">Access Required:</p>
          <p className="text-xs text-foreground/70">{build.access_required}</p>
        </div>
      )}
    </div>
  )
}

