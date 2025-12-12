import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getUserInstalledAgentsWithDetails, InstalledAgentWithDetails } from '@/services/dashboard/workspace/installedAgentsService'
import { InstalledAgentSidebar } from './InstalledAgentSidebar'
import { InstalledAgentDetail } from './InstalledAgentDetail'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export const WorkspaceContent: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [installedAgents, setInstalledAgents] = useState<InstalledAgentWithDetails[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInstalledAgents()
  }, [])

  // Handle agent selection from URL query param
  useEffect(() => {
    const agentParam = searchParams.get('agent')
    if (agentParam && installedAgents.find(ia => ia.agent.id === agentParam)) {
      setSelectedAgentId(agentParam)
    }
  }, [searchParams, installedAgents])

  const fetchInstalledAgents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const agents = await getUserInstalledAgentsWithDetails()
      setInstalledAgents(agents)

      // Check URL param first, then auto-select first agent
      const agentParam = searchParams.get('agent')
      if (agentParam && agents.find(ia => ia.agent.id === agentParam)) {
        setSelectedAgentId(agentParam)
      } else if (agents.length > 0 && !selectedAgentId) {
        // Auto-select first agent if none selected
        setSelectedAgentId(agents[0].agent.id)
      } else if (agents.length === 0) {
        setSelectedAgentId(null)
      }
    } catch (error: any) {
      console.error('Error fetching installed agents:', error)
      // Convert technical errors to friendly messages
      let friendlyError = error?.message || "Looks like I'm unable to connect with your system. Please check your internet connection and try again."

      if (friendlyError.includes('timeout') || friendlyError.includes('Timeout')) {
        friendlyError = "Looks like I'm unable to connect with your system. Please check your internet connection and try again."
      } else if (friendlyError.includes('not authenticated') || friendlyError.includes('401')) {
        friendlyError = "Your session has expired. Please log in again."
      }

      setError(friendlyError)
      setInstalledAgents([]) // Clear agents on error
    } finally {
      setIsLoading(false)
    }
  }

  const selectedInstalledAgent = installedAgents.find(
    ia => ia.agent.id === selectedAgentId
  ) || null

  const handleNavigateToStore = () => {
    navigate('/store') // Navigate to marketplace
  }

  const handleBack = () => {
    setSelectedAgentId(null)
  }

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <div style={{
        width: '300px'
      }} className="w-[25vw] border-r border-foreground/10">
        <InstalledAgentSidebar
          onNavigateToStore={handleNavigateToStore}
          installedAgents={installedAgents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          isLoading={isLoading}
        />
      </div>

      <ScrollArea className="h-full w-full">
        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-foreground/60" size={24} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-2xl font-semibold text-foreground">Unable to Load Agents</h2>
              <p className="text-sm text-foreground/60">
                {error}
              </p>
              <Button onClick={fetchInstalledAgents} variant="default">
                Try Again
              </Button>
            </div>
          </div>
        ) : selectedInstalledAgent ? (
          <InstalledAgentDetail
            installedAgent={selectedInstalledAgent}
            onBack={handleBack}
            onUninstall={fetchInstalledAgents}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-2xl font-semibold text-foreground">No Agent Selected</h2>
              <p className="text-sm text-foreground/60">
                Select an agent from the sidebar to view its details, or install new agents from the Uplift Store.
              </p>
              <Button onClick={handleNavigateToStore} variant="default">
                Browse Uplift Store
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

