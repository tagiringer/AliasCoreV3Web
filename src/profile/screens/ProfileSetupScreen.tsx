/**
 * ProfileSetupScreen
 * Reusable profile setup form (used in onboarding and profile editing)
 * For MVP, this is primarily used via OnboardingScreen
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../../common/components/Text';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';
import { validateDisplayName } from '../../common/utils/validators';
import { updateProfile } from '../services/profileApi';
import { colors } from '../../common/theme/colors';
import { typography } from '../../common/theme/typography';
import { spacing, touchTargets } from '../../common/theme/spacing';
import { logger } from '../../common/services/logger';

interface ProfileSetupScreenProps {
  initialDisplayName?: string;
  initialAvatarUrl?: string | null;
  onComplete: (displayName: string, avatarUrl?: string | null) => void;
  submitButtonText?: string;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  initialDisplayName = '',
  initialAvatarUrl = null,
  onComplete,
  submitButtonText = 'Continue',
}) => {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl] = useState<string | null>(initialAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle avatar picker
   */
  const handleAvatarPicker = () => {
    Alert.alert(
      'Avatar Selection',
      'Avatar upload will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Validate display name
    const validation = validateDisplayName(displayName);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid display name');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call profile API
      await updateProfile({
        displayName: displayName.trim(),
        avatarUrl,
      });

      logger.info('Profile setup completed');

      // Notify parent component
      onComplete(displayName.trim(), avatarUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      logger.error('Profile setup failed', { error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar Picker */}
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

      {/* Submit Button */}
      <Button
        title={submitButtonText}
        variant="primary"
        size="large"
        fullWidth
        loading={loading}
        disabled={displayName.length < 3}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
