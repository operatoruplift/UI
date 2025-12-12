import React, { useState, useEffect } from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'
import { readAgentFiles } from '@/services/dashboard/workspace/agentFileService'
import { saveAgentConfiguration } from '@/services/dashboard/workspace/agentConfigurationService'
import { Button } from '@/components/ui/button'
import { EditableField, EditableFieldConfig } from '@/components/ui/editable-field'
import { Loader2, Save } from 'lucide-react'
import { InstalledAgentRefresh } from './InstalledAgentRefresh'

interface InstalledAgentConfigurationProps {
  agent: Agent
}

export const InstalledAgentConfiguration: React.FC<InstalledAgentConfigurationProps> = ({
  agent,
}) => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editableFields, setEditableFields] = useState<Record<string, EditableFieldConfig>>({})
  const [dataJson, setDataJson] = useState<any>(null)
  const [dataJsonPath, setDataJsonPath] = useState<string | null>(null)

  useEffect(() => {
    loadConfiguration()
  }, [agent.id])

  const loadConfiguration = async () => {
    try {
      setLoading(true)
      const fileData = await readAgentFiles(agent.id)

      if (fileData.dataJson && fileData.dataJson.editable) {
        setEditableFields(fileData.dataJson.editable)
        setDataJson(fileData.dataJson)
        setDataJsonPath(fileData.dataJsonPath)
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (fieldKey: string, newValue: any) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        value: newValue,
      },
    }))
  }

  const handleDefaultToggle = (fieldKey: string, isDefault: boolean) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        default: isDefault,
        // If toggling to editable and value is empty array, initialize it
        value: isDefault ? prev[fieldKey].value : (prev[fieldKey].value || []),
      },
    }))
  }

  const handleSave = async () => {
    if (!dataJson || !dataJsonPath) return

    try {
      setSaving(true)

      const result = await saveAgentConfiguration(dataJsonPath, dataJson, editableFields)

      if (result.success) {
        // Update local state with saved data
        setDataJson({
          ...dataJson,
          editable: editableFields,
        })
        // alert('Configuration saved successfully!')
      } else {
        throw new Error(result.error || 'Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving configuration:', error)
      alert(`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-foreground/60" size={24} />
      </div>
    )
  }

  if (!editableFields || Object.keys(editableFields).length === 0) {
    return (
      <div className="space-y-3 pt-4 p-6 border-t border-foreground/10">
        <p className="text-sm text-foreground/60 uppercase tracking-wide font-medium">
          Configuration
        </p>
        <div className="p-3 rounded-lg bg-foreground/5 border border-foreground/10">
          <p className="text-sm text-foreground/60">No editable configuration available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-4 p-6 border-t border-foreground/10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60 uppercase tracking-wide font-medium">
          Configuration
        </p>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </Button>
      </div>
      <InstalledAgentRefresh agent={agent} />
      <div className="space-y-6">
        {Object.entries(editableFields).map(([fieldKey, field]) => (
          <EditableField
            key={fieldKey}
            fieldKey={fieldKey}
            field={field}
            onChange={handleFieldChange}
            onDefaultToggle={handleDefaultToggle}
          />
        ))}
      </div>
    </div>
  )
}
