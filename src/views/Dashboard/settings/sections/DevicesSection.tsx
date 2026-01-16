import React, { useState, useEffect } from 'react'
import { Laptop, Smartphone, Monitor, Edit2, Trash2, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDeviceStore } from '@/store/deviceStore'
import { useAuthStore } from '@/store/authStore'
import { Device } from '@/services/dashboard/devices/deviceService'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const getDeviceIcon = (platform: string | null) => {
  if (!platform) return <Monitor size={24} />
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('windows') || platformLower.includes('linux')) {
    return <Monitor size={24} />
  }
  if (platformLower.includes('mac')) {
    return <Laptop size={24} />
  }
  return <Smartphone size={24} />
}

const formatLastSeen = (dateString: string | null): string => {
  if (!dateString) return 'Never'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  
  return date.toLocaleDateString()
}

interface EditDeviceFormData {
  name: string
  is_active: boolean
}

const EditDeviceDialog: React.FC<{
  device: Device | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updates: { name?: string; is_active?: boolean }) => Promise<void>
  isLoading: boolean
}> = ({ device, open, onOpenChange, onSave, isLoading }) => {
  const [formData, setFormData] = useState<EditDeviceFormData>({
    name: '',
    is_active: true,
  })

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || '',
        is_active: device.is_active ?? true,
      })
    }
  }, [device])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave({
        name: formData.name.trim() || undefined,
        is_active: formData.is_active,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update device:', error)
    }
  }

  if (!device) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
          <DialogDescription>
            Update device information and settings
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Device Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter device name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Power size={16} />
                Device Status
              </label>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                <span className="text-sm text-foreground/70 flex-1">
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_active ? 'bg-primary' : 'bg-foreground/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-foreground/50">
                Inactive devices will not receive notifications or updates
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Device Information
              </label>
              <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Platform:</span>
                  <span className="text-foreground">{device.platform || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">App Version:</span>
                  <span className="text-foreground">{device.app_version || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Device ID:</span>
                  <span className="text-foreground font-mono text-xs">{device.device_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Last Seen:</span>
                  <span className="text-foreground">{formatLastSeen(device.last_seen_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Relay Status:</span>
                  <span className="text-foreground capitalize">{device.relay_status || 'offline'}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DevicesSection: React.FC = () => {
  const { devices, currentDevice, isLoading, error, fetchDevices, updateDevice, removeDevice } = useDeviceStore()
  const { isAuthenticated } = useAuthStore()
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchDevices()
    }
  }, [isAuthenticated, fetchDevices])

  const handleSaveEdit = async (updates: { name?: string; is_active?: boolean }) => {
    if (!editingDevice) return
    try {
      await updateDevice(editingDevice.id, updates)
      setEditingDevice(null)
    } catch (error) {
      console.error('Failed to update device:', error)
      throw error
    }
  }

  const handleDelete = async (deviceId: string) => {
    try {
      await removeDevice(deviceId)
      setShowDeleteDialog(null)
    } catch (error) {
      console.error('Failed to delete device:', error)
    }
  }

  const currentDeviceId = typeof window !== 'undefined' ? localStorage.getItem('uplift_device_id') : null

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground/60">Please sign in to view your devices</p>
      </div>
    )
  }

  if (isLoading && devices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground/60">Loading devices...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto flex flex-col h-full">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {devices.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-foreground/60">No devices found</p>
        </div>
      ) : (
        devices.map(device => {
          const isCurrent = device.device_id === currentDeviceId

          return (
            <div key={device.id} className="flex items-center justify-between p-5 rounded-lg bg-foreground/5">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-lg bg-foreground/5 flex items-center justify-center text-2xl">
                  {getDeviceIcon(device.platform)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{device.name || 'Unnamed Device'}</p>
                    {isCurrent && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-medium">
                        Current
                      </span>
                    )}
                    {device.is_active === false && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-foreground/10 text-foreground/60 font-medium">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60">
                    {device.platform || 'Unknown Platform'} • {formatLastSeen(device.last_seen_at)}
                    {device.app_version && ` • v${device.app_version}`}
                  </p>
                  {device.relay_status && (
                    <p className="text-xs text-foreground/50 mt-1">
                      Status: {device.relay_status}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteDialog(device.id)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remove
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDevice(device)}
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )
        })
      )}

      {/* Edit Device Dialog */}
      <EditDeviceDialog
        device={editingDevice}
        open={editingDevice !== null}
        onOpenChange={(open) => !open && setEditingDevice(null)}
        onSave={handleSaveEdit}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this device? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}
              disabled={isLoading}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
