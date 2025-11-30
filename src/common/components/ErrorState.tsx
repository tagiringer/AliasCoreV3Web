/**
 * ErrorState component
 * Consistent error display with retry capability
 */

import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { spacing } from '../theme/spacing';
import { colors } from '../theme/colors';

export interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Retry button text
   */
  retryText?: string;

  /**
   * Retry callback
   */
  onRetry?: () => void;

  /**
   * Custom style
   */
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  retryText = 'Try Again',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text variant="h3" color="textPrimary" align="center" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color="textSecondary" align="center" style={styles.message}>
        {message}
      </Text>
      {onRetry && (
        <Button
          title={retryText}
          variant="primary"
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
    backgroundColor: colors.background,
  },
  title: {
    marginBottom: spacing.md,
  },
  message: {
    marginBottom: spacing['2xl'],
  },
  button: {
    minWidth: 200,
  },
});
