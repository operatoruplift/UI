import React, { useMemo } from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'
import { AgentBuildCard } from './AgentBuildCard'

interface AgentBuildsProps {
  agent: Agent
  currentPlatform: string | null
}

export const AgentBuilds: React.FC<AgentBuildsProps> = ({ agent, currentPlatform }) => {
  // Filter builds to only show current platform
  const filteredBuilds = useMemo(() => {
    if (!agent.builds || !currentPlatform) {
      return agent.builds || []
    }
    return agent.builds.filter(build => build.platform === currentPlatform)
  }, [agent.builds, currentPlatform])

  if (!agent.builds || agent.builds.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 pt-4 border-t border-foreground/10">
      <p className="text-xs text-foreground/60 uppercase tracking-wide font-medium">
        Available Builds {currentPlatform && `(${currentPlatform})`}
      </p>
      {filteredBuilds.length > 0 ? (
        <div className="space-y-2">
          {filteredBuilds.map((build) => (
            <AgentBuildCard key={build.id} build={build} />
          ))}
        </div>
      ) : currentPlatform ? (
        <div className="p-3 rounded-lg bg-foreground/5 border border-foreground/10">
          <p className="text-sm text-foreground/60">
            No builds available for {currentPlatform} platform.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {agent.builds.map((build) => (
            <AgentBuildCard key={build.id} build={build} />
          ))}
        </div>
      )}
    </div>
  )
}

