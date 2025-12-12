/**
 * User Factory
 *
 * Generates deterministic mock user data for frontend development.
 * Based on research.md specifications.
 */

import { SeededRandom } from './seededRandom';
import type { User } from '../../types/entities';

export interface MockUserOptions {
  /** Override user ID */
  id?: string;
  /** Override email */
  email?: string;
  /** Override display name */
  displayName?: string;
  /** Include domains in response */
  domains?: string[];
}

export class UserFactory {
  private rng: SeededRandom;

  constructor(seed?: number) {
    this.rng = seed !== undefined ? new SeededRandom(seed) : new SeededRandom(20250101);
  }

  /**
   * Generate a single mock user
   * Default mock user from research.md:
   * - id: 'mock-user-12345'
   * - email: 'testuser@example.com'
   * - displayName: 'Test User'
   * - domains: []  (will be populated by mockDataService)
   */
  generateUser(options: MockUserOptions = {}): User {
    const now = new Date().toISOString();

    return {
      id: options.id ?? 'mock-user-12345',
      email: options.email ?? 'testuser@example.com',
      displayName: options.displayName ?? 'Test User',
      avatarUrl: null, // Avatar upload not implemented in MVP
      domains: options.domains ?? [],
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Generate a mock user with random display name (for variety in demos)
   */
  generateRandomUser(): User {
    const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey'];
    const lastNames = ['Chen', 'Smith', 'Johnson', 'Garcia', 'Lee', 'Wilson'];

    const firstName = this.rng.pick(firstNames);
    const lastName = this.rng.pick(lastNames);
    const displayName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const id = `mock-user-${this.rng.nextInt(10000, 99999)}`;

    return this.generateUser({
      id,
      email,
      displayName,
    });
  }

  /**
   * Update user domains (called by mockDataService)
   */
  updateUserDomains(user: User, domainIds: string[]): User {
    return {
      ...user,
      domains: domainIds,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Global singleton factory
 */
export const userFactory = new UserFactory();
