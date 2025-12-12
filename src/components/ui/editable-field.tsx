import React, { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { cn } from '@/lib/utils'

export interface EditableFieldConfig {
  type: 'multi_select' | 'text' | 'number' | 'select'
  label: string
  description?: string
  value: any
  default?: boolean
}

interface EditableFieldProps {
  fieldKey: string
  field: EditableFieldConfig
  onChange: (fieldKey: string, newValue: any) => void
  onDefaultToggle?: (fieldKey: string, isDefault: boolean) => void
}

export const EditableField: React.FC<EditableFieldProps> = ({
  fieldKey,
  field,
  onChange,
  onDefaultToggle,
}) => {
  const [newItemInput, setNewItemInput] = useState('')
  const isDefault = field.default === true

  const handleMultiSelectRemove = (item: string) => {
    const currentValue = field.value || []
    const newValue = currentValue.filter((v: string) => v !== item)
    onChange(fieldKey, newValue)
  }

  const handleAddMultiSelectItem = () => {
    const newItem = newItemInput.trim()
    if (!newItem) return

    const currentValue = field.value || []
    if (!currentValue.includes(newItem)) {
      onChange(fieldKey, [...currentValue, newItem])
    }
    setNewItemInput('')
  }

  const handleToggleDefault = () => {
    if (onDefaultToggle) {
      onDefaultToggle(fieldKey, !isDefault)
    }
  }

  // Parse value list if it's a string (comma-separated) when becoming editable
  const parseValueList = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value
    }
    if (typeof value === 'string' && value.trim()) {
      // Split by comma and clean up
      return value.split(',').map((item) => item.trim()).filter((item) => item.length > 0)
    }
    return []
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">
              {field.label}
            </label>
            {isDefault && (
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10  border">
                Default
              </span>
            )}
          </div>
          {field.description && (
            <p className="text-xs text-foreground/60 mt-1">{field.description}</p>
          )}
        </div>
        {field.default !== undefined && (
          <button
            onClick={handleToggleDefault}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isDefault ? 'bg-primary' : 'bg-foreground/20'
            )}
            role="switch"
            aria-checked={isDefault}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isDefault ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        )}
      </div>

      {isDefault ? (
        <div className="p-3 rounded-lg bg-foreground/5 border border-foreground/10">
          <p className="text-sm text-foreground/60 italic">
            Using default value. Toggle off to customize.
          </p>
        </div>
      ) : (
        <>

          {field.type === 'multi_select' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-foreground/5 border border-foreground/10 min-h-[60px]">
                {(() => {
                  const parsedValue = parseValueList(field.value)
                  return parsedValue.length > 0 ? (
                    parsedValue.map((item: string) => (
                      <button
                        key={item}
                        onClick={() => handleMultiSelectRemove(item)}
                        className={cn(
                          'px-3 py-1 text-xs rounded-sm border',
                        )}
                      >
                        {item} ×
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-foreground/40 italic">No items selected</p>
                  )
                })()}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newItemInput}
                  onChange={(e) => setNewItemInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddMultiSelectItem()
                    }
                  }}
                  placeholder="Add new item..."
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddMultiSelectItem}
                  className="text-xs"
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {field.type === 'text' && (
            <Input
              type="text"
              value={field.value || ''}
              onChange={(e) => onChange(fieldKey, e.target.value)}
              className="w-full"
            />
          )}

          {field.type === 'number' && (
            <Input
              type="number"
              value={field.value || 0}
              onChange={(e) => onChange(fieldKey, Number(e.target.value))}
              className="w-full"
            />
          )}

          {field.type === 'select' && (
            <select
              value={field.value || ''}
              onChange={(e) => onChange(fieldKey, e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-foreground/5 border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {/* Options would need to be passed as a prop if needed */}
              <option value="">Select an option</option>
            </select>
          )}
        </>
      )}
    </div>
  )
}

