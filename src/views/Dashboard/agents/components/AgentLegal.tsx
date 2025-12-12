import React from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'

interface AgentLegalProps {
  agent: Agent
}

export const AgentLegal: React.FC<AgentLegalProps> = ({ agent }) => {
  if (!agent.terms_and_condition && !agent.privacy_policy) {
    return null
  }

  return (
    <div className="space-y-3 pt-4 border-t border-foreground/10">
      <p className="text-xs text-foreground/60 uppercase tracking-wide font-medium">Legal</p>
      <div className="flex gap-3">
        {agent.terms_and_condition && (
          <a 
            href={agent.terms_and_condition} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Terms & Conditions
          </a>
        )}
        {agent.privacy_policy && (
          <a 
            href={agent.privacy_policy} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Privacy Policy
          </a>
        )}
      </div>
    </div>
  )
}

