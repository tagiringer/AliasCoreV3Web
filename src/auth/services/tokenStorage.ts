/**
 * Token Storage Service
 * Secure wrapper around Expo SecureStore
 * Per constitution: Tokens stored in encrypted keychain/EncryptedSharedPreferences
 */

import * as SecureStore from 'expo-secure-store';
import { logger } from '../../common/services/logger';

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Store auth token securely
 */
export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    logger.debug('Auth token saved to secure storage');
  } catch (error) {
    logger.error('Failed to save auth token', { error });
    throw new Error('Failed to save authentication token');
  }
}

/**
 * Retrieve stored auth token
 */
export async function getToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    logger.error('Failed to retrieve auth token', { error });
    return null;
  }
}

/**
 * Remove stored auth token
 */
export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    logger.debug('Auth token cleared from secure storage');
  } catch (error) {
    logger.error('Failed to clear auth token', { error });
  }
}

/**
 * Check if auth token exists
 */
export async function hasToken(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}
