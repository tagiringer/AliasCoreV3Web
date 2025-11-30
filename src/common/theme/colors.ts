/**
 * Color palette for AliasCore Mobile
 * WCAG AA compliant contrast ratios per constitution
 */

export const colors = {
  // Primary colors
  primary: '#6C63FF', // Primary brand color (purple)
  primaryDark: '#5248CC', // Darker variant for pressed states
  primaryLight: '#8E87FF', // Lighter variant for backgrounds

  // Secondary colors
  secondary: '#FFD700', // Gold accent color
  secondaryDark: '#CCB000',
  secondaryLight: '#FFEB99',

  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray900: '#1A1A1A', // Near black
  gray800: '#333333',
  gray700: '#4D4D4D',
  gray600: '#666666',
  gray500: '#808080',
  gray400: '#999999',
  gray300: '#B3B3B3',
  gray200: '#CCCCCC',
  gray100: '#E6E6E6',
  gray50: '#F5F5F5', // Near white

  // Semantic colors
  success: '#10B981', // Green
  successLight: '#D1FAE5',
  error: '#EF4444', // Red
  errorLight: '#FEE2E2',
  warning: '#F59E0B', // Orange
  warningLight: '#FEF3C7',
  info: '#3B82F6', // Blue
  infoLight: '#DBEAFE',

  // Surface colors
  background: '#FFFFFF', // Main app background
  backgroundSecondary: '#F5F5F5', // Secondary background (cards, etc.)
  surface: '#FFFFFF', // Card/modal surfaces
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays

  // Border colors
  border: '#E6E6E6',
  borderDark: '#CCCCCC',

  // Text colors (WCAG AA compliant on white backgrounds)
  textPrimary: '#1A1A1A', // Main text (contrast ratio: 16.1:1)
  textSecondary: '#4D4D4D', // Secondary text (contrast ratio: 9.7:1)
  textTertiary: '#666666', // Tertiary text (contrast ratio: 5.7:1)
  textInverse: '#FFFFFF', // Text on dark backgrounds
  textDisabled: '#999999', // Disabled text

  // Domain-specific colors (for domain cards)
  domainChess: '#2C5E1A',
  domainValorant: '#FA4454',
  domainLeague: '#C89B3C',
  domainCS: '#F5B800',
  domainSpeedrun: '#00A3E0',
} as const;

/**
 * Dark mode palette (for future implementation)
 * Not used in MVP but included for structure
 */
export const darkColors = {
  ...colors,
  background: '#000000',
  backgroundSecondary: '#1A1A1A',
  surface: '#1A1A1A',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#999999',
  border: '#333333',
  borderDark: '#4D4D4D',
} as const;

export type ColorName = keyof typeof colors;
