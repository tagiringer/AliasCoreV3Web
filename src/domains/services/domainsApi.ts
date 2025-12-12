/**
 * Domains API Service
 * Handles fetching user's gaming domain profiles
 */

import Constants from 'expo-constants';
import { apiClient } from '../../common/services/apiClient';
import { MockApiInterceptor } from '../../common/services/mock';
import { logger } from '../../common/services/logger';
import type { DomainProfile } from '../../common/types/entities';

/**
 * Check if mock auth is enabled
 */
const isMockAuthEnabled = (): boolean => {
  return Constants.expoConfig?.extra?.mockAuth === true;
};

/**
 * Get all domain profiles for the current user
 * GET /api/domains
 */
export async function getUserDomains(): Promise<DomainProfile[]> {
  try {
    logger.debug('Fetching user domains');

    // Use mock interceptor if mock auth is enabled
    if (isMockAuthEnabled()) {
      const mockDomains = await MockApiInterceptor.getUserDomains('mock-user-12345');
      logger.info('[MOCK] Fetched user domains', { count: mockDomains.length });
      return mockDomains;
    }

    const response = await apiClient.get<{ domains: DomainProfile[] }>('/api/domains');

    logger.info('Fetched user domains', { count: response.domains.length });
    return response.domains;
  } catch (error) {
    logger.error('Failed to fetch user domains', { error });
    throw error;
  }
}

/**
 * Get a single domain profile by ID
 * GET /api/domains/:domainId
 */
export async function getDomainProfile(domainId: string): Promise<DomainProfile> {
  try {
    logger.debug('Fetching domain profile', { domainId });

    // Use mock interceptor if mock auth is enabled
    if (isMockAuthEnabled()) {
      const mockDomain = await MockApiInterceptor.getDomainProfile(domainId);
      logger.info('[MOCK] Fetched domain profile', { domainId });
      return mockDomain;
    }

    const response = await apiClient.get<{ domain: DomainProfile }>(`/api/domains/${domainId}`);

    logger.info('Fetched domain profile', { domainId });
    return response.domain;
  } catch (error) {
    logger.error('Failed to fetch domain profile', { error });
    throw error;
  }
}
