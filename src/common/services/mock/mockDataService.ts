/**
 * Mock Data Service (Singleton)
 *
 * Central service for managing mock data across the application.
 * Initializes and caches user, domain profiles, and events.
 * Persists data across app restarts using AsyncStorage.
 *
 * Based on research.md: Deterministic Mock Data Factory with Seeded Random Generation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { userFactory } from './userFactory';
import { domainProfileFactory } from './domainProfileFactory';
import { eventFactory } from './eventFactory';
import { logger } from '../logger';
import type { User, DomainProfile, Event } from '../../types/entities';

const STORAGE_KEYS = {
  MOCK_USER: '@mock:user',
  MOCK_DOMAINS: '@mock:domains',
  MOCK_EVENTS: '@mock:events',
} as const;

export class MockDataService {
  private static instance: MockDataService | null = null;
  private initialized: boolean = false;

  private mockUser: User | null = null;
  private mockDomains: DomainProfile[] = [];
  private mockEvents: Map<string, Event[]> = new Map();

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  /**
   * Initialize mock data (load from storage or generate)
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      logger.debug('Mock data service already initialized');
      return;
    }

    try {
      // Try to load existing data from storage
      const hasExistingData = await this.loadFromStorage();

      if (!hasExistingData) {
        // Generate new mock data
        await this.generateMockData();
        // Save to storage
        await this.saveToStorage();
      }

      this.initialized = true;
      logger.info('Mock data service initialized', {
        userId: this.mockUser?.id,
        domainCount: this.mockDomains.length,
        eventCount: Array.from(this.mockEvents.values()).flat().length,
      });
    } catch (error) {
      logger.error('Failed to initialize mock data service', { error });
      throw new Error('Mock data service initialization failed');
    }
  }

  /**
   * Generate fresh mock data
   */
  private async generateMockData(): Promise<void> {
    // Generate mock user (fixed ID per research.md)
    this.mockUser = userFactory.generateUser();

    // Generate 2-3 mock domain profiles (per clarification)
    this.mockDomains = domainProfileFactory.generateDefaultProfiles(this.mockUser.id);

    // Update user with domain IDs
    const domainIds = this.mockDomains.map((d) => d.id);
    this.mockUser = userFactory.updateUserDomains(this.mockUser, domainIds);

    // Generate 5-10 events per domain (per clarification)
    this.mockEvents.clear();
    for (const domain of this.mockDomains) {
      const events = eventFactory.generateEventsForDomain(domain.id, 8);
      this.mockEvents.set(domain.id, events);
    }

    logger.debug('Generated new mock data', {
      domains: this.mockDomains.length,
      totalEvents: Array.from(this.mockEvents.values()).flat().length,
    });
  }

  /**
   * Load mock data from AsyncStorage
   */
  private async loadFromStorage(): Promise<boolean> {
    try {
      const [userJson, domainsJson, eventsJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.MOCK_USER),
        AsyncStorage.getItem(STORAGE_KEYS.MOCK_DOMAINS),
        AsyncStorage.getItem(STORAGE_KEYS.MOCK_EVENTS),
      ]);

      if (userJson && domainsJson && eventsJson) {
        this.mockUser = JSON.parse(userJson);
        this.mockDomains = JSON.parse(domainsJson);
        const eventsArray = JSON.parse(eventsJson) as Array<{ domainId: string; events: Event[] }>;

        this.mockEvents.clear();
        for (const { domainId, events } of eventsArray) {
          this.mockEvents.set(domainId, events);
        }

        logger.debug('Loaded mock data from storage');
        return true;
      }

      return false;
    } catch (error) {
      logger.warn('Failed to load mock data from storage', { error });
      return false;
    }
  }

  /**
   * Save mock data to AsyncStorage
   */
  private async saveToStorage(): Promise<void> {
    try {
      const eventsArray = Array.from(this.mockEvents.entries()).map(([domainId, events]) => ({
        domainId,
        events,
      }));

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.MOCK_USER, JSON.stringify(this.mockUser)),
        AsyncStorage.setItem(STORAGE_KEYS.MOCK_DOMAINS, JSON.stringify(this.mockDomains)),
        AsyncStorage.setItem(STORAGE_KEYS.MOCK_EVENTS, JSON.stringify(eventsArray)),
      ]);

      logger.debug('Saved mock data to storage');
    } catch (error) {
      logger.error('Failed to save mock data to storage', { error });
    }
  }

  /**
   * Get mock user
   */
  getMockUser(): User {
    if (!this.mockUser) {
      throw new Error('Mock data service not initialized. Call initialize() first.');
    }
    return this.mockUser;
  }

  /**
   * Get all mock domain profiles
   */
  getMockDomains(): DomainProfile[] {
    if (!this.initialized) {
      throw new Error('Mock data service not initialized. Call initialize() first.');
    }
    return this.mockDomains;
  }

  /**
   * Get mock domain profile by ID
   */
  getMockDomain(domainId: string): DomainProfile | null {
    return this.mockDomains.find((d) => d.id === domainId) ?? null;
  }

  /**
   * Get mock events for a domain
   */
  getMockEvents(domainId: string): Event[] {
    return this.mockEvents.get(domainId) ?? [];
  }

  /**
   * Get all mock events (across all domains)
   */
  getAllMockEvents(): Event[] {
    return Array.from(this.mockEvents.values()).flat();
  }

  /**
   * Clear all mock data (logout)
   */
  async clear(): Promise<void> {
    this.mockUser = null;
    this.mockDomains = [];
    this.mockEvents.clear();
    this.initialized = false;

    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.MOCK_USER),
        AsyncStorage.removeItem(STORAGE_KEYS.MOCK_DOMAINS),
        AsyncStorage.removeItem(STORAGE_KEYS.MOCK_EVENTS),
      ]);
      logger.debug('Cleared mock data from storage');
    } catch (error) {
      logger.error('Failed to clear mock data from storage', { error });
    }
  }

  /**
   * Reset to initial state (regenerate data)
   */
  async reset(): Promise<void> {
    await this.clear();
    await this.generateMockData();
    await this.saveToStorage();
    this.initialized = true;
    logger.info('Mock data service reset');
  }
}

/**
 * Global singleton instance
 */
export const mockDataService = MockDataService.getInstance();
