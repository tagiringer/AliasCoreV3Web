/**
 * Domain Profile Factory
 *
 * Generates deterministic mock domain profiles (Chess, Valorant, Speedrunning)
 * with realistic gaming stats. Based on research.md specifications.
 */

import { SeededRandom } from './seededRandom';
import type { DomainProfile } from '../../types/entities';

export interface MockDomainProfileOptions {
  /** Override domain ID */
  id?: string;
  /** Override user ID */
  userId?: string;
  /** Specify domain type (chess, valorant, speedrunning) */
  domainType?: 'chess' | 'valorant' | 'speedrunning';
}

export class DomainProfileFactory {
  private rng: SeededRandom;

  constructor(seed?: number) {
    this.rng = seed !== undefined ? new SeededRandom(seed) : new SeededRandom(20250101);
  }

  /**
   * Generate 2-3 mock domain profiles (per clarification)
   * - Chess: 1720 rating / 1850 peak (Expert, 4205 games, Chess.com)
   * - Valorant: 1950 rating / 2100 peak (Diamond 1, 892 games, Riot Games)
   * - Speedrunning: World Record status (156 categories, Speedrun.com)
   */
  generateDefaultProfiles(userId: string): DomainProfile[] {
    return [
      this.generateChessProfile(userId),
      this.generateValorantProfile(userId),
      // Speedrunning profile can be optionally included (2-3 domains per clarification)
      // this.generateSpeedrunningProfile(userId),
    ];
  }

  /**
   * Generate Chess profile
   */
  generateChessProfile(userId: string): DomainProfile {
    return {
      id: 'mock-chess',
      userId,
      domainKey: 'chess',
      domainName: 'Chess',
      domainIcon: 'https://cdn.aliascore.app/icons/chess.png', // Placeholder URL
      primaryPlatform: 'Chess.com',
      platformUsername: 'ChessMaster2000',
      peakRating: 1850,
      currentRating: 1720,
      gamesPlayed: 4205,
      rankTier: 'Expert',
      shareSlug: 'chess-chessmaster2000-mock',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate Valorant profile
   */
  generateValorantProfile(userId: string): DomainProfile {
    return {
      id: 'mock-valorant',
      userId,
      domainKey: 'valorant',
      domainName: 'Valorant',
      domainIcon: 'https://cdn.aliascore.app/icons/valorant.png', // Placeholder URL
      primaryPlatform: 'Riot Games',
      platformUsername: 'AgentPhoenix',
      peakRating: 2100,
      currentRating: 1950,
      gamesPlayed: 892,
      rankTier: 'Diamond 1',
      shareSlug: 'valorant-agentphoenix-mock',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate Speedrunning profile
   */
  generateSpeedrunningProfile(userId: string): DomainProfile {
    return {
      id: 'mock-speedrunning',
      userId,
      domainKey: 'speedrunning',
      domainName: 'Speedrunning',
      domainIcon: 'https://cdn.aliascore.app/icons/speedrunning.png', // Placeholder URL
      primaryPlatform: 'Speedrun.com',
      platformUsername: 'FastRunner99',
      peakRating: null, // No rating system for speedrunning
      currentRating: null,
      gamesPlayed: 156, // Number of categories speedrun
      rankTier: 'World Record', // WR holder status
      shareSlug: 'speedrunning-fastrunner99-mock',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate a random domain profile with realistic stats
   */
  generateRandomProfile(userId: string, domainType?: 'chess' | 'valorant' | 'speedrunning'): DomainProfile {
    const type = domainType ?? this.rng.pick(['chess', 'valorant', 'speedrunning'] as const);

    switch (type) {
      case 'chess':
        return this.generateChessProfile(userId);
      case 'valorant':
        return this.generateValorantProfile(userId);
      case 'speedrunning':
        return this.generateSpeedrunningProfile(userId);
      default:
        return this.generateChessProfile(userId);
    }
  }

  /**
   * Generate N random profiles
   */
  generateProfiles(userId: string, count: number): DomainProfile[] {
    const profiles: DomainProfile[] = [];
    const types: ('chess' | 'valorant' | 'speedrunning')[] = ['chess', 'valorant', 'speedrunning'];

    for (let i = 0; i < Math.min(count, types.length); i++) {
      profiles.push(this.generateRandomProfile(userId, types[i]));
    }

    return profiles;
  }
}

/**
 * Global singleton factory
 */
export const domainProfileFactory = new DomainProfileFactory();
