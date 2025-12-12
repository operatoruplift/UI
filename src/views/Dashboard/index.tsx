import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AgentDetail } from "@/views/Dashboard/agents"

import { Dock } from "@/views/Dashboard/dock"
import { Hub } from "@/views/Dashboard/hub"
import { links } from "@/config/static"
import { Agent } from '@/services/dashboard/hub/agentService'
import { ScrollArea } from '@/components/ui/scroll-area'


function Dashboard({ id = links[0].href }: { id?: string }) {
  const { id: agentId } = useParams()
  const navigate = useNavigate()

  // Handle agent selection from Hub
  const handleSelectAgent = (agent: Agent) => {
    navigate(`/store/${agent.id}`)
  }

  // Check if we're on an agent detail page (store route)
  if (agentId && id === '/store') {
    return (
      <div className="h-screen flex flex-col">
        <ScrollArea className="h-[89vh]">
          <AgentDetail />
        </ScrollArea>
        <div className='h-[11vh] relative z-10 border-t'>
          <Dock />
        </div>
      </div>
    )
  }

  // Show Hub for /store route (marketplace)
  if (id === '/store') {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-[89vh]">
          <Hub onSelectAgent={handleSelectAgent} />
        </div>
        <div className='h-[11vh] relative z-10 border-t'>
          <Dock />
        </div>
      </div>
    )
  }

  // Handle voice chat route
  // if (id === '/voicechat') {
  //   return (
  //     <div className="h-screen flex flex-col">
  //       <div className="h-[89vh]">
  //         <VoiceChat />
  //       </div>
  //       <div className='h-[11vh] relative z-10 border-t'>
  //         <Dock />
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="h-[calc(100vh-32px)] flex flex-col">
      <div className="h-full border-b">
        {links.find((view) => view.href === id)?.component}
      </div>
      <Dock />
    </div>
  )
}

export { Dashboard }