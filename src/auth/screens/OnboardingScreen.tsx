/**
 * OnboardingScreen
 * Set display name and avatar for new users
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { OnboardingRouteProp } from '../../common/types/navigation';
import { Text } from '../../common/components/Text';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';
import { validateDisplayName } from '../../common/utils/validators';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../../common/theme/colors';
import { typography } from '../../common/theme/typography';
import { spacing, touchTargets } from '../../common/theme/spacing';
import { logger } from '../../common/services/logger';

export const OnboardingScreen: React.FC = () => {
  const route = useRoute<OnboardingRouteProp>();
  const { updateUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Validate and submit profile
   */
  const handleContinue = async () => {
    // Validate display name
    const validation = validateDisplayName(displayName);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid display name');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Call profile API to update display name
      // For now, update locally
      updateUser({
        displayName: displayName.trim(),
      });

      logger.critical('onboarding_completed', {
        userId: route.params.userId,
      });

      // Navigation will be handled by AuthContext
      // User will be redirected to dashboard automatically
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      logger.error('Onboarding failed', { error: err });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle avatar picker (placeholder for MVP)
   */
  const handleAvatarPicker = () => {
    Alert.alert(
      'Avatar Selection',
      'Avatar upload will be available in a future update. For now, a default avatar will be used.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h1" color="textPrimary" align="center">
          Set Up Your Profile
        </Text>
        <Text variant="body" color="textSecondary" align="center" style={styles.subtitle}>
          Choose a display name that represents you across all gaming communities
        </Text>

        {/* Avatar Picker Placeholder */}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={handleAvatarPicker}
          activeOpacity={0.7}
        >
          <View style={styles.avatarPlaceholder}>
            <Text variant="h2" color="textSecondary">
              +
            </Text>
          </View>
          <Text variant="caption" color="textSecondary" style={styles.avatarLabel}>
            Add Avatar
          </Text>
        </TouchableOpacity>

        {/* Display Name Input */}
        <Card variant="outlined" style={styles.inputCard}>
          <Text variant="label" color="textSecondary" style={styles.inputLabel}>
            Display Name
          </Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={(text) => {
              setDisplayName(text);
              setError(null);
            }}
            placeholder="Enter display name (3-30 characters)"
            placeholderTextColor={colors.textTertiary}
            maxLength={30}
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Text variant="caption" color="textTertiary" style={styles.hint}>
            Letters, numbers, spaces, and . - ' allowed
          </Text>
          {error && (
            <Text variant="caption" color="error" style={styles.error}>
              {error}
            </Text>
          )}
        </Card>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={displayName.length < 3}
          onPress={handleContinue}
        />
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
  },
  subtitle: {
    marginTop: spacing.md,
    marginBottom: spacing['3xl'],
  },
  avatarButton: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  avatarLabel: {
    marginTop: spacing.sm,
  },
  inputCard: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    minHeight: touchTargets.small,
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hint: {
    marginTop: spacing.sm,
  },
  error: {
    marginTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
