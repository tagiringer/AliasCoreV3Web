/**
 * Unit tests for validation utilities
 * Per spec: Display name must be 3-30 chars, alphanumeric + spaces + . - '
 */

import { validateDisplayName, validateEmail } from '../../src/common/utils/validators';

describe('validateDisplayName', () => {
  describe('valid display names', () => {
    it('should accept 3-character name', () => {
      const result = validateDisplayName('abc');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept 30-character name', () => {
      const result = validateDisplayName('a'.repeat(30));
      expect(result.isValid).toBe(true);
    });

    it('should accept alphanumeric characters', () => {
      const result = validateDisplayName('Player123');
      expect(result.isValid).toBe(true);
    });

    it('should accept spaces', () => {
      const result = validateDisplayName('John Doe');
      expect(result.isValid).toBe(true);
    });

    it('should accept periods', () => {
      const result = validateDisplayName('Dr. Smith');
      expect(result.isValid).toBe(true);
    });

    it('should accept hyphens', () => {
      const result = validateDisplayName('Jean-Luc');
      expect(result.isValid).toBe(true);
    });

    it('should accept apostrophes', () => {
      const result = validateDisplayName("O'Brien");
      expect(result.isValid).toBe(true);
    });

    it('should accept mixed allowed characters', () => {
      const result = validateDisplayName("Dr. O'Connor-Smith 3rd");
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid display names', () => {
    it('should reject empty string', () => {
      const result = validateDisplayName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Display name is required');
    });

    it('should reject names shorter than 3 characters', () => {
      const result = validateDisplayName('ab');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 3 characters');
    });

    it('should reject names longer than 30 characters', () => {
      const result = validateDisplayName('a'.repeat(31));
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('no more than 30 characters');
    });

    it('should reject only spaces', () => {
      const result = validateDisplayName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Display name cannot be only spaces');
    });

    it('should reject special characters not in allowed set', () => {
      const result = validateDisplayName('Player@123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('can only contain');
    });

    it('should reject emojis', () => {
      const result = validateDisplayName('Player 😀');
      expect(result.isValid).toBe(false);
    });

    it('should reject underscores', () => {
      const result = validateDisplayName('Player_123');
      expect(result.isValid).toBe(false);
    });
  });
});

describe('validateEmail', () => {
  it('should accept valid email', () => {
    const result = validateEmail('user@example.com');
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = validateEmail('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid email');
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
  });
});
