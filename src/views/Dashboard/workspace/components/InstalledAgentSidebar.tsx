import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { InstalledAgentWithDetails } from '@/services/dashboard/workspace/installedAgentsService'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InstalledAgentSidebarProps {
  installedAgents: InstalledAgentWithDetails[]
  selectedAgentId: string | null
  onSelectAgent: (agentId: string) => void
  isLoading: boolean
  onNavigateToStore: () => void
}

export const InstalledAgentSidebar: React.FC<InstalledAgentSidebarProps> = ({
  installedAgents,
  selectedAgentId,
  onSelectAgent,
  isLoading,
  onNavigateToStore,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-foreground/60" size={20} />
      </div>
    )
  }

  if (installedAgents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-sm text-foreground/60 mb-2">No agents installed</p>
        <p className="text-xs text-foreground/40">Install agents from Uplift Store</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        <Button
          variant="link"
          size="sm"
          className="w-full"
          onClick={onNavigateToStore}
        >
          Explore Uplift Store
        </Button>
        {installedAgents.map((installedAgent) => {
          const agent = installedAgent.agent
          const isSelected = selectedAgentId === agent.id

          return (
            <div
              key={installedAgent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`
                cursor-pointer p-3 transition-all
                ${isSelected
                  ? 'bg-foreground/5'
                  : ' hover:bg-foreground/5'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {agent.logo_url ? (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={agent.logo_url}
                      alt={agent.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-foreground/30 text-lg font-bold">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-foreground/60 truncate">
                    {agent.author}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

      </div>
    </ScrollArea>
  )
}

