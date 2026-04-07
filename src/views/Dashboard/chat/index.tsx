import React from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { SendInput, MessageList, ApprovalModal } from './components'

export function Chat() {
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      {/* Background Beams - behind everything */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundBeams className="opacity-40" />
      </div>
    
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0 py-4">
        <MessageList />
        <ApprovalModal />
        <SendInput />
      </div>
    </div>
  )
}

