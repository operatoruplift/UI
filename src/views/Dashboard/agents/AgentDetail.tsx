import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAgentStore } from '@/store/agentStore'
import { useAgentPlatform } from './hooks/useAgentPlatform'
import { downloadBuildFile, downloadAgentData } from '@/services/dashboard/hub/agentDownloadService'
import {
  AgentHeader,
  AgentSidebar,
  AgentContent,
  AgentInstalledMessage,
} from './components'

// Import agent startup service to start agent on install
const startAgentOnInstall = (window as any).electronAPI?.startAgentOnInstall || (() => {})

export const AgentDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isInstalled, setIsInstalled] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const currentPlatform = useAgentPlatform()

  const {
    currentAgent,
    fetchAgentById,
    isLoading,
    installedAgentIds,
    installAgent,
    uninstallAgent,
    checkIfInstalled,
    fetchInstalledAgents,
  } = useAgentStore()

  useEffect(() => {
    if (id) {
      fetchAgentById(id)
      // Check if agent is installed
      checkIfInstalled(id).then(setIsInstalled)
    }
    // Fetch installed agents to ensure we have the latest list
    fetchInstalledAgents()
  }, [id, fetchAgentById, checkIfInstalled, fetchInstalledAgents])

  // Update isInstalled when installedAgentIds changes
  useEffect(() => {
    if (id) {
      setIsInstalled(installedAgentIds.includes(id))
    }
  }, [id, installedAgentIds])

  const [downloadProgress, setDownloadProgress] = useState<{ downloaded: number; total: number; percentage: number } | null>(null)

  const handleAction = async () => {
    if (!id || !currentAgent) return

    setIsToggling(true)
    setDownloadProgress(null)
    try {
      if (isInstalled) {
        await uninstallAgent(id)
        setIsInstalled(false)
      } else {
        try {
          // For offline agents, download build file for current platform
          const platformBuild = currentAgent.builds?.find(
            build => build.platform === currentPlatform
          )
          if (platformBuild?.build_file_url && currentPlatform) {
            try {
              await downloadBuildFile(
                id,
                platformBuild.build_file_url,
                currentPlatform,
                (downloaded, total, percentage) => {
                  setDownloadProgress({ downloaded, total, percentage })
                }
              )
            } catch (error) {
              console.error('Error downloading build file:', error)
              alert(`Failed to download build file: ${error instanceof Error ? error.message : 'Unknown error'}`)
              // Continue with installation even if download fails
            }
            if (currentAgent.data_json_endpoint) {
              try {
                await downloadAgentData(id, currentAgent.data_json_endpoint)
              } catch (error) {
                console.error('Error downloading data.json:', error)
                alert(`Failed to download data.json: ${error instanceof Error ? error.message : 'Unknown error'}`)
                // Continue with installation even if download fails
              }
            }
            await installAgent(id)
            setIsInstalled(true)
            setDownloadProgress(null)
            
            // Start the agent executable immediately after installation
            if ((window as any).electronAPI?.startAgentOnInstall) {
              try {
                (window as any).electronAPI.startAgentOnInstall(id);
              } catch (error) {
                console.warn('Failed to start agent on install:', error);
              }
            }
            
            // Redirect to workspace with this agent selected
            navigate(`/workspace?agent=${id}`)
          }
        } catch (error) {
          console.error('Error toggling agent installation:', error)
          // Revert state on error
          setIsInstalled(!isInstalled)
          setDownloadProgress(null)
        } finally {
          setIsToggling(false)
        }
      }
    } catch (error) {
      console.error('Error in handleAction:', error)
      setIsToggling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-foreground/60" size={24} />
      </div>
    )
  }

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground/60">Agent not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-6 p-8 pt-12 max-w-4xl mx-auto">
      <AgentHeader agent={currentAgent} />

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        <AgentSidebar agent={currentAgent} />
        <AgentContent
          agent={currentAgent}
          currentPlatform={currentPlatform}
          isInstalled={isInstalled}
          isToggling={isToggling}
          downloadProgress={downloadProgress}
          onToggle={handleAction}
        />
      </div>

      <AgentInstalledMessage agent={currentAgent} isInstalled={isInstalled} />
    </div>
  )
}

  