import React, { useState, useEffect } from 'react'
import { Folder, Sparkles, Plus, Network, Database, FolderOpen } from 'lucide-react'
import { EditableProjectName } from './EditableProjectName'
import { EditableProjectDescription } from './EditableProjectDescription'
import { ProjectMenu } from './ProjectMenu'
import { useToast } from '@/components/ui/toast'
import { useProjectStore } from '@/store/projectStore'

interface ProjectWelcomeProps {
  projectId: string
  projectName: string
  description?: string
  storage_path?: string
  onUpdateName: (projectId: string, name: string) => Promise<void>
  onUpdateDescription: (projectId: string, description: string) => Promise<void>
  onDelete?: () => void
}

export const ProjectWelcome: React.FC<ProjectWelcomeProps> = ({ 
  projectId, 
  projectName, 
  description,
  storage_path: initialStoragePath,
  onUpdateName,
  onUpdateDescription,
  onDelete
}) => {
  const { showToast } = useToast()
  const { updateProjectStoragePath, getProjectStoragePath, addSession, projects } = useProjectStore()
  const [storagePath, setStoragePath] = useState<string | null>(initialStoragePath || null)
  const [isLoadingStorage, setIsLoadingStorage] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  useEffect(() => {
    // Fetch storage path on mount if not provided
    if (!initialStoragePath) {
      const fetchStoragePath = async () => {
        try {
          const path = await getProjectStoragePath(projectId)
          setStoragePath(path)
        } catch (error) {
          console.error('Error fetching storage path:', error)
        }
      }
      fetchStoragePath()
    }
  }, [projectId, initialStoragePath, getProjectStoragePath])

  const handleAddAgents = () => {
    showToast(
      'Coming Soon',
      'This feature will be added in the next update'
    )
  }

  const handleStorageClick = async () => {
    try {
      setIsLoadingStorage(true)
      
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        const result = await (window as any).electronAPI.showFolderPicker()
        
        if (result.success && result.path) {
          try {
            await updateProjectStoragePath(projectId, result.path)
            setStoragePath(result.path)
            showToast(
              'Storage Path Updated',
              'Storage path has been successfully set'
            )
          } catch (error: any) {
            console.error('Error updating storage path:', error)
            showToast(
              'Error',
              error?.message || 'Failed to update storage path'
            )
          }
        } else if (!result.canceled) {
          showToast(
            'Error',
            result.error || 'Failed to select folder'
          )
        }
      } else {
        showToast(
          'Error',
          'File system access is not available'
        )
      }
    } catch (error: any) {
      console.error('Error opening folder picker:', error)
      showToast(
        'Error',
        error?.message || 'Failed to open folder picker'
      )
    } finally {
      setIsLoadingStorage(false)
    }
  }

  const handleStoragePathClick = async (path: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        if ((window as any).electronAPI.openPath) {
          await (window as any).electronAPI.openPath(path)
        } else {
          showToast(
            'Error',
            'Unable to open folder'
          )
        }
      }
    } catch (error) {
      console.error('Error opening path:', error)
      showToast(
        'Error',
        'Failed to open folder'
      )
    }
  }

  const handleCreateSession = async () => {
    try {
      setIsCreatingSession(true)
      
      // Get current project to count existing sessions
      const currentProject = projects.find(p => p.id === projectId)
      const existingSessions = currentProject?.sessions || []
      const sessionCount = existingSessions.length
      const sessionName = sessionCount === 0 ? 'New Session' : `New Session ${sessionCount + 1}`
      
      await addSession(projectId, sessionName)
      showToast(
        'Session Created',
        `Session "${sessionName}" has been created successfully`
      )
    } catch (error: any) {
      console.error('Error creating session:', error)
      showToast(
        'Error',
        error?.message || 'Failed to create session'
      )
    } finally {
      setIsCreatingSession(false)
    }
  }

  const quickActions = [
    {
      icon: Plus,
      label: 'Create Session',
      desc: 'Start a new research session',
      onClick: handleCreateSession
    },
    {
      icon: Network,
      label: 'Add Agents',
      desc: 'Connect agents to project',
      onClick: handleAddAgents
    },
    {
      icon: Database,
      label: 'Edit Storage',
      desc: 'Manage project storage',
      onClick: handleStorageClick
    },
  ]

  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="max-w-2xl w-full space-y-6 relative">
        {/* Menu Button */}
        {onDelete && (
          <div className="absolute -top-8 right-0">
            <ProjectMenu onDelete={onDelete} />
          </div>
        )}

        {/* Header */}
        <div className="space-y-2 ">
          <div className="flex items-center gap-3">
            <Folder size={40} className="text-primary flex-shrink-0" />
            <EditableProjectName
              projectId={projectId}
              projectName={projectName}
              onUpdateName={onUpdateName}
            />
          </div>
          <EditableProjectDescription
            projectId={projectId}
            description={description}
            onUpdateDescription={onUpdateDescription}
            placeholder="Start by explaining what's this project about."
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            const isStorageAction = action.label === 'Edit Storage'
            const isSessionAction = action.label === 'Create Session'
            const isDisabled = (isStorageAction && isLoadingStorage) || (isSessionAction && isCreatingSession)
            return (
              <button
                key={i}
                onClick={action.onClick}
                disabled={isDisabled}
                className={`group p-4 rounded-lg border border-foreground/10 bg-foreground/[0.01] hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 text-left ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col gap-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform ${(isLoadingStorage && action.label === 'Edit Storage') || (isCreatingSession && action.label === 'Create Session') ? 'opacity-50' : ''}`}>
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm text-foreground mb-1">
                      {action.label}
                    </h3>
                    <p className="text-sm text-foreground/50">
                      {action.desc}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Resources Section */}
        <div className="pt-4 border-t border-foreground/10">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-primary/70 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <p className="text-sm text-foreground">Resources</p>
              {storagePath ? (
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-foreground/50 flex-shrink-0" />
                  <button
                    onClick={() => handleStoragePathClick(storagePath)}
                    className="text-sm text-foreground/60 hover:text-primary transition-colors truncate max-w-md text-left"
                    title={storagePath}
                  >
                    {storagePath}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-foreground/60">
                  No storage path configured. Click "Edit Storage" to set one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

