import React from 'react'
import { MarkdownMessage } from './MarkdownMessage'

interface StreamingMessageProps {
  content: string
  isLoading: boolean
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ 
  content, 
  isLoading 
}) => {
  return (
    <div className="flex justify-start">
      <div className="px-4 flex items-center flex-wrap py-2 rounded-lg max-w-xl relative">
        <div className="flex-1">
          <MarkdownMessage content={content} />
        </div>
        {isLoading && (
          <span className="inline-block w-1 h-4 ml-1 bg-foreground/50 animate-pulse" />
        )}
      </div>
    </div>
  )
}

