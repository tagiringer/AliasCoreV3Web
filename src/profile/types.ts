/**
 * Profile types
 */

import type { User } from '../common/types/entities';

/**
 * Profile update request
 */
export interface ProfileUpdateRequest {
  displayName?: string;
  avatarUrl?: string | null;
}

/**
 * Profile update response
 */
export interface ProfileUpdateResponse {
  user: User;
}
