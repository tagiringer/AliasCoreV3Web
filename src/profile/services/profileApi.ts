/**
 * Profile API Service
 * Handles profile update endpoints
 */

import { apiClient } from '../../common/services/apiClient';
import { logger } from '../../common/services/logger';
import type { User } from '../../common/types/entities';
import type { ProfileUpdateRequest, ProfileUpdateResponse } from '../types';

/**
 * Update user profile
 * PUT /api/profile
 */
export async function updateProfile(updates: ProfileUpdateRequest): Promise<User> {
  try {
    logger.info('Updating user profile');

    const response = await apiClient.put<ProfileUpdateResponse>('/api/profile', updates);

    logger.critical('profile_updated', {
      userId: response.user.id,
    });

    return response.user;
  } catch (error) {
    logger.error('Profile update failed', { error });
    throw error;
  }
}
