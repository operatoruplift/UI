/**
 * Voice Service - Handles microphone input, Azure GPT-4o-realtime-preview, and Eleven Labs TTS
 */

export interface VoiceServiceConfig {
  azureApiKey: string
  azureEndpoint: string
  elevenLabsApiKey: string
  elevenLabsVoiceId: string
  deviceId: string
  authToken: string
}

export type VoiceServiceStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'

export interface VoiceServiceCallbacks {
  onStatusChange?: (status: VoiceServiceStatus) => void
  onAudioLevel?: (level: number) => void
  onTranscript?: (text: string) => void
  onError?: (error: Error) => void
}

class VoiceService {
  private azureWs: WebSocket | null = null
  private elevenLabsWs: WebSocket | null = null
  private mediaStream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private audioLevelInterval: number | null = null
  private status: VoiceServiceStatus = 'idle'
  private config: VoiceServiceConfig | null = null
  private callbacks: VoiceServiceCallbacks = {}
  private selectedDeviceId: string | null = null
  private isActive = false
  private currentTranscript = '' // Accumulate transcript from Azure
  private chatServiceAbortController: AbortController | null = null
  private audioQueue: ArrayBuffer[] = [] // Queue for audio chunks
  private isPlayingAudio = false // Track if audio is currently playing

  /**
   * Initialize the voice service with configuration
   */
  initialize(config: VoiceServiceConfig, callbacks: VoiceServiceCallbacks = {}) {
    this.config = config
    this.callbacks = callbacks
  }

  /**
   * Set the selected microphone device
   */
  setDevice(deviceId: string) {
    this.selectedDeviceId = deviceId
    if (this.isActive) {
      this.stop()
      this.start()
    }
  }

  /**
   * Start listening and processing voice
   */
  async start() {
    if (this.isActive) return
    if (!this.config) throw new Error('Voice service not initialized')

    try {
      this.isActive = true
      this.setStatus('listening')

      // Step 1: Get microphone access
      await this.initializeMicrophone()

      // Step 2: Connect to Azure GPT-4o-realtime-preview
      await this.connectToAzure()

      // Step 3: Connect to Eleven Labs
      await this.connectToElevenLabs()

      // Step 4: Start audio level monitoring
      this.startAudioLevelMonitoring()

      // Step 5: Start sending audio to Azure
      this.startSendingAudioToAzure()
    } catch (error) {
      this.setStatus('error')
      this.callbacks.onError?.(error as Error)
      throw error
    }
  }

  /**
   * Stop listening and clean up
   */
  stop() {
    this.isActive = false
    this.setStatus('idle')

    // Stop audio level monitoring
    if (this.audioLevelInterval) {
      clearInterval(this.audioLevelInterval)
      this.audioLevelInterval = null
    }

    // Stop microphone
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    // Abort any ongoing chat service requests
    if (this.chatServiceAbortController) {
      this.chatServiceAbortController.abort()
      this.chatServiceAbortController = null
    }

    // Reset transcript and audio queue
    this.currentTranscript = ''
    this.audioQueue = []
    this.isPlayingAudio = false

    // Close WebSocket connections
    if (this.azureWs) {
      this.azureWs.close()
      this.azureWs = null
    }

    if (this.elevenLabsWs) {
      this.elevenLabsWs.close()
      this.elevenLabsWs = null
    }
  }

  /**
   * Initialize microphone and audio context
   */
  private async initializeMicrophone() {
    const constraints: MediaStreamConstraints = {
      audio: this.selectedDeviceId
        ? { deviceId: { exact: this.selectedDeviceId } }
        : true,
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    this.audioContext = new AudioContext({ sampleRate: 24000 }) // Azure requires 24kHz
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 256
    this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream)
    this.microphone.connect(this.analyser)
  }

