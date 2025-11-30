/**
 * Card component
 * Reusable container with consistent styling
 */

import React from 'react';
import { View, StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends ViewProps {
  /**
   * Visual variant
   */
  variant?: CardVariant;

  /**
   * Remove default padding
   */
  noPadding?: boolean;

  /**
   * Custom card style
   */
  style?: ViewStyle;

  /**
   * Card content
   */
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  noPadding = false,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        !noPadding && styles.padding,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  padding: {
    padding: spacing.lg,
  },
  default: {
    backgroundColor: colors.backgroundSecondary,
  },
  elevated: {
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
