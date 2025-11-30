/**
 * Validation utility functions
 * Per specification: Display name must be 3-30 chars, alphanumeric + spaces + . - '
 */

/**
 * Display name validation rules (from spec clarification)
 * - 3-30 characters
 * - Alphanumeric characters (a-z, A-Z, 0-9)
 * - Spaces allowed
 * - Special characters allowed: . - '
 */

const DISPLAY_NAME_REGEX = /^[a-zA-Z0-9\s.\-']{3,30}$/;
const MIN_DISPLAY_NAME_LENGTH = 3;
const MAX_DISPLAY_NAME_LENGTH = 30;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate display name
 * Returns validation result with error message if invalid
 */
export function validateDisplayName(displayName: string): ValidationResult {
  // Check if empty
  if (!displayName || displayName.trim().length === 0) {
    return {
      isValid: false,
      error: 'Display name is required',
    };
  }

  // Check minimum length
  if (displayName.length < MIN_DISPLAY_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Display name must be at least ${MIN_DISPLAY_NAME_LENGTH} characters`,
    };
  }

  // Check maximum length
  if (displayName.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Display name must be no more than ${MAX_DISPLAY_NAME_LENGTH} characters`,
    };
  }

  // Check allowed characters
  if (!DISPLAY_NAME_REGEX.test(displayName)) {
    return {
      isValid: false,
      error: 'Display name can only contain letters, numbers, spaces, and . - \' characters',
    };
  }

  // Check for only spaces
  if (displayName.trim().length === 0) {
    return {
      isValid: false,
      error: 'Display name cannot be only spaces',
    };
  }

  return { isValid: true };
}

/**
 * Validate email format (basic validation)
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL',
    };
  }
}

/**
 * Check if domain count is within limit (max 10 per spec)
 */
export function isWithinDomainLimit(currentCount: number): boolean {
  const MAX_DOMAINS = 10;
  return currentCount < MAX_DOMAINS;
}
