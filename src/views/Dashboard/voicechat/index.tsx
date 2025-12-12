import React, { useState, useEffect } from 'react'
import { AnimatedBlob, MicrophoneSelector } from './components'
import { useVoiceService } from './hooks/useVoiceService'

export function VoiceChat() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const { status, audioLevel, isInitialized, start, stop, isSpeaking } = useVoiceService(selectedDeviceId)

  // Auto-start when component mounts and service is initialized
  useEffect(() => {
    if (isInitialized) {
      start()
    }
    return () => {
      stop()
    }
  }, [isInitialized, start, stop])

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId)
  }

  return (
    <>
      <div className="flex relative pb-4 z-10 pt-4 flex-col h-full gap-2 items-center justify-center overflow-hidden">
        {/* Microphone Selector - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <MicrophoneSelector
            selectedDeviceId={selectedDeviceId}
            onDeviceChange={handleDeviceChange}
          />
        </div>
        <AnimatedBlob isSpeaking={isSpeaking} audioLevel={audioLevel} />
      </div>
    </>
  )
}
