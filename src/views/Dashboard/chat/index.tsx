import React from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { SendInput, MessageList } from './components'

export function Chat() {
  return (
    <>
      <div className="flex relative pb-4 z-10 pt-4 flex-col h-full gap-2">
        <MessageList />
        <SendInput />
      </div>
      <BackgroundBeams />
    </>
  )
}

