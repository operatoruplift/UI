import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Agent } from '@/services/dashboard/hub/agentService'

interface AgentHeaderProps {
  agent: Agent
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({ agent }) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-foreground/70" />
        </button>
      </div>  

    </div>
  )
}

