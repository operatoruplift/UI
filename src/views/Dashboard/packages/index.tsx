import React, { useState, useEffect } from 'react'
import { PackagesSidebar } from './components/PackagesSidebar'
import { ProjectWelcome } from './components/ProjectWelcome'
import { ProjectError } from './components/ProjectError'
import { SessionChat } from './components/SessionChat'
import { useProjectStore } from '@/store/projectStore'
import { Loader2 } from 'lucide-react'

export function Packages() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const { 
    projects, 
    isHealthy, 
    isLoading, 
    error, 
    checkHealth, 
    fetchProjects,
    addProject 
  } = useProjectStore()

  useEffect(() => {
    // Check health and fetch projects on mount
    const initialize = async () => {
      await checkHealth()
      const state = useProjectStore.getState()
      if (state.isHealthy) {
        await fetchProjects()
      }
    }
    initialize()
  }, [])

  useEffect(() => {
    // Fetch sessions when a project is selected
    if (selectedProjectId) {
      const fetchSessions = async () => {
        try {
          await useProjectStore.getState().fetchSessions(selectedProjectId)
        } catch (error) {
          console.error('Failed to fetch sessions:', error)
        }
      }
      fetchSessions()
    }
  }, [selectedProjectId])

  const handleCreateProject = async () => {
    // Count existing "New Project" names to create unique name
    const newProjectCount = projects.filter(p => p.name.startsWith('New Project')).length
    const projectName = newProjectCount === 0 ? 'New Project' : `New Project ${newProjectCount + 1}`
    
    try {
      await addProject(projectName)
      // Auto-select the newly created project
      const updatedProjects = useProjectStore.getState().projects
      const newProject = updatedProjects[updatedProjects.length - 1]
      if (newProject) {
        setSelectedProjectId(newProject.id)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    setSelectedSessionId(null) // Clear session selection when project changes
  }

  const handleSelectSession = (projectId: string, sessionId: string) => {
    setSelectedProjectId(projectId)
    setSelectedSessionId(sessionId)
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!selectedProjectId) return
    
    try {
      await useProjectStore.getState().removeSession(selectedProjectId, sessionId)
      
      // Clear selection if deleted session was selected
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null)
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const handleDeleteProject = async () => {
    if (!selectedProjectId) return
    
    try {
      await useProjectStore.getState().removeProject(selectedProjectId)
      setSelectedProjectId(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleRetry = async () => {
    await checkHealth()
    const state = useProjectStore.getState()
    if (state.isHealthy) {
      await fetchProjects()
    }
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  // Show error page if service is not healthy or there's an error
  if (error || (!isHealthy && !isLoading)) {
    return (
      <ProjectError 
        error={error || 'Project service is not available'} 
        onRetry={handleRetry}
      />
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-foreground/60" size={24} />
      </div>
    )
  }

  // Show main interface
  return (
    <div className="flex w-full h-full">
      <div className="w-[240px] flex-shrink-0">
        <PackagesSidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          selectedSessionId={selectedSessionId}
          onSelectProject={handleSelectProject}
          onSelectSession={handleSelectSession}
          onCreateProject={handleCreateProject}
        />
      </div>
      <div className="flex-1">
        {selectedSessionId && selectedProject ? (
          <SessionChat 
            projectId={selectedProject.id}
            sessionId={selectedSessionId}
            onDeleteSession={handleDeleteSession}
          />
        ) : selectedProject ? (
          <ProjectWelcome 
            projectId={selectedProject.id}
            projectName={selectedProject.name}
            description={selectedProject.description}
            storage_path={selectedProject.storage_path}
            onUpdateName={useProjectStore.getState().updateProjectName}
            onUpdateDescription={useProjectStore.getState().updateProjectDescription}
            onDelete={handleDeleteProject}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-sm text-foreground/60">
                Select a project or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}