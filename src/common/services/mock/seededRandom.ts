/**
 * Seeded Random Number Generator
 *
 * Linear Congruential Generator (LCG) for deterministic pseudo-random numbers.
 * Ensures consistent mock data across app restarts and devices.
 *
 * Based on research.md: Deterministic Mock Data Factory with Seeded Random Generation
 */

export class SeededRandom {
  private seed: number;
  private readonly a = 1664525; // Multiplier
  private readonly c = 1013904223; // Increment
  private readonly m = 2 ** 32; // Modulus

  constructor(seed: number = 20250101) {
    this.seed = seed;
  }

  /**
   * Generate next random number (0 to 1)
   */
  next(): number {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed / this.m;
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generate random float between min and max
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Reset seed to initial value
   */
  reset(newSeed?: number): void {
    this.seed = newSeed ?? 20250101;
  }

  /**
   * Create a new SeededRandom instance with a derived seed
   * Useful for creating domain-specific generators
   */
  derive(key: string): SeededRandom {
    // Simple string hash to seed
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return new SeededRandom(Math.abs(hash));
  }
}

/**
 * Global singleton instance with fixed seed
 */
export const globalRandom = new SeededRandom(20250101);
