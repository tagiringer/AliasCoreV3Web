/**
 * MapPlaceholderScreen
 * MVP placeholder for map-based event discovery
 * Accessed via right-swipe from DomainsDashboard
 *
 * Design: research.md (Simple View + enhanced design chosen)
 * Future: Will be replaced with react-native-maps + event markers
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from '../../common/components/Text';
import { Card } from '../../common/components/Card';
import { colors } from '../../common/theme/colors';
import { spacing, borderRadius } from '../../common/theme/spacing';

/**
 * Map placeholder state interface
 * Static for MVP - will be dynamic when real map is implemented
 */
export interface MapPlaceholderState {
  /** Display message shown on placeholder screen */
  displayMessage: string;

  /** Feature list items to show in info card */
  features: string[];

  /** Badge text shown at top of card */
  badgeText: string;

  /** Whether to show map-like visual elements */
  showMapVisuals: boolean;
}

/**
 * Feature list item component
 */
const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.featureItem}>
    <View style={styles.checkmark} />
    <Text variant="body" color="textSecondary">
      {text}
    </Text>
  </View>
);

/**
 * MapPlaceholderScreen Component
 *
 * Displays a placeholder "coming soon" screen for the map feature.
 * Shows map visual elements (coordinate lines, location pin) and
 * info card with feature list.
 */
export const MapPlaceholderScreen: React.FC = () => {
  // Static placeholder state for MVP
  const placeholderState: MapPlaceholderState = {
    displayMessage: 'Discover gaming events, tournaments, and meetups near you',
    features: [
      'Find local tournaments',
      'Connect with nearby players',
      'Track event schedules',
    ],
    badgeText: 'COMING SOON',
    showMapVisuals: true,
  };

  // Animated value for pulsing effect on location pin
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Pulsing animation loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Map Placeholder Background Area */}
      <View style={styles.mapPlaceholder}>
        {placeholderState.showMapVisuals && (
          <>
            {/* Coordinate reference lines */}
            <View style={styles.horizontalLine} />
            <View style={styles.verticalLine} />

            {/* Center location pin indicator */}
            <View style={styles.centerIndicator}>
              <Animated.View
                style={[
                  styles.locationPulse,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <View style={styles.locationPin} />
            </View>
          </>
        )}
      </View>

      {/* Info Card Overlay */}
      <View style={styles.infoOverlay}>
        <Card variant="elevated" style={styles.infoCard}>
          <Text variant="h2" color="textPrimary" align="center">
            Event Map
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            align="center"
            style={styles.description}
          >
            {placeholderState.displayMessage}
          </Text>

          {/* Coming Soon Badge */}
          <View style={styles.comingSoonBadge}>
            <Text variant="caption" color="primary" style={styles.badgeText}>
              {placeholderState.badgeText}
            </Text>
          </View>

          {/* Feature List */}
          <View style={styles.featureList}>
            {placeholderState.features.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.gray50,
    position: 'relative',
    overflow: 'hidden',
  },
  // Coordinate reference lines
  horizontalLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.gray300,
    opacity: 0.5,
  },
  verticalLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.gray300,
    opacity: 0.5,
  },
  // Location pin at center
  centerIndicator: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.white,
    zIndex: 2,
  },
  locationPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    opacity: 0.3,
    zIndex: 1,
  },
  // Info card overlay
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing['2xl'],
  },
  infoCard: {
    padding: spacing['2xl'],
  },
  description: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  comingSoonBadge: {
    alignSelf: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
  },
  badgeText: {
    fontWeight: '600',
    letterSpacing: 1,
  },
  featureList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
  },
});
