/**
 * useAuthToken hook
 * Handles token refresh and validation logic
 */

import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { logger } from '../../common/services/logger';

/**
 * Hook to handle automatic token refresh
 * In MVP, we rely on backend to handle token expiration
 * This hook provides a place for future token refresh logic
 */
export const useAuthToken = () => {
  const { isAuthenticated, refreshUser, signOut } = useAuth();

  /**
   * Validate token periodically
   * If token is invalid, sign out user
   */
  const validateToken = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await refreshUser();
    } catch (error) {
      logger.warn('Token validation failed, signing out', { error });
      await signOut();
    }
  }, [isAuthenticated, refreshUser, signOut]);

  /**
   * Set up periodic token validation
   * Check every 5 minutes if user is still authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial validation
    validateToken();

    // Periodic validation
    const interval = setInterval(() => {
      validateToken();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, validateToken]);

  return {
    validateToken,
  };
};
