/**
 * DomainCard Component
 * Displays a gaming domain with icon, name, and key stats
 * Enhanced with domain-specific color schemes for visual differentiation
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../common/components/Text';
import { Card } from '../../common/components/Card';
import type { DomainProfile } from '../../common/types/entities';
import { colors } from '../../common/theme/colors';
import { spacing } from '../../common/theme/spacing';
import { getDomainColors } from '../constants/domainColors';

export interface DomainCardProps {
  domain: DomainProfile;
  onPress: () => void;
}

export const DomainCard: React.FC<DomainCardProps> = ({ domain, onPress }) => {
  // Get domain-specific color scheme
  const colorScheme = getDomainColors(domain.domainKey);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card
        variant="elevated"
        style={StyleSheet.flatten([
          styles.card,
          {
            // Domain-specific border (left accent)
            borderLeftWidth: 4,
            borderLeftColor: colorScheme.border,
            // Background tint (10% opacity of primary color)
            backgroundColor: `${colorScheme.primary}10`,
          },
        ])}
      >
        <View style={styles.header}>
          <Text variant="h3" color="textPrimary">
            {domain.domainName}
          </Text>
          <Text variant="caption" color="textSecondary">
            {domain.primaryPlatform}
          </Text>
        </View>

        <View style={styles.stats}>
          {/* Current Rating */}
          {domain.currentRating !== null && (
            <View style={styles.stat}>
              <Text variant="caption" color="textTertiary">
                Current Rating
              </Text>
              <Text variant="bodyLarge" color="textPrimary" style={styles.statValue}>
                {domain.currentRating}
              </Text>
            </View>
          )}

          {/* Peak Rating */}
          {domain.peakRating !== null && (
            <View style={styles.stat}>
              <Text variant="caption" color="textTertiary">
                Peak Rating
              </Text>
              <Text variant="bodyLarge" color="textPrimary" style={styles.statValue}>
                {domain.peakRating}
              </Text>
            </View>
          )}

          {/* Rank Tier */}
          {domain.rankTier && (
            <View style={styles.stat}>
              <Text variant="caption" color="textTertiary">
                Rank
              </Text>
              <Text variant="bodyLarge" color="primary" style={styles.statValue}>
                {domain.rankTier}
              </Text>
            </View>
          )}
        </View>

        {/* Platform Username */}
        <View style={styles.footer}>
          <Text variant="caption" color="textSecondary">
            @{domain.platformUsername}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
});
