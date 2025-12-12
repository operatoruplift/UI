import { useEffect, useState, useCallback } from 'react'
import { voiceService, type VoiceServiceStatus, type VoiceServiceConfig } from '@/services/dashboard/voice'
import { getOrCreateDeviceId } from '@/services/dashboard/devices/deviceService'
import { withAuth } from '@/store/authStore'

export const useVoiceService = (selectedDeviceId: string | null) => {
  const [status, setStatus] = useState<VoiceServiceStatus>('idle')
  const [audioLevel, setAudioLevel] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize voice service
  useEffect(() => {
    const initializeService = async () => {
      try {
        const deviceId = getOrCreateDeviceId()
        const token = await withAuth(async (_, token) => token)
        
        if (!token) {
          console.error('No auth token available')
          return
        }

        // Get API keys from environment or config
        const azureApiKey = await window.electronAPI?.getEnv('AZURE_OPENAI_API_KEY') || ''
        let azureEndpoint = await window.electronAPI?.getEnv('AZURE_OPENAI_ENDPOINT') || ''
        const elevenLabsApiKey = await window.electronAPI?.getEnv('ELEVEN_LABS_API_KEY') || ''
        let elevenLabsVoiceId = await window.electronAPI?.getEnv('ELEVEN_LABS_VOICE_ID') || ''
        
        // Validate and log Azure configuration (without exposing sensitive data)
        if (azureEndpoint) {
          const hasDeployment = azureEndpoint.includes('deployment=')
          const hasApiVersion = azureEndpoint.includes('api-version=')
          console.log('Azure endpoint validation:', {
            hasEndpoint: !!azureEndpoint,
            hasDeployment,
            hasApiVersion,
            endpointFormat: azureEndpoint.startsWith('wss://') ? 'wss://' : azureEndpoint.startsWith('https://') ? 'https://' : 'other',
            endpointLength: azureEndpoint.length,
          })
          console.log('Azure API key validation:', {
            hasApiKey: !!azureApiKey,
            apiKeyLength: azureApiKey.length,
            apiKeyPrefix: azureApiKey.substring(0, 4) + '...' + azureApiKey.substring(azureApiKey.length - 4),
          })
          
          if (!hasDeployment) {
            console.warn('Azure endpoint may be missing deployment parameter. Expected format: wss://.../realtime?api-version=...&deployment=gpt-4o-realtime-preview')
          }
          
          if (!azureApiKey) {
            console.error('Azure API key is missing!')
          } else if (azureApiKey.length < 20) {
            console.warn('Azure API key seems too short. Typical Azure API keys are 32+ characters.')
          }
        }
        
        // Validate Eleven Labs voice ID
        if (elevenLabsVoiceId) {
          elevenLabsVoiceId = elevenLabsVoiceId.trim()
          // Warn if it looks like an API key instead of a voice ID
          if (elevenLabsVoiceId.startsWith('sk_')) {
            console.error('ELEVEN_LABS_VOICE_ID appears to be an API key. Voice IDs are typically short strings like "21m00Tcm4TlvDq8ikWAM". Please check your environment variables.')
          }
        }
        console.log(azureEndpoint)
        
        if (!azureApiKey || !azureEndpoint || !elevenLabsApiKey || !elevenLabsVoiceId) {
          console.error('Missing API keys for voice service', {
            hasAzureKey: !!azureApiKey,
            hasAzureEndpoint: !!azureEndpoint,
            hasElevenLabsKey: !!elevenLabsApiKey,
            hasElevenLabsVoiceId: !!elevenLabsVoiceId,
          })
          return
        }

        // Normalize Azure endpoint - ensure it's a valid WebSocket URL
        azureEndpoint = azureEndpoint.trim()
        if (!azureEndpoint.startsWith('wss://') && !azureEndpoint.startsWith('ws://')) {
          // Convert https to wss if needed
          if (azureEndpoint.startsWith('https://')) {
            azureEndpoint = azureEndpoint.replace('https://', 'wss://')
          } else if (azureEndpoint.startsWith('http://')) {
            azureEndpoint = azureEndpoint.replace('http://', 'ws://')
          }
          
          // Ensure it ends with /realtime
          if (!azureEndpoint.includes('/realtime')) {
            azureEndpoint = azureEndpoint.replace(/\/$/, '') + '/realtime'
          }
        }

        const config: VoiceServiceConfig = {
          azureApiKey,
          azureEndpoint,
          elevenLabsApiKey,
          elevenLabsVoiceId,
          deviceId,
          authToken: token,
        }

        voiceService.initialize(config, {
          onStatusChange: setStatus,
          onAudioLevel: setAudioLevel,
          onTranscript: (text) => {
            console.log('Transcript:', text)
          },
          onError: (error) => {
            console.error('Voice service error:', error)
          },
        })

        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing voice service:', error)
      }
    }

    initializeService()
  }, [])

  // Update device when selected device changes
  useEffect(() => {
    if (isInitialized && selectedDeviceId) {
      voiceService.setDevice(selectedDeviceId)
    }
  }, [selectedDeviceId, isInitialized])

  const start = useCallback(async () => {
    if (!isInitialized) {
      console.error('Voice service not initialized')
      return
    }
    try {
      await voiceService.start()
    } catch (error) {
      console.error('Error starting voice service:', error)
    }
  }, [isInitialized])

  const stop = useCallback(() => {
    voiceService.stop()
  }, [])

  return {
    status,
    audioLevel,
    isInitialized,
    start,
    stop,
    isSpeaking: status === 'listening',
  }
}

