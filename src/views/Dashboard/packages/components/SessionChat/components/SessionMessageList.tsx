import React, { useRef, useEffect, useState, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from '@/views/Dashboard/chat/components/MessageBubble'
import { StreamingMessage } from '@/views/Dashboard/chat/components/StreamingMessage'
import { ThinkingIndicator } from '@/views/Dashboard/chat/components/ThinkingIndicator'
import { SessionEmptyState } from './SessionEmptyState'
import { useMessageParser } from '@/views/Dashboard/chat/hooks/useMessageParser'

export interface Message {
  role: 'user' | 'assistant'
  text: string
  timestamp?: string | Date
}

interface SessionMessageListProps {
  projectId: string
  sessionId: string
  messages: Message[]
  streamingMessage: string | null
  isLoading: boolean
  onMessagesChange: (messages: Message[]) => void
  onStreamingMessageChange: (message: string | null) => void
}

export const SessionMessageList: React.FC<SessionMessageListProps> = ({ 
  projectId, 
  sessionId,
  messages,
  streamingMessage,
  isLoading,
  onMessagesChange,
  onStreamingMessageChange
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [prevMessageCount, setPrevMessageCount] = useState(0)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const parsedMessages = useMessageParser(messages)

  // Get the viewport element from ScrollArea
  const getViewport = useCallback(() => {
    if (!scrollAreaRef.current) return null
    return scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null
  }, [])

  // Check if user is near the bottom of the scroll area
  const checkIfNearBottom = useCallback(() => {
    const viewport = getViewport()
    if (!viewport) return false
    
    const threshold = 100
    const scrollTop = viewport.scrollTop
    const scrollHeight = viewport.scrollHeight
    const clientHeight = viewport.clientHeight
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    
    return distanceFromBottom <= threshold
  }, [getViewport])

  // Handle scroll events to track if user is near bottom
  const handleScroll = useCallback(() => {
    setIsNearBottom(checkIfNearBottom())
  }, [checkIfNearBottom])

  // Set up scroll listener and initial check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const viewport = getViewport()
      if (!viewport) return

      setIsNearBottom(checkIfNearBottom())
      viewport.addEventListener('scroll', handleScroll, { passive: true })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      const viewport = getViewport()
      if (viewport) {
        viewport.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll, getViewport, checkIfNearBottom])

  // Detect new user messages
  useEffect(() => {
    const currentMessageCount = messages.length
    const hasNewMessage = currentMessageCount > prevMessageCount
    
    if (hasNewMessage) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.role === 'user') {
        setShouldAutoScroll(true)
      }
      setPrevMessageCount(currentMessageCount)
    }
  }, [messages, prevMessageCount])

  // Auto-scroll logic
  useEffect(() => {
    const shouldScroll = shouldAutoScroll || isNearBottom

    if (!shouldScroll) return

    if (isLoading && streamingMessage !== null) {
      const intervalId = setInterval(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'end'
          })
        }
      }, 100)

      return () => clearInterval(intervalId)
    } else {
      const timeoutId = setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'end'
          })
        }
        setTimeout(() => {
          setIsNearBottom(checkIfNearBottom())
          setShouldAutoScroll(false)
        }, 200)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [messages, streamingMessage, isLoading, shouldAutoScroll, isNearBottom, checkIfNearBottom])


  const hasContent = messages.length > 0 || streamingMessage !== null

  if (!hasContent) {
    return <SessionEmptyState />
  }

  return (
    <div ref={scrollAreaRef} className='h-full'>
      <ScrollArea className='h-full'>
        <div className="flex-1 h-full flex flex-col gap-6">
          {/* Render all completed messages */}
          {messages.map((msg, i) => {
            const parsed = parsedMessages[i] || { text: msg.text, toolId: null }
            return (
              <MessageBubble
                key={i}
                role={msg.role as 'user' | 'assistant'}
                text={parsed.text}
                toolId={parsed.toolId}
                responseStyle={parsed.responseStyle}
              />
            )
          })}

          {/* Render streaming message separately */}
          {streamingMessage !== null && (
            <StreamingMessage 
              content={streamingMessage} 
              isLoading={isLoading}
            />
          )}

          {/* Show "Thinking..." only if streaming hasn't started yet */}
          {isLoading && streamingMessage === null && <ThinkingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  )
}

