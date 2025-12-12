import React, { useState, useEffect } from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { SessionMessageList, Message } from './components/SessionMessageList'
import { SessionSendInput } from './components/SessionSendInput'
import { SessionTopBar } from './components/SessionTopBar'
import { useProjectStore } from '@/store/projectStore'

interface SessionChatProps {
    projectId: string
    sessionId: string
    onDeleteSession?: (sessionId: string) => Promise<void>
}

export function SessionChat({ projectId, sessionId, onDeleteSession }: SessionChatProps) {
    const { projects } = useProjectStore()
    const [messages, setMessages] = useState<Message[]>([])
    const [streamingMessage, setStreamingMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Get session name from store
    const selectedProject = projects.find(p => p.id === projectId)
    const selectedSession = selectedProject?.sessions?.find(s => s.id === sessionId)
    const sessionName = selectedSession?.name || 'Session'

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return

        // Add user message
        const userMessage: Message = {
            role: 'user',
            text: text.trim(),
            timestamp: new Date()
        }
        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)

        try {
            // TODO: Implement actual API call to session endpoint
            // For now, simulate a response
            await new Promise(resolve => setTimeout(resolve, 1000))

            const response: Message = {
                role: 'assistant',
                text: `This is a placeholder response for session ${sessionId}. The actual API integration will be implemented here.`,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, response])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: Message = {
                role: 'assistant',
                text: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteSession = async (sessionId: string) => {
        if (onDeleteSession) {
            await onDeleteSession(sessionId)
        }
    }

    const handleLLMChange = async (sessionId: string, llmId: string) => {
        // TODO: Implement API call to update session LLM
        console.log('Update session LLM:', sessionId, llmId)
    }

    return (
        <div className="flex h-full py-2 max-w-5xl mx-auto px-8 flex-col relative gap-2">
            <SessionTopBar
                projectId={projectId}
                sessionId={sessionId}
                sessionName={sessionName}
                onDelete={handleDeleteSession}
                onLLMChange={handleLLMChange}
            />
            <SessionMessageList
                projectId={projectId}
                sessionId={sessionId}
                messages={messages}
                streamingMessage={streamingMessage}
                isLoading={isLoading}
                onMessagesChange={setMessages}
                onStreamingMessageChange={setStreamingMessage}
            />
            <SessionSendInput
                projectId={projectId}
                sessionId={sessionId}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </div>
    )
}

