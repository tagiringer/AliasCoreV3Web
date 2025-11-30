/**
 * Text component
 * Typography-aware text component with preset variants
 */

import React from 'react';
import { Text as RNText, StyleSheet, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { typography, type TypographyVariant } from '../theme/typography';
import { colors, type ColorName } from '../theme/colors';

export interface TextProps extends RNTextProps {
  /**
   * Typography variant (uses preset from theme)
   */
  variant?: TypographyVariant;

  /**
   * Text color (uses color from theme)
   */
  color?: ColorName;

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right' | 'justify';

  /**
   * Custom text style
   */
  style?: TextStyle;

  /**
   * Text content
   */
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'textPrimary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        typography[variant],
        { color: colors[color] },
        { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base text styles - individual variants override these
  },
});
