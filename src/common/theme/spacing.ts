/**
 * Spacing constants for AliasCore Mobile
 * Based on 4pt grid system for consistency
 * Minimum 44×44pt touch targets per constitution (accessibility requirement)
 */

/**
 * Base spacing unit (4pt)
 * All spacing should be multiples of this value
 */
export const SPACING_UNIT = 4;

/**
 * Spacing scale
 * Values are in points (pt)
 */
export const spacing = {
  xs: SPACING_UNIT, // 4pt
  sm: SPACING_UNIT * 2, // 8pt
  md: SPACING_UNIT * 3, // 12pt
  lg: SPACING_UNIT * 4, // 16pt
  xl: SPACING_UNIT * 5, // 20pt
  '2xl': SPACING_UNIT * 6, // 24pt
  '3xl': SPACING_UNIT * 8, // 32pt
  '4xl': SPACING_UNIT * 10, // 40pt
  '5xl': SPACING_UNIT * 12, // 48pt
  '6xl': SPACING_UNIT * 16, // 64pt
} as const;

/**
 * Touch target sizes
 * Minimum 44×44pt per constitution (WCAG accessibility)
 */
export const touchTargets = {
  minimum: 44, // Minimum touch target size (44×44pt)
  small: 48, // Small buttons
  medium: 56, // Medium buttons (default)
  large: 64, // Large buttons
} as const;

/**
 * Border radius values
 */
export const borderRadius = {
  none: 0,
  xs: SPACING_UNIT / 2, // 2pt
  sm: SPACING_UNIT, // 4pt
  md: SPACING_UNIT * 2, // 8pt
  lg: SPACING_UNIT * 3, // 12pt
  xl: SPACING_UNIT * 4, // 16pt
  '2xl': SPACING_UNIT * 6, // 24pt
  full: 9999, // Pill shape / circle
} as const;

/**
 * Border widths
 */
export const borderWidths = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 4,
} as const;

/**
 * Shadow definitions
 * Platform-specific shadow styles
 */
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Android
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

/**
 * Z-index layering
 * Ensures consistent stacking order
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
} as const;

export type Spacing = keyof typeof spacing;
export type TouchTarget = keyof typeof touchTargets;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
