import React, { useState, useEffect, useRef } from 'react'
import { Mic, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface MicrophoneDevice {
    deviceId: string
    label: string
    kind: string
}

interface MicrophoneSelectorProps {
    selectedDeviceId: string | null
    onDeviceChange: (deviceId: string) => void
}

export const MicrophoneSelector: React.FC<MicrophoneSelectorProps> = ({
    selectedDeviceId,
    onDeviceChange,
}) => {
    const [devices, setDevices] = useState<MicrophoneDevice[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadMicrophones()

        // Listen for device changes
        navigator.mediaDevices.addEventListener('devicechange', loadMicrophones)

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', loadMicrophones)
        }
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const loadMicrophones = async () => {
        try {
            setIsLoading(true)

            // Request permission to access microphones
            await navigator.mediaDevices.getUserMedia({ audio: true })

            // Get all audio input devices
            const deviceList = await navigator.mediaDevices.enumerateDevices()
            const audioInputs = deviceList
                .filter(device => device.kind === 'audioinput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
                    kind: device.kind,
                }))

            setDevices(audioInputs)

            // Auto-select first device if none selected
            if (!selectedDeviceId && audioInputs.length > 0) {
                onDeviceChange(audioInputs[0].deviceId)
            }
        } catch (error) {
            console.error('Error loading microphones:', error)
            // Fallback: create a default device entry
            setDevices([{
                deviceId: 'default',
                label: 'Default Microphone',
                kind: 'audioinput',
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const selectedDevice = devices.find(d => d.deviceId === selectedDeviceId) || devices[0]

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 w-full min-w-[200px] justify-between"
                disabled={isLoading}
            >
                <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-foreground/60" />
                    <span className="text-sm truncate max-w-[150px]">
                        {isLoading ? 'Loading...' : selectedDevice?.label || 'Select microphone'}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-foreground/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && !isLoading && devices.length > 0 && (
                <ScrollArea className="absolute left-0 mt-2 border w-full rounded-lg shadow-lg z-50 h-60">
                    <div className="p-4 h-full w-full bg-background">
                        {devices.map((device) => (
                            <button
                                key={device.deviceId}
                                onClick={() => {
                                    onDeviceChange(device.deviceId)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-foreground/5 transition-colors flex items-center gap-2 ${selectedDeviceId === device.deviceId
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-foreground'
                                    }`}
                            >
                                <Mic className="w-4 h-4" />
                                <span className="truncate">{device.label}</span>
                                {selectedDeviceId === device.deviceId && (
                                    <span className="ml-auto text-primary">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {isOpen && devices.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 mt-2 w-full bg-background border border-foreground/10 rounded-lg shadow-lg z-50 p-4">
                    <p className="text-sm text-foreground/60 text-center">
                        No microphones found. Please check your device permissions.
                    </p>
                </div>
            )}
        </div>
    )
}

