import React, { useState, useEffect } from 'react'
import { Edit2, Check, X, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxOption } from '@/components/ui/combobox'
import { useToast } from '@/components/ui/toast'
import { useProjectStore } from '@/store/projectStore'

interface LLMModel {
  id: string
  name: string
  provider: string
  description: string
}

interface SessionTopBarProps {
  projectId: string
  sessionId: string
  sessionName: string
  onDelete?: (sessionId: string) => Promise<void>
  onLLMChange?: (sessionId: string, llmId: string) => Promise<void>
  currentLLMId?: string
}

const PROJECT_API_ENDPOINT = 'http://localhost:45793'

export const SessionTopBar: React.FC<SessionTopBarProps> = ({
  projectId,
  sessionId,
  sessionName,
  onDelete,
  onLLMChange,
  currentLLMId
}) => {
  const { showToast } = useToast()
  const { updateSessionName, getSessionLLMModel, updateSessionLLMModel } = useProjectStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(sessionName)
  const [isSaving, setIsSaving] = useState(false)
  const [llmModels, setLlmModels] = useState<LLMModel[]>([])
  const [selectedLLM, setSelectedLLM] = useState<string>(currentLLMId || 'auto')
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isLoadingCurrentLLM, setIsLoadingCurrentLLM] = useState(false)

  // Sync editedName when sessionName changes
  useEffect(() => {
    if (!isEditing) {
      setEditedName(sessionName)
    }
  }, [sessionName, isEditing])

  // Fetch current LLM model for session and available models on mount
  useEffect(() => {
    const fetchSessionLLM = async () => {
      try {
        setIsLoadingCurrentLLM(true)
        const currentLLM = await getSessionLLMModel(sessionId)
        setSelectedLLM(currentLLM)
      } catch (error) {
        console.error('Error fetching session LLM model:', error)
        // Don't show toast for initial load, just use default
      } finally {
        setIsLoadingCurrentLLM(false)
      }
    }

    const fetchAvailableLLMModels = async () => {
      try {
        setIsLoadingModels(true)
        const response = await fetch(`${PROJECT_API_ENDPOINT}/llm-models`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch LLM models: ${response.statusText}`)
        }

        const data = await response.json()
        setLlmModels(data.models || [])
      } catch (error) {
        console.error('Error fetching LLM models:', error)
        showToast(
          'Error',
          'Failed to load LLM models'
        )
      } finally {
        setIsLoadingModels(false)
      }
    }

    fetchSessionLLM()
    fetchAvailableLLMModels()
  }, [sessionId, getSessionLLMModel, showToast])

  const handleStartEdit = () => {
    setEditedName(sessionName)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedName(sessionName)
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    const trimmedName = editedName.trim()
    if (!trimmedName) {
      setEditedName(sessionName)
      setIsEditing(false)
      return
    }

    if (trimmedName === sessionName) {
      setIsEditing(false)
      return
    }

    try {
      setIsSaving(true)
      await updateSessionName(projectId, sessionId, trimmedName)
      setIsEditing(false)
      showToast(
        'Success',
        'Session name updated'
      )
    } catch (error) {
      console.error('Failed to update session name:', error)
      showToast(
        'Error',
        'Failed to update session name'
      )
      setEditedName(sessionName)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await onDelete(sessionId)
        showToast(
          'Success',
          'Session deleted'
        )
      } catch (error) {
        console.error('Failed to delete session:', error)
        showToast(
          'Error',
          'Failed to delete session'
        )
      }
    }
  }

  const handleLLMChange = async (llmId: string) => {
    if (llmId === selectedLLM) return

    const previousLLM = selectedLLM
    setSelectedLLM(llmId)
    
    try {
      await updateSessionLLMModel(sessionId, llmId)
      if (onLLMChange) {
        await onLLMChange(sessionId, llmId)
      }
      showToast(
        'Success',
        'LLM model updated'
      )
    } catch (error) {
      console.error('Failed to update LLM model:', error)
      showToast(
        'Error',
        'Failed to update LLM model'
      )
      // Revert selection on error
      setSelectedLLM(previousLLM)
    }
  }

  const comboboxOptions: ComboboxOption[] = llmModels.map((model) => ({
    value: model.id,
    label: model.name,
    description: model.description
  }))

  return (
    <div className="flex sticky top-0 items-center justify-between gap-4 backdrop-blur-sm">
      {/* Left side - Editable session name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
              className="flex-1"
              autoFocus
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={handleSaveEdit}
              disabled={isSaving}
            >
              <Check size={16} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0 group">
            <h2 className="text-foreground truncate">{sessionName}</h2>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleStartEdit}
              className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
            >
              <Edit2 size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Right side - LLM combobox and delete button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-[280px]">
          <Combobox
            options={comboboxOptions}
            value={selectedLLM}
            onValueChange={handleLLMChange}
            placeholder={isLoadingModels ? "Loading models..." : "Select LLM model"}
            className="h-9"
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}

