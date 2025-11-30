/**
 * Utility functions for formatting data
 * Per specification: Rating formatting, display name validation
 */

/**
 * Format a rating number for display
 * Examples:
 *   1500 → "1500"
 *   1567.89 → "1568"
 *   null → "Unrated"
 */
export function formatRating(rating: number | null): string {
  if (rating === null || rating === undefined) {
    return 'Unrated';
  }

  return Math.round(rating).toString();
}

/**
 * Format a number with commas for thousands
 * Examples:
 *   1000 → "1,000"
 *   1234567 → "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format games played count
 * Examples:
 *   0 → "No games"
 *   1 → "1 game"
 *   100 → "100 games"
 *   1500 → "1,500 games"
 */
export function formatGamesPlayed(count: number | null): string {
  if (count === null || count === undefined || count === 0) {
    return 'No games';
  }

  if (count === 1) {
    return '1 game';
  }

  return `${formatNumber(count)} games`;
}

/**
 * Format a date/time string for display
 * Examples:
 *   "2025-11-30T10:00:00Z" → "Nov 30, 2025"
 *   "2025-12-25T18:30:00Z" → "Dec 25, 2025"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date/time string with time
 * Examples:
 *   "2025-11-30T10:00:00Z" → "Nov 30, 2025 at 10:00 AM"
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${dateStr} at ${timeStr}`;
}

/**
 * Format distance in miles
 * Examples:
 *   0.5 → "0.5 mi"
 *   1.0 → "1.0 mi"
 *   12.34 → "12.3 mi"
 */
export function formatDistance(miles: number): string {
  return `${miles.toFixed(1)} mi`;
}

/**
 * Truncate text to a maximum length with ellipsis
 * Examples:
 *   ("Hello World", 5) → "Hello..."
 *   ("Short", 10) → "Short"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
}

/**
 * Capitalize first letter of string
 * Examples:
 *   "hello" → "Hello"
 *   "WORLD" → "WORLD"
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
