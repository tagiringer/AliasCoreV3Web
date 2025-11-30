/**
 * API Client
 * Handles all HTTP requests with auth token injection
 * Per constitution: No hardcoded URLs, tokens excluded from logs
 */

import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import type { ApiError } from '../types/api';
import { logger } from './logger';

/**
 * Base API URL from environment configuration
 */
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.aliascore.example.com';

/**
 * Secure storage key for auth token
 */
const AUTH_TOKEN_KEY = 'auth_token';

/**
 * API Client class
 * Singleton pattern for centralized HTTP communication
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get stored auth token from secure storage
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      logger.error('Failed to retrieve auth token', { error });
      return null;
    }
  }

  /**
   * Store auth token in secure storage
   */
  async setAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      logger.info('Auth token stored');
    } catch (error) {
      logger.error('Failed to store auth token', { error });
      throw error;
    }
  }

  /**
   * Remove auth token from secure storage
   */
  async clearAuthToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      logger.info('Auth token cleared');
    } catch (error) {
      logger.error('Failed to clear auth token', { error });
    }
  }

  /**
   * Make an authenticated API request
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const url = `${this.baseUrl}${endpoint}`;

    try {
      logger.debug('API request', {
        method: options.method || 'GET',
        endpoint,
        // DO NOT log headers (contains auth token)
      });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: {
            code: 'UNKNOWN_ERROR',
            message: response.statusText,
          },
        }));

        logger.error('API request failed', {
          status: response.status,
          endpoint,
          errorCode: errorData.error.code,
          // DO NOT log full error details (may contain sensitive data)
        });

        throw new ApiClientError(
          errorData.error.message,
          response.status,
          errorData.error.code
        );
      }

      const data: T = await response.json();

      logger.debug('API request successful', {
        endpoint,
        status: response.status,
      });

      return data;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      logger.error('Network error', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new ApiClientError(
        'Network request failed. Please check your connection.',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Singleton instance
 */
export const apiClient = new ApiClient();
