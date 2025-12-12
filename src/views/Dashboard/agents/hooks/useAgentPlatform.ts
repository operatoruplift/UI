import { useState, useEffect } from 'react'
import { useDeviceStore } from '@/store/deviceStore'

/**
 * Hook to detect and map current platform to build platform format
 */
export const useAgentPlatform = () => {
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null)
  const { currentDevice, fetchDevices } = useDeviceStore()

  useEffect(() => {
    const getPlatform = async () => {
      // First try to get from device store
      if (currentDevice?.platform) {
        const platform = currentDevice.platform.toLowerCase()
        // Map device platform to build platform format
        if (platform.includes('windows') || platform.includes('win')) {
          setCurrentPlatform('windows')
        } else if (platform.includes('mac')) {
          setCurrentPlatform('mac')
        } else if (platform.includes('linux')) {
          setCurrentPlatform('linux')
        }
        return
      }

      // If no device, fetch devices first
      if (!currentDevice) {
        await fetchDevices()
      }

      // Fallback: Get from Electron API
      if (typeof window !== 'undefined' && (window as any).electronAPI?.getDeviceInfo) {
        try {
          const deviceInfo = await (window as any).electronAPI.getDeviceInfo()
          const platform = deviceInfo.platform
          
          // Map Electron platform to build platform format
          if (platform === 'win32') {
            setCurrentPlatform('windows')
          } else if (platform === 'darwin') {
            setCurrentPlatform('mac')
          } else if (platform === 'linux') {
            setCurrentPlatform('linux')
          }
        } catch (error) {
          console.warn('Could not get device info from Electron:', error)
        }
      }
    }

    getPlatform()
  }, [currentDevice, fetchDevices])

  return currentPlatform
}

