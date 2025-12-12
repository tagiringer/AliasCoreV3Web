/**
 * Mock API Interceptor
 *
 * Intercepts API calls and returns mock data when MOCK_AUTH=true.
 * Simulates network delay and API response format.
 *
 * Based on research.md: Mock Data Infrastructure Layer
 */

import { mockDataService } from './mockDataService';
import { logger } from '../logger';
import type { User, DomainProfile, Event } from '../../types/entities';

export interface GoogleAuthResponse {
  token: string;
  user: User;
  isNewUser: boolean;
}

/**
 * Simulate network delay (200-800ms)
 */
const simulateNetworkDelay = async (minMs: number = 200, maxMs: number = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Mock API Interceptor
 */
export class MockApiInterceptor {
  /**
   * Mock Google authentication
   * Returns mock user with JWT token
   */
  static async authenticateWithGoogle(_idToken: string): Promise<GoogleAuthResponse> {
    logger.info('[MOCK] Authenticating with Google');

    // Ensure mock data is initialized
    await mockDataService.initialize();

    // Simulate network delay
    await simulateNetworkDelay(300, 600);

    const mockUser = mockDataService.getMockUser();
    const mockToken = `mock-jwt-token-${Date.now()}`;

    logger.info('[MOCK] Authentication successful', {
      userId: mockUser.id,
      email: mockUser.email,
    });

    return {
      token: mockToken,
      user: mockUser,
      isNewUser: false, // Per clarification: skip onboarding in mock mode
    };
  }

  /**
   * Mock: Get user profile
   */
  static async getUserProfile(userId: string): Promise<User> {
    logger.info('[MOCK] Fetching user profile', { userId });

    await simulateNetworkDelay();
    const mockUser = mockDataService.getMockUser();

    if (mockUser.id !== userId) {
      throw new Error('User not found');
    }

    return mockUser;
  }

  /**
   * Mock: Get user's domain profiles
   */
  static async getUserDomains(userId: string): Promise<DomainProfile[]> {
    logger.info('[MOCK] Fetching user domains', { userId });

    await simulateNetworkDelay(200, 500);
    const mockDomains = mockDataService.getMockDomains();

    return mockDomains.filter((d) => d.userId === userId);
  }

  /**
   * Mock: Get single domain profile
   */
  static async getDomainProfile(domainId: string): Promise<DomainProfile> {
    logger.info('[MOCK] Fetching domain profile', { domainId });

    await simulateNetworkDelay(150, 400);
    const mockDomain = mockDataService.getMockDomain(domainId);

    if (!mockDomain) {
      throw new Error('Domain not found');
    }

    return mockDomain;
  }

  /**
   * Mock: Get events for a domain
   */
  static async getEventsForDomain(domainId: string): Promise<Event[]> {
    logger.info('[MOCK] Fetching events for domain', { domainId });

    await simulateNetworkDelay(300, 700);
    const mockEvents = mockDataService.getMockEvents(domainId);

    return mockEvents;
  }

  /**
   * Mock: Get events near location
   */
  static async getEventsNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 30
  ): Promise<Event[]> {
    logger.info('[MOCK] Fetching events near location', {
      latitude,
      longitude,
      radiusKm,
    });

    await simulateNetworkDelay(400, 900);
    // Return all mock events (filtering by location not implemented in mock)
    return mockDataService.getAllMockEvents();
  }

  /**
   * Mock: Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    logger.info('[MOCK] Updating user profile', { userId, updates });

    await simulateNetworkDelay(200, 500);
    const mockUser = mockDataService.getMockUser();

    // In real implementation, this would update the backend
    // For mock, we just return the current user
    return { ...mockUser, ...updates };
  }
}
