import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Agent } from '@/services/dashboard/hub/agentService'

interface AgentCardProps {
  agent: Agent
  onSelectAgent: (agent: Agent) => void
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onSelectAgent
}) => {
  const [imageError, setImageError] = useState(false)
  
  const handleView = () => {
    onSelectAgent(agent)
  }

  // Get description from builds or use author as fallback
  const description = agent.builds?.[0]?.description || agent.author || 'Agent by ' + agent.author

  return (
    <div onClick={handleView} className="group cursor-pointer py-4 flex flex-col gap-2 hover:px-6 rounded-xl hover:bg-foreground/5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-foreground/5 p-2 border border-foreground/10 flex items-center justify-center overflow-hidden">
          {agent.logo_url && !imageError ? (
            <img 
              src={agent.logo_url} 
              alt={agent.name} 
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-foreground/30 text-xl font-bold">
              {agent.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-1 w-full min-w-0">
          <h3 className="text-lg line-clamp-1">{agent.name}</h3>
          <p className="text-xs text-foreground/60 line-clamp-2">{description}</p>
        </div>
      </div>
      <Button variant="link" className="w-fit group-hover:underline tracking-wider text-primary p-0">View</Button>
    </div>
  )
}

