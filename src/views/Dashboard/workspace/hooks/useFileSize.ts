import { useState, useEffect } from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'
import { AgentBuild } from '@/services/dashboard/hub/agentService'

interface UseFileSizeProps {
  agent: Agent
  filteredBuilds: AgentBuild[]
}

export const useFileSize = ({ agent, filteredBuilds }: UseFileSizeProps) => {
  const [fileSize, setFileSize] = useState<number | null>(null)

  useEffect(() => {
    const checkFileSize = async () => {
      if (filteredBuilds.length > 0 && filteredBuilds[0].build_file_url) {
        try {
          if (typeof window !== 'undefined' && (window as any).electronAPI) {
            const userDataPath = await (window as any).electronAPI.getUserDataPath()
            const filename = filteredBuilds[0].build_file_url.split('/').pop() || ''
            const filePath = `${userDataPath}/agents/${agent.id}/${filename}`
            
            const result = await (window as any).electronAPI.getFileSize(filePath)
            if (result.exists) {
              setFileSize(result.size)
            }
          }
        } catch (error) {
          console.error('Error checking file size:', error)
        }
      }
    }
    
    checkFileSize()
  }, [agent.id, filteredBuilds])

  return fileSize
}

