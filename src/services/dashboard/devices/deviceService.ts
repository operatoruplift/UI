import { withAuth } from '@/store/authStore';

export interface Device {
  id: string;
  user_id: string;
  device_id: string;
  name: string | null;
  platform: string | null;
  app_version: string | null;
  is_active: boolean;
  relay_status: string;
  last_seen_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceData {
  device_id: string;
  name?: string;
  platform?: string;
  user_id: string;
  app_version?: string;
  metadata?: Record<string, any>;
}

export interface UpdateDeviceData {
  name?: string;
  is_active?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Get or create a device for the current user.
 * If it doesn't exist, creates it automatically.
 */
export const getOrCreateDevice = async (deviceData: CreateDeviceData): Promise<Device> => {
// Try to fetch existing device
  const { data: existingDevice, error: fetchError } = await withAuth(async (supabase, token) =>
    supabase
    .from('devices')
    .select('*')
    .eq('device_id', deviceData.device_id)
    .single()
  );

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching device:', fetchError);
    throw fetchError;
  }

  // If found, update and return
  if (existingDevice) {
    const updateData: any = {
      last_seen_at: new Date().toISOString(),
      relay_status: 'online',
    };

    if (!existingDevice.platform && deviceData.platform) updateData.platform = deviceData.platform;
    if (!existingDevice.app_version && deviceData.app_version) updateData.app_version = deviceData.app_version;
    if (!existingDevice.name && deviceData.name) updateData.name = deviceData.name;

    const { data, error } = await withAuth(async (supabase, token) =>
      supabase
      .from('devices')
      .update(updateData)
      .eq('id', existingDevice.id)
      .select()
      .single()
    );

    if (error) throw error;
    return data || existingDevice;
  }
  // Create new device
  const { data: newDevice, error: createError } = await withAuth(async (supabase, token) =>
    supabase
    .from('devices')
    .insert({
      device_id: deviceData.device_id,
      name: deviceData.name || null,
      platform: deviceData.platform || null,
      app_version: deviceData.app_version || null,
      metadata: deviceData.metadata || {},
      user_id: deviceData.user_id,
      relay_status: 'online',
      last_seen_at: new Date().toISOString(),
    })
    .select()
    .single()
  );

  if (createError) throw createError;
  if (!newDevice) throw new Error('Failed to create device');

  return newDevice;
};

/**
 * Get all devices for the current user
 */
export const getUserDevices = async (): Promise<Device[]> => {
  const { data, error } = await withAuth(async (supabase, token) =>
    supabase
    .from('devices')
    .select('*')
    .order('last_seen_at', { ascending: false })
  );

  if (error) throw error;
  return data || [];
};

/**
 * Update a device
 */
export const updateDevice = async (deviceId: string, updates: UpdateDeviceData): Promise<Device> => {
    const { data, error } = await withAuth(async (supabase, token) =>
    supabase
    .from('devices')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deviceId)
    .select()
    .single()
  );

  if (error) throw error;
  if (!data) throw new Error('Device not found');

  return data;
};

/**
 * Delete a device
 */
export const deleteDevice = async (deviceId: string): Promise<void> => {
  const { error } = await withAuth(async (supabase, token) =>
    supabase
    .from('devices')
    .delete()
    .eq('id', deviceId)
  );

  if (error) throw error;
};

/**
 * Get or throw device ID from localStorage
 */
export const getOrCreateDeviceId = (): string => {
  const STORAGE_KEY = 'uplift_device_id';
  var deviceId = localStorage.getItem(STORAGE_KEY);
  if (!deviceId) {
    // Generate a unique device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  return deviceId;
};
