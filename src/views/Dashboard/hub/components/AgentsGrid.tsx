import React from 'react'
import { AgentCard } from './AgentCard'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AgentsGridProps {
  agents: any[]
  onSelectAgent: (agent: any) => void
}

export const AgentsGrid: React.FC<AgentsGridProps> = ({
  agents,
  onSelectAgent,
}) => {
  return (

    <ScrollArea className="overflow-y-auto">
      <div className='grid h-full grid-cols-2 gap-4'>

        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onSelectAgent={onSelectAgent}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

