import React from 'react'
import { MessageContent } from './MessageContent'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  text: string
  toolId?: string | null
  responseStyle?: string
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  role, 
  text, 
  toolId, 
  responseStyle 
}) => {
  const isUser = role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-lg ${
          isUser ? 'max-w-xl bg-foreground/10' : 'max-w-xl w-full'
        }`}
      >
        <MessageContent 
          text={text} 
          toolId={toolId} 
          responseStyle={responseStyle}
        />
      </div>
    </div>
  )
}

