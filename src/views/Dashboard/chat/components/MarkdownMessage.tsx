import React from 'react'
import { marked } from 'marked'

interface MarkdownMessageProps {
  content: string
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  const html = marked.parse(content)
  const parsedHtml = typeof html === 'string' ? html : String(html)
  
  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  )
}

