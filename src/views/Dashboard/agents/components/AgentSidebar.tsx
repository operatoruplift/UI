import React from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'
import { formatDate } from '../utils'

interface AgentSidebarProps {
  agent: Agent
}

export const AgentSidebar: React.FC<AgentSidebarProps> = ({ agent }) => {
  return (
    <div className="flex flex-col gap-6 col-span-1">
      <div className="w-full aspect-square flex items-center justify-center rounded-lg bg-foreground/5 border border-foreground/10">
        {agent.logo_url ? (
          <img src={agent.logo_url} alt={agent.name} className="w-3/4 h-3/4 object-contain" />
        ) : (
          <div className="text-foreground/30 text-4xl font-bold">
            {agent.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs text-foreground/60 uppercase tracking-wide font-medium">Author</p>
          <p className="text-sm text-foreground">{agent.author}</p>
        </div>

        {agent.website_url && (
          <div className="space-y-1.5">
            <p className="text-xs text-foreground/60 uppercase tracking-wide font-medium">Website</p>
            <a 
              href={agent.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs text-foreground/60 uppercase tracking-wide font-medium">Last Updated</p>
          <p className="text-sm text-foreground">{formatDate(agent.updated_at)}</p>
        </div>
      </div>
    </div>
  )
}

