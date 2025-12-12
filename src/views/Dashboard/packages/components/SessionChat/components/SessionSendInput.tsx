import React, { useState } from 'react'
import { Send, AudioLines } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface SessionSendInputProps {
  projectId: string
  sessionId: string
  onSendMessage?: (message: string) => Promise<void>
  isLoading?: boolean
}

export const SessionSendInput: React.FC<SessionSendInputProps> = ({
  projectId,
  sessionId,
  onSendMessage,
  isLoading = false
}) => {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage || isLoading) return

    setInput('')
    if (onSendMessage) {
      await onSendMessage(userMessage)
    } else {
      // Default behavior - can be extended later
      console.log('Sending message to session:', { projectId, sessionId, message: userMessage })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoice = () => {
    setIsListening(!isListening)
  }

  return (
    <div className="flex w-full text-lg rounded-lg gap-2 p-1 pl-2 items-end bg-muted">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        maxRows={10}
        minRows={1}
        direction="top"
        className="w-full bg-transparent text-foreground outline-none placeholder:text-foreground/50 border-0 focus-visible:ring-0"
      />
      <Button
        size="icon"
        onClick={input.trim() ? handleSend : handleVoice}
        className="flex-shrink-0"
        disabled={isLoading}
      >
        {input.trim() ? (
          <Send size={20} />
        ) : (
          <AudioLines size={20} />
        )}
      </Button>
    </div>

  )
}