  /**
   * Connect to Azure GPT-4o-realtime-preview WebSocket
   */
  private async connectToAzure(): Promise<void> {
    if (!this.config) throw new Error('Config not set')

    return new Promise((resolve, reject) => {
      // Normalize endpoint URL
      let endpoint = this.config!.azureEndpoint.trim()
      
      // Convert https to wss if needed
      if (endpoint.startsWith('https://')) {
        endpoint = endpoint.replace('https://', 'wss://')
      } else if (endpoint.startsWith('http://')) {
        endpoint = endpoint.replace('http://', 'ws://')
      } else if (!endpoint.startsWith('wss://') && !endpoint.startsWith('ws://')) {
        endpoint = `wss://${endpoint}`
      }
      
      // Parse URL to handle existing query parameters
      let url: URL
      try {
        url = new URL(endpoint)
      } catch (error) {
        reject(new Error(`Invalid Azure endpoint URL: ${endpoint}`))
        return
      }
      
      // Preserve existing query parameters (api-version, deployment, etc.)
      // Only add/update the api-key parameter
      const apiKey = this.config!.azureApiKey.trim()
      if (!apiKey) {
        reject(new Error('Azure API key is empty'))
        return
      }
      
      url.searchParams.set('api-key', apiKey)
      
      // If api-version is not set, use default
      if (!url.searchParams.has('api-version')) {
        url.searchParams.set('api-version', '2024-02-15-preview')
      }
      
      const wsUrl = url.toString()
      
      // Log the URL (without the API key for security)
      const safeUrl = wsUrl.replace(/api-key=[^&]*/, 'api-key=***')
      console.log('Connecting to Azure WebSocket:', safeUrl)
      console.log('URL parameters:', {
        hasApiKey: url.searchParams.has('api-key'),
        apiKeyLength: apiKey.length,
        apiVersion: url.searchParams.get('api-version'),
        deployment: url.searchParams.get('deployment'),
        allParams: Array.from(url.searchParams.keys()),
      })
      
      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.azureWs?.readyState !== WebSocket.OPEN) {
          this.azureWs?.close()
          reject(new Error('Azure WebSocket connection timeout. Check your endpoint URL and network connection.'))
        }
      }, 10000) // 10 second timeout
      
      this.azureWs = new WebSocket(wsUrl)

      this.azureWs.onopen = () => {
        clearTimeout(connectionTimeout)
        console.log('Azure WebSocket connected successfully')
        
        // Wait a moment before sending session config to ensure connection is stable
        setTimeout(() => {
          if (this.azureWs?.readyState === WebSocket.OPEN) {
            // Send session configuration
            try {
              this.sendToAzure({
                type: 'session.update',
                session: {
                  modalities: ['audio', 'text'],
                  instructions: 'You are a helpful AI assistant.',
                  voice: 'alloy',
                  input_audio_format: 'pcm16',
                  output_audio_format: 'pcm16',
                  input_audio_transcription: {
                    model: 'whisper-1',
                  },
                  turn_detection: {
                    type: 'server_vad',
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 700,
                  },
                },
              })
              console.log('Session configuration sent')
              resolve()
            } catch (error) {
              console.error('Error sending session configuration:', error)
              reject(error as Error)
            }
          } else {
            reject(new Error('WebSocket closed before session configuration could be sent'))
          }
        }, 100)
      }

      this.azureWs.onmessage = (event) => {
        this.handleAzureMessage(event)
      }

      this.azureWs.onerror = (error) => {
        clearTimeout(connectionTimeout)
        console.error('Azure WebSocket error event:', error)
        // Error details are usually in the close event, not the error event
        // But we can log it for debugging
        // The actual error will be handled in onclose
      }

      this.azureWs.onclose = (event) => {
        clearTimeout(connectionTimeout)
        
        // Log close event details for debugging
        console.log('Azure WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          readyState: this.azureWs?.readyState,
          timestamp: new Date().toISOString(),
        })
        
        // If we never opened, log additional debugging info
        if (event.code === 1006 && this.azureWs?.readyState === WebSocket.CLOSED) {
          const safeUrl = wsUrl.replace(/api-key=[^&]*/, 'api-key=***')
          console.error('Connection failed during handshake. Final URL:', safeUrl)
          console.error('This usually indicates an authentication failure. Please verify:')
          console.error('1. The API key is correct and not expired')
          console.error('2. The API key has permissions for the realtime API')
          console.error('3. The deployment name matches exactly (case-sensitive)')
          console.error('4. The resource region matches your endpoint')
        }
        
