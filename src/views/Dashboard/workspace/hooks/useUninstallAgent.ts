import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'

interface UseUninstallAgentProps {
  agentId: string
  onSuccess?: () => void
}

export const useUninstallAgent = ({ agentId, onSuccess }: UseUninstallAgentProps) => {
  const { uninstallAgent } = useAgentStore()
  const [isUninstalling, setIsUninstalling] = useState(false)

  const handleUninstall = async () => {
    setIsUninstalling(true)
    try {
      await uninstallAgent(agentId)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error uninstalling agent:', error)
      alert('Failed to uninstall agent. Please try again.')
      throw error
    } finally {
      setIsUninstalling(false)
    }
  }

  return {
    isUninstalling,
    handleUninstall,
  }
}

