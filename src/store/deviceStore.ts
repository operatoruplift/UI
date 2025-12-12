import { create } from 'zustand';
import { Device, getUserDevices, updateDevice, deleteDevice } from '@/services/dashboard/devices/deviceService';

interface DeviceState {
  devices: Device[];
  currentDevice: Device | null;
  isLoading: boolean;
  error: string | null;
  fetchDevices: () => Promise<void>;
  updateDevice: (deviceId: string, updates: { name?: string; is_active?: boolean; metadata?: Record<string, any> }) => Promise<void>;
  removeDevice: (deviceId: string) => Promise<void>;
  setCurrentDevice: (device: Device | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  currentDevice: null,
  isLoading: false,
  error: null,

  fetchDevices: async () => {
    try {
      set({ isLoading: true, error: null });
      const devices = await getUserDevices();
      
      // Find current device by matching device_id from localStorage
      const currentDeviceId = localStorage.getItem('aven_device_id');
      const current = devices.find(d => d.device_id === currentDeviceId) || null;
      
      set({ devices, currentDevice: current, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching devices:', error);
      set({ error: error?.message || 'Failed to fetch devices', isLoading: false });
    }
  },

  updateDevice: async (deviceId: string, updates: { name?: string; is_active?: boolean; metadata?: Record<string, any> }) => {
    try {
      set({ isLoading: true, error: null });
      const updatedDevice = await updateDevice(deviceId, updates);
      
      set((state) => ({
        devices: state.devices.map(d => d.id === deviceId ? updatedDevice : d),
        currentDevice: state.currentDevice?.id === deviceId ? updatedDevice : state.currentDevice,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error updating device:', error);
      set({ error: error?.message || 'Failed to update device', isLoading: false });
      throw error;
    }
  },

  removeDevice: async (deviceId: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteDevice(deviceId);
      
      set((state) => ({
        devices: state.devices.filter(d => d.id !== deviceId),
        currentDevice: state.currentDevice?.id === deviceId ? null : state.currentDevice,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error removing device:', error);
      set({ error: error?.message || 'Failed to remove device', isLoading: false });
      throw error;
    }
  },

  setCurrentDevice: (device: Device | null) => set({ currentDevice: device }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),
}));

