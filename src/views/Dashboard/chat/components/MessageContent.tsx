import React from 'react'
import { MarkdownMessage } from './MarkdownMessage'
import { FileList } from './FileList'
import { parseToolMessage } from '@/services/dashboard/workspace/agentFileService'

interface MessageContentProps {
  text: string
  toolId?: string | null
  responseStyle?: string
}

export const MessageContent: React.FC<MessageContentProps> = ({ 
  text, 
  toolId, 
  responseStyle 
}) => {
  // If it's a tool message, render based on response style
  if (toolId && responseStyle) {
    try {
      const parsed = JSON.parse(text)
      
      switch (responseStyle) {
        case 'FILE_LIST':
          return <FileList paths={Array.isArray(parsed) ? parsed : [parsed]} />
        default:
          return <MarkdownMessage content={text} />
      }
    } catch (error) {
      // If JSON parsing fails, fall back to markdown
      return <MarkdownMessage content={text} />
    }
  }
  
  // Regular message - parse as markdown
  return <MarkdownMessage content={text} />
}

