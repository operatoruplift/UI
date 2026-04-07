import React, { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ButtonSpinner } from '@/components/ui/spinner'
import { useChatStore } from '@/store/chatStore'
import { sendDemoMessage, DemoServiceError } from '@/services/dashboard/chat/demoService'
import { useDemoStore } from '@/store/demoStore'
import { ModelSelector } from './ModelSelector'

export const SendInput: React.FC = () => {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const {
    sendMessage,
    isLoading,
    addUserMessage,
    addBotMessage,
  } = useChatStore()
  const selectedModel = useDemoStore((s) => s.selectedModel)

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage || isLoading || isDemoLoading) return

    setInput('')
    await sendMessage(userMessage)
  }

  const handleDemo = async () => {
    const userMessage = input.trim()
    if (!userMessage || isLoading || isDemoLoading) return

    setInput('')
    setIsDemoLoading(true)
    addUserMessage(userMessage)

    try {
      const reply = await sendDemoMessage(userMessage, selectedModel)
      addBotMessage(reply || '(empty response)')
    } catch (err) {
      let msg = 'Demo request failed.'
      if (err instanceof DemoServiceError) {
        if (err.code === 'rate_limited' && err.retryAfterSeconds) {
          msg = `Demo rate-limited. Retry in ${err.retryAfterSeconds}s.`
        } else {
          msg = `Demo error: ${err.message}`
        }
      } else if (err instanceof Error) {
        msg = `Demo error: ${err.message}`
      }
      addBotMessage(msg)
    } finally {
      setIsDemoLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasInput = input.trim().length > 0
  const anyLoading = isLoading || isDemoLoading

  return (
    <div className="flex-shrink-0 px-4 py-4 sm:px-6 sm:py-5">
      <div className="w-full max-w-2xl lg:max-w-3xl mx-auto">
        {/* Glowing container */}
        <div className="relative">
          {/* Glow effect */}
          <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-accent/50 blur-md transition-opacity duration-300 ${
            isFocused ? 'opacity-30' : 'opacity-0'
          }`} />

          {/* Input container */}
          <div className={`relative flex items-end gap-2 p-2 sm:p-2.5 rounded-xl bg-foreground/[0.05] border transition-all duration-300 backdrop-blur-sm ${
            isFocused ? 'border-primary/30 bg-foreground/[0.07]' : 'border-foreground/10'
          }`}>
            <ModelSelector />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Message..."
              maxRows={6}
              minRows={1}
              direction="top"
              className="flex-1 min-h-[36px] bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/25 border-0 focus-visible:ring-0 resize-none px-2 py-1.5"
            />
            <button
              type="button"
              onClick={handleDemo}
              disabled={anyLoading || !hasInput}
              title="Demo mode — hits localhost:5000/api/demo (Colosseum Demo Day)"
              className={`flex-shrink-0 h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all duration-200 ${
                hasInput && !anyLoading
                  ? 'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-lg hover:shadow-accent/25 hover:scale-105 active:scale-95'
                  : 'text-foreground/20 cursor-not-allowed'
              }`}
            >
              {isDemoLoading ? (
                <ButtonSpinner />
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Demo</span>
                </>
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={anyLoading || !hasInput}
              className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                hasInput && !anyLoading
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95'
                  : 'text-foreground/20 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <ButtonSpinner />
              ) : (
                <Send size={16} className={hasInput ? 'translate-x-0.5 -translate-y-0.5' : ''} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
