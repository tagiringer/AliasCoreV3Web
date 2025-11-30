/**
 * WelcomeScreen
 * Sign in with Google OAuth
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import type { WelcomeScreenNavigationProp } from '../../common/types/navigation';
import { Text } from '../../common/components/Text';
import { Button } from '../../common/components/Button';
import { ErrorState } from '../../common/components/ErrorState';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../../common/theme/colors';
import { spacing } from '../../common/theme/spacing';
import { logger } from '../../common/services/logger';

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle Google Sign In
   * In production, this would use expo-auth-session with actual Google OAuth
   * For MVP, we'll create a mock flow that calls the backend
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual Google OAuth flow using expo-auth-session
      // For now, we'll show an alert that this needs backend configuration
      Alert.alert(
        'Google Sign In',
        'Google OAuth requires backend configuration. For MVP testing, this will be implemented once the backend is ready.',
        [
          {
            text: 'OK',
            onPress: () => {
              // For development, we can mock a successful sign-in
              // mockSignIn();
            },
          },
        ]
      );

      logger.info('Google Sign In initiated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      logger.error('Google Sign In failed', { error: err });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mock sign in for development (temporary)
   */
  const mockSignIn = async () => {
    try {
      setLoading(true);
      // In real implementation, this would be the ID token from Google
      const mockIdToken = 'mock-google-id-token';
      await signIn(mockIdToken);

      // Navigate to onboarding if new user
      // The AuthContext will handle navigation automatically for returning users
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Sign In Failed"
        message={error}
        onRetry={() => {
          setError(null);
          handleGoogleSignIn();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayMedium" color="primary" align="center">
          Welcome to AliasCore
        </Text>
        <Text variant="body" color="textSecondary" align="center" style={styles.description}>
          Aggregate your gaming achievements, ratings, and profiles across all your favorite games.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Sign in with Google"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          onPress={handleGoogleSignIn}
        />
        <Text variant="caption" color="textTertiary" align="center" style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing['2xl'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: spacing.xl,
    maxWidth: 300,
  },
  footer: {
    paddingBottom: spacing['2xl'],
  },
  disclaimer: {
    marginTop: spacing.lg,
  },
});
