import React, { useState, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface EditableProjectDescriptionProps {
  projectId: string
  description?: string
  onUpdateDescription: (projectId: string, description: string) => Promise<void>
  placeholder?: string
}

export const EditableProjectDescription: React.FC<EditableProjectDescriptionProps> = ({
  projectId,
  description = '',
  onUpdateDescription,
  placeholder = 'Start by explaining what\'s this project about.'
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(description)
  const [isSaving, setIsSaving] = useState(false)

  // Sync editedDescription when description changes (from store update)
  useEffect(() => {
    if (!isEditing) {
      setEditedDescription(description)
    }
  }, [description, isEditing])

  const handleStartEdit = () => {
    setEditedDescription(description)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedDescription(description)
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    const trimmedDescription = editedDescription.trim()

    if (trimmedDescription === description) {
      setIsEditing(false)
      return
    }

    try {
      setIsSaving(true)
      await onUpdateDescription(projectId, trimmedDescription)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update project description:', error)
      setEditedDescription(description)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          placeholder={placeholder}
          className="text-sm min-h-[80px] resize-none border border-foreground/20 focus-visible:ring-1"
          minRows={3}
          maxRows={6}
          autoFocus
        />
        <div className="flex items-center gap-2">
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
          <span className="text-xs text-foreground/40 ml-auto">
            Press Cmd/Ctrl + Enter to save, Esc to cancel
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="group inline-flex items-center gap-2">
      {description ? (
        <p className="text-sm whitespace-pre-wrap">{description}</p>
      ) : (
        <p className="text-sm italic">{placeholder}</p>
      )}
      <Button
        variant="secondary"
        size="icon"
        onClick={handleStartEdit}
        className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
      >
        <Edit2 size={14} />
      </Button>
    </div>
  )
}

