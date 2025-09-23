import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = '@guest_device_id';
const GUEST_SESSION_KEY = '@guest_session';

/**
 * Generate a unique device ID for guest users
 */
export const generateDeviceId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  const platform = Platform.OS;
  
  return `${platform}_${timestamp}_${random}`;
};

/**
 * Get or create device ID for guest session
 */
export const getOrCreateDeviceId = async (): Promise<string> => {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = generateDeviceId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Error getting/creating device ID:', error);
    // Fallback to generating a new ID if storage fails
    return generateDeviceId();
  }
};

/**
 * Store guest session data locally
 */
export const storeGuestSession = async (sessionId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(GUEST_SESSION_KEY, sessionId);
  } catch (error) {
    console.error('Error storing guest session:', error);
  }
};

/**
 * Get stored guest session ID
 */
export const getStoredGuestSession = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(GUEST_SESSION_KEY);
  } catch (error) {
    console.error('Error getting stored guest session:', error);
    return null;
  }
};

/**
 * Clear guest session data
 */
export const clearGuestSession = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([GUEST_SESSION_KEY, DEVICE_ID_KEY]);
  } catch (error) {
    console.error('Error clearing guest session:', error);
  }
};

/**
 * Check if user is in guest mode
 */
export const isGuestMode = async (): Promise<boolean> => {
  try {
    const sessionId = await getStoredGuestSession();
    return sessionId !== null;
  } catch (error) {
    console.error('Error checking guest mode:', error);
    return false;
  }
};
