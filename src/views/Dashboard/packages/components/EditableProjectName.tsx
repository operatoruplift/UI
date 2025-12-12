import React, { useState, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EditableProjectNameProps {
  projectId: string
  projectName: string
  onUpdateName: (projectId: string, name: string) => Promise<void>
  className?: string
}

export const EditableProjectName: React.FC<EditableProjectNameProps> = ({
  projectId,
  projectName,
  onUpdateName,
  className = 'text-3xl'
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(projectName)
  const [isSaving, setIsSaving] = useState(false)

  // Sync editedName when projectName changes (from store update)
  useEffect(() => {
    if (!isEditing) {
      setEditedName(projectName)
    }
  }, [projectName, isEditing])

  const handleStartEdit = () => {
    setEditedName(projectName)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedName(projectName)
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    const trimmedName = editedName.trim()
    if (!trimmedName) {
      setEditedName(projectName)
      setIsEditing(false)
      return
    }

    if (trimmedName === projectName) {
      setIsEditing(false)
      return
    }

    try {
      setIsSaving(true)
      await onUpdateName(projectId, trimmedName)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update project name:', error)
      setEditedName(projectName)
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

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className={`${className}`}
          autoFocus
        />
        <Button
          variant="secondary"
          size="icon"
          onClick={handleSaveEdit}
          disabled={isSaving}
        >
          <Check size={18} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleCancelEdit}
          disabled={isSaving}
        >
          <X size={18} />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-1 group">
      <h1 className={className + ' text-foreground'}>{projectName}</h1>
      <Button
        variant="secondary"
        size="icon"
        onClick={handleStartEdit}
        className="opacity-0 group-hover:opacity-100 transition-all"
      >
        <Edit2 size={16} />
      </Button>
    </div>
  )
}

