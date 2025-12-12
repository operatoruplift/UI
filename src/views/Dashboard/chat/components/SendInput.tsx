import React, { useState } from 'react'
import { Send, AudioLines } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/store/chatStore'

export const SendInput: React.FC = () => {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const { sendMessage, isLoading } = useChatStore()

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage || isLoading) return

    setInput('')
    await sendMessage(userMessage)
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
    <div className="absolute bottom-4 w-full">
      <div className="flex w-full mx-auto md:max-w-3xl 2xl:max-w-5xl text-lg rounded-lg gap-2 p-2 pl-4 items-end bg-muted">
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
    </div>
  )
}

