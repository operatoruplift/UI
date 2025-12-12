import React, { useRef, useEffect, useState, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'
import { StreamingMessage } from './StreamingMessage'
import { ThinkingIndicator } from './ThinkingIndicator'
import { EmptyState } from './EmptyState'
import { useMessageParser } from '../hooks/useMessageParser'
import { useChatStore } from '@/store/chatStore'

export const MessageList: React.FC = () => {
  const messages = useChatStore((state) => state.messages)
  const streamingMessage = useChatStore((state) => state.streamingMessage)
  const isLoading = useChatStore((state) => state.isLoading)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [prevMessageCount, setPrevMessageCount] = useState(0)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const parsedMessages = useMessageParser(messages)

  // Get the viewport element from ScrollArea
  const getViewport = useCallback(() => {
    if (!scrollAreaRef.current) return null
    // Find the viewport element by data attribute
    return scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null
  }, [])

  // Check if user is near the bottom of the scroll area
  const checkIfNearBottom = useCallback(() => {
    const viewport = getViewport()
    if (!viewport) return false
    
    const threshold = 100 // pixels from bottom
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
    // Wait a bit for the DOM to be ready
    const timeoutId = setTimeout(() => {
      const viewport = getViewport()
      if (!viewport) return

      // Initial check
      setIsNearBottom(checkIfNearBottom())

      viewport.addEventListener('scroll', handleScroll, { passive: true })
    }, 100)

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      const viewport = getViewport()
      if (viewport) {
        viewport.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll, getViewport, checkIfNearBottom])

  // Detect new user messages (when message count increases and last message is from user)
  useEffect(() => {
    const currentMessageCount = messages.length
    const hasNewMessage = currentMessageCount > prevMessageCount
    
    if (hasNewMessage) {
      const lastMessage = messages[messages.length - 1]
      // If the new message is from user, always auto-scroll
      if (lastMessage && lastMessage.role === 'user') {
        setShouldAutoScroll(true)
      }
      setPrevMessageCount(currentMessageCount)
    }
  }, [messages, prevMessageCount])

  // Auto-scroll logic - only scroll if shouldAutoScroll is true or user is near bottom
  useEffect(() => {
    const shouldScroll = shouldAutoScroll || isNearBottom

    if (!shouldScroll) return

    if (isLoading && streamingMessage !== null) {
      // During streaming, scroll more frequently
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
      // After streaming completes or when messages change, scroll once
      const timeoutId = setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'end'
          })
        }
        // After scrolling, check if we're still near bottom
        setTimeout(() => {
          setIsNearBottom(checkIfNearBottom())
          setShouldAutoScroll(false) // Reset after scrolling
        }, 200)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [messages, streamingMessage, isLoading, shouldAutoScroll, isNearBottom, checkIfNearBottom])

  const hasContent = messages.length > 0 || streamingMessage !== null

  if (!hasContent) {
    return <EmptyState />
  }

  return (
    <div ref={scrollAreaRef} className='h-[calc(100vh-200px)]'>
      <ScrollArea className='h-full'>
        <div className="flex-1 p-8 h-full mx-auto md:max-w-3xl 2xl:max-w-5xl rounded-lg flex flex-col gap-6">
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

