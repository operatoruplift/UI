import { useMemo } from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'
import { useAgentPlatform } from '@/views/Dashboard/agents/hooks/useAgentPlatform'

export const useFilteredBuilds = (agent: Agent) => {
  const currentPlatform = useAgentPlatform()

  const filteredBuilds = useMemo(() => {
    if (!agent.builds || !currentPlatform) {
      return agent.builds || []
    }
    return agent.builds.filter(build => build.platform === currentPlatform)
  }, [agent.builds, currentPlatform])

  return filteredBuilds
}