        if (!this.isActive) return
        
        // If connection failed during initial connection, reject the promise
        if (event.code !== 1000 && event.code !== 1001) {
          let errorMessage = `WebSocket connection failed`
          
          if (event.code === 1006) {
            errorMessage = `Connection closed abnormally (1006). This usually means:
- Invalid API key or expired credentials
- Incorrect endpoint URL format
- Network/firewall blocking the connection
- Missing or incorrect deployment name in the URL

Please verify:
1. Your AZURE_OPENAI_API_KEY is correct
2. Your AZURE_OPENAI_ENDPOINT includes the deployment name
3. The endpoint format: wss://your-resource.openai.azure.com/openai/realtime?api-version=2024-10-01-preview&deployment=gpt-4o-realtime-preview`
          } else if (event.code === 1002) {
            errorMessage = `Protocol error (1002). Invalid endpoint URL format.`
          } else if (event.code === 1003) {
            errorMessage = `Invalid data (1003). Check your API key format.`
          } else if (event.code === 1008) {
            errorMessage = `Policy violation (1008). Check your API key permissions and endpoint access.`
          } else if (event.code >= 4000) {
            errorMessage = `Server error (${event.code}): ${event.reason || 'Check your Azure configuration'}`
          }
          
          if (event.reason) {
            errorMessage += `\nServer reason: ${event.reason}`
          }
          
          // Only reject if we haven't resolved yet (initial connection)
          if (this.azureWs?.readyState !== WebSocket.OPEN) {
            reject(new Error(`Azure WebSocket error: ${errorMessage}`))
          } else {
            console.warn(`Azure WebSocket closed: ${errorMessage}`)
            // Attempt to reconnect after a delay (but limit retries)
            setTimeout(() => {
              if (this.isActive) {
                this.connectToAzure().catch(err => {
                  console.error('Failed to reconnect to Azure:', err)
                })
              }
            }, 2000)
          }
        }
      }
    })
  }

  /**
   * Connect to Eleven Labs WebSocket for TTS
   */
  private async connectToElevenLabs(): Promise<void> {
    if (!this.config) throw new Error('Config not set')

    // Validate voice ID - it should not look like an API key
    const voiceId = this.config.elevenLabsVoiceId.trim()
    if (!voiceId) {
      throw new Error('Eleven Labs voice ID is required')
    }
    
    // Voice IDs are typically short alphanumeric strings, not API keys (which start with 'sk_')
    if (voiceId.startsWith('sk_') || voiceId.length > 50) {
      throw new Error(`Invalid Eleven Labs voice ID. The voice ID should be a voice identifier (e.g., '21m00Tcm4TlvDq8ikWAM'), not an API key. Current value looks like an API key.`)
    }

    return new Promise((resolve, reject) => {
      // Eleven Labs WebSocket with API key in URL
      const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3&output_format=pcm_16000&xi-api-key=${encodeURIComponent(this.config!.elevenLabsApiKey)}`
      
      this.elevenLabsWs = new WebSocket(wsUrl)

      this.elevenLabsWs.onopen = () => {
        // Initialize with voice settings
        this.elevenLabsWs?.send(JSON.stringify({
          text: '',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }))
        resolve()
      }

      this.elevenLabsWs.onmessage = (event) => {
        this.handleElevenLabsMessage(event)
      }

      this.elevenLabsWs.onerror = (error) => {
        // Error details are usually in the close event
      }

      this.elevenLabsWs.onclose = (event) => {
        if (!this.isActive) return
        
        // If connection failed during initial connection, reject the promise
        if (event.code !== 1000 && event.code !== 1001) {
          let errorMessage = `Eleven Labs WebSocket connection failed`
          
          if (event.code === 403) {
            errorMessage = `Authentication failed (403). Check your Eleven Labs API key.`
          } else if (event.code === 404) {
            errorMessage = `Voice ID not found (404). Check your ELEVEN_LABS_VOICE_ID.`
          } else if (event.code === 1006) {
            errorMessage = `Connection closed abnormally. Check your API key and voice ID.`
          }
          
          if (event.reason) {
            errorMessage += ` - ${event.reason}`
          }
          
          // Only reject if we haven't resolved yet (initial connection)
          if (this.elevenLabsWs?.readyState !== WebSocket.OPEN) {
            reject(new Error(errorMessage))
          } else {
            console.warn(`Eleven Labs WebSocket closed: ${errorMessage}`)
            // Don't auto-reconnect on auth errors
            if (event.code !== 403 && event.code !== 404) {
              setTimeout(() => {
                if (this.isActive) {
                  this.connectToElevenLabs().catch(err => {
                    console.error('Failed to reconnect to Eleven Labs:', err)
                  })
                }
              }, 2000)
            }
          }
        }
      }
    })
  }

  /**
   * Handle messages from Azure GPT-4o-realtime-preview
   */
  private handleAzureMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'response.audio_transcript.delta':
          // User is speaking - accumulate transcript
          if (data.delta) {
            this.currentTranscript += data.delta
            this.callbacks.onTranscript?.(data.delta)
          }
          break

        case 'response.audio_transcript.done':
          // User finished speaking - send full transcript to chat service
          if (this.currentTranscript.trim()) {
            this.setStatus('processing')
            this.sendMessageToChatService(this.currentTranscript.trim())
            this.currentTranscript = '' // Reset for next message
          }
          break

        case 'response.text.delta':
        case 'response.text.done':
        case 'response.audio.delta':
          // Ignore Azure's direct text/audio responses - we use chatService instead
          break

        case 'error':
          this.callbacks.onError?.(new Error(data.error?.message || 'Azure error'))
          this.setStatus('error')
          break
      }
    } catch (error) {
      console.error('Error parsing Azure message:', error)
    }
  }

  /**
   * Handle messages from Eleven Labs
   */
  private handleElevenLabsMessage(event: MessageEvent) {
    if (event.data instanceof ArrayBuffer) {
      // Audio data received - add to queue and play
      this.audioQueue.push(event.data)
      if (this.status === 'processing') {
        this.setStatus('speaking')
      }
      this.processAudioQueue()
    } else {
      try {
        const data = JSON.parse(event.data)
        if (data.error) {
          this.callbacks.onError?.(new Error(data.error.message || 'Eleven Labs error'))
          this.setStatus('error')
        } else if (data.audio_complete || data.flush) {
          // Audio generation complete - wait for queue to finish
          // Status will be updated when all audio finishes playing
        }
      } catch (error) {
        console.error('Error parsing Eleven Labs message:', error)
      }
    }
  }

  /**
   * Process audio queue sequentially
   */
  private async processAudioQueue() {
    if (this.isPlayingAudio || this.audioQueue.length === 0) return

    this.isPlayingAudio = true
    while (this.audioQueue.length > 0) {
      const audioData = this.audioQueue.shift()!
      await this.playAudio(audioData)
    }
    this.isPlayingAudio = false

    // If queue is empty and we were speaking, return to listening
    if (this.isActive && this.status === 'speaking' && this.audioQueue.length === 0) {
      // Small delay to ensure last audio chunk finishes
      setTimeout(() => {
        if (this.status === 'speaking' && this.audioQueue.length === 0) {
          this.setStatus('listening')
        }
      }, 500)
    }
  }

  /**
   * Send message to Azure WebSocket
   */
  private sendToAzure(message: any) {
    if (this.azureWs?.readyState === WebSocket.OPEN) {
      this.azureWs.send(JSON.stringify(message))
    }
  }

  /**
   * Send message to chat service and stream response to Eleven Labs
   */
  private async sendMessageToChatService(message: string) {
    if (!this.config) return

    try {
      // Cancel any existing chat request
      if (this.chatServiceAbortController) {
        this.chatServiceAbortController.abort()
      }
      this.chatServiceAbortController = new AbortController()

      // Import chat service dynamically
      const { sendChatMessage } = await import('../chat/chatService')

      // Send message to chat service and stream response to Eleven Labs
      await sendChatMessage(
        message,
        this.config.deviceId,
        (chunk: string) => {
          // Stream each chunk to Eleven Labs
          this.sendToElevenLabs(chunk)
        },
        (error: Error) => {
          this.callbacks.onError?.(error)
          this.setStatus('error')
        }
      )

      // Signal end of stream to Eleven Labs
      this.sendToElevenLabs('', true)
      // Status will be updated when audio starts playing
    } catch (error) {
      console.error('Error sending message to chat service:', error)
      this.callbacks.onError?.(error as Error)
      this.setStatus('error')
    }
  }

  /**
   * Send text to Eleven Labs for TTS
   */
  private sendToElevenLabs(text: string, isDone = false) {
    if (this.elevenLabsWs?.readyState === WebSocket.OPEN) {
      if (isDone) {
        // Send final chunk
        this.elevenLabsWs.send(JSON.stringify({ text: '', flush: true }))
        this.setStatus('speaking')
      } else if (text) {
        // Send text chunk
        this.elevenLabsWs.send(JSON.stringify({ text }))
      }
    }
  }

  /**
   * Start sending audio to Azure
   */
  private startSendingAudioToAzure() {
    if (!this.audioContext || !this.mediaStream) return

    const processor = this.audioContext.createScriptProcessor(4096, 1, 1)
    processor.onaudioprocess = (event) => {
      if (!this.isActive || !this.azureWs || this.azureWs.readyState !== WebSocket.OPEN) {
        return
      }

      const inputData = event.inputBuffer.getChannelData(0)
      const pcm16 = this.convertFloat32ToPCM16(inputData)

      // Send audio to Azure
      this.sendToAzure({
        type: 'input_audio_buffer.append',
        audio: btoa(String.fromCharCode(...pcm16)),
      })
    }

    this.microphone?.connect(processor)
    processor.connect(this.audioContext.destination)
  }

  /**
   * Start monitoring audio levels
   */
  private startAudioLevelMonitoring() {
    if (!this.analyser) return

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    this.audioLevelInterval = window.setInterval(() => {
      this.analyser?.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      const level = (average / 255) * 100
      this.callbacks.onAudioLevel?.(level)
    }, 100)
  }

  /**
   * Play audio from Eleven Labs (PCM16 format)
   */
  private async playAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) return Promise.resolve()

    return new Promise((resolve) => {
      try {
        // Eleven Labs returns PCM16 at 16kHz
        const pcm16Data = new Int16Array(audioData)
        const sampleRate = 16000
        const length = pcm16Data.length
        
        // Create audio buffer
        const audioBuffer = this.audioContext!.createBuffer(1, length, sampleRate)
        const channelData = audioBuffer.getChannelData(0)
        
        // Convert PCM16 to Float32
        for (let i = 0; i < length; i++) {
          channelData[i] = pcm16Data[i] / 32768.0
        }
        
        // Play audio
        const source = this.audioContext!.createBufferSource()
        source.buffer = audioBuffer
        source.connect(this.audioContext!.destination)
        
        // When audio finishes, resolve promise and process next in queue
        source.onended = () => {
          resolve()
        }
        
        source.start()
      } catch (error) {
        console.error('Error playing audio:', error)
        resolve() // Resolve anyway to continue queue processing
      }
    })
  }

  /**
   * Convert Float32 audio to PCM16
   */
  private convertFloat32ToPCM16(float32Array: Float32Array): Int16Array {
    const pcm16 = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    return pcm16
  }

  /**
   * Set status and notify callbacks
   */
  private setStatus(status: VoiceServiceStatus) {
    this.status = status
    this.callbacks.onStatusChange?.(status)
  }

  /**
   * Get current status
   */
  getStatus(): VoiceServiceStatus {
    return this.status
  }
}

// Export singleton instance
export const voiceService = new VoiceService()

