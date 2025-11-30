/**
 * Typography scale for AliasCore Mobile
 * Minimum 16pt body text per constitution (accessibility requirement)
 */

import { Platform } from 'react-native';

/**
 * Font families
 * Using system fonts for cross-platform consistency
 */
export const fontFamilies = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
} as const;

/**
 * Font weights
 */
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Font sizes (in points)
 * All body text is >= 16pt per constitutional requirement
 */
export const fontSizes = {
  // Display text (large headers)
  displayLarge: 48,
  displayMedium: 40,
  displaySmall: 32,

  // Headings
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,

  // Body text (minimum 16pt)
  bodyLarge: 18,
  body: 16, // Default body text
  bodySmall: 16, // Never go below 16pt per constitution

  // UI elements
  button: 16,
  caption: 14, // Only for non-critical UI labels
  label: 16,
} as const;

/**
 * Line heights
 * Calculated as multipliers of font size
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2.0,
} as const;

/**
 * Letter spacing (tracking)
 */
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
} as const;

/**
 * Typography presets
 * Pre-configured text styles for common use cases
 */
export const typography = {
  displayLarge: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.displayLarge,
    lineHeight: fontSizes.displayLarge * lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },
  displayMedium: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.displayMedium,
    lineHeight: fontSizes.displayMedium * lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },
  displaySmall: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.displaySmall,
    lineHeight: fontSizes.displaySmall * lineHeights.normal,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.normal,
  },
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.h1,
    lineHeight: fontSizes.h1 * lineHeights.normal,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.normal,
  },
  h2: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.h2,
    lineHeight: fontSizes.h2 * lineHeights.normal,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.h3,
    lineHeight: fontSizes.h3 * lineHeights.normal,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.h4,
    lineHeight: fontSizes.h4 * lineHeights.normal,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.normal,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodyLarge,
    lineHeight: fontSizes.bodyLarge * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodySmall,
    lineHeight: fontSizes.bodySmall * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  button: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.button,
    lineHeight: fontSizes.button * lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: fontSizes.caption * lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.label,
    lineHeight: fontSizes.label * lineHeights.tight,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.normal,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
