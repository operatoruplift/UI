import { useState, useEffect } from 'react'
import { parseToolMessage } from '@/services/dashboard/workspace/agentFileService'
import { readAgentFiles } from '@/services/dashboard/workspace/agentFileService'

export interface ParsedMessage {
  text: string
  toolId: string | null
  responseStyle?: string
}

export const useMessageParser = (messages: Array<{ role: string; text: string }>) => {
  const [parsedMessages, setParsedMessages] = useState<Record<number, ParsedMessage>>({})

  useEffect(() => {
    const parsed: Record<number, ParsedMessage> = {}

    messages.forEach((msg, index) => {
      const { tool_id, text } = parseToolMessage(msg.text)
      
      if (tool_id) {
        // Initialize with tool_id, will update responseStyle when agent data loads
        parsed[index] = {
          text,
          toolId: tool_id,
        }

        // Load agent data to get response style
        readAgentFiles(tool_id)
          .then((toolData) => {
            setParsedMessages((prev) => ({
              ...prev,
              [index]: {
                ...prev[index],
                responseStyle: toolData.response_style,
              },
            }))
          })
          .catch((error) => {
            console.error('Error loading agent data:', error)
            // Keep the message but without response style
          })
      } else {
        parsed[index] = {
          text,
          toolId: null,
        }
      }
    })

    setParsedMessages(parsed)
  }, [messages])

  return parsedMessages
}

