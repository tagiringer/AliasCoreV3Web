/**
 * DomainsDashboardScreen
 * Main dashboard showing all user's gaming domain profiles
 * Enhanced with right-swipe gesture navigation to map screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Text } from '../../common/components/Text';
import { Button } from '../../common/components/Button';
import { LoadingSkeleton } from '../../common/components/LoadingSkeleton';
import { Avatar } from '../../common/components/Avatar';
import { DomainCard } from '../components/DomainCard';
import { getUserDomains } from '../services/domainsApi';
import { useAuth } from '../../auth/hooks/useAuth';
import type { DomainProfile } from '../../common/types/entities';
import type { AppStackParamList } from '../../common/types/navigation';
import { colors } from '../../common/theme/colors';
import { spacing } from '../../common/theme/spacing';
import { logger } from '../../common/services/logger';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5; // 50% of screen width

type NavigationProp = StackNavigationProp<AppStackParamList, 'DomainsDashboard'>;

export const DomainsDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [domains, setDomains] = useState<DomainProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Right-swipe gesture to navigate to map screen
   * Threshold: 50% of screen width
   * Velocity impact: 0.4 for intentional swipes
   */
  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      // Check if swipe was to the right and crossed threshold
      const isRightSwipe = event.translationX > SWIPE_THRESHOLD;
      const hasVelocity = Math.abs(event.velocityX) > 400;

      if (isRightSwipe || (hasVelocity && event.velocityX > 0)) {
        logger.info('Right-swipe gesture detected, navigating to map');
        navigation.navigate('EventsMap' as any);
      }
    });

  /**
   * Fetch user's domains
   */
  const fetchDomains = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const fetchedDomains = await getUserDomains();
      setDomains(fetchedDomains);

      logger.info('Domains loaded', { count: fetchedDomains.length });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load domains';
      setError(errorMessage);
      logger.error('Failed to fetch domains', { error: err });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  /**
   * Load domains on mount
   */
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = () => {
    fetchDomains(true);
  };

  /**
   * Navigate to domain profile
   */
  const handleDomainPress = (domain: DomainProfile) => {
    logger.info('Navigating to domain profile', { domainId: domain.id });
    // TODO: Navigate to DomainProfileScreen
    // navigation.navigate('DomainProfile', { domainId: domain.id });
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1" color="textPrimary">
            My Domains
          </Text>
          {user && (
            <Text variant="body" color="textSecondary" style={styles.welcomeText}>
              Welcome, {user.displayName}!
            </Text>
          )}
        </View>

        <View style={styles.content}>
          <LoadingSkeleton width="100%" height={120} radius="md" style={{ marginBottom: spacing.lg }} />
          <LoadingSkeleton width="100%" height={120} radius="md" style={{ marginBottom: spacing.lg }} />
          <LoadingSkeleton width="100%" height={120} radius="md" />
        </View>
      </View>
      </GestureDetector>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text variant="h2" color="error" align="center" style={styles.errorTitle}>
            Failed to Load Domains
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={styles.errorMessage}>
            {error}
          </Text>
          <Button title="Try Again" variant="primary" onPress={() => fetchDomains()} />
        </View>
      </View>
      </GestureDetector>
    );
  }

  /**
   * Render empty state
   */
  if (domains.length === 0) {
    return (
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1" color="textPrimary">
            My Domains
          </Text>
        </View>

        <View style={styles.centerContent}>
          <Text variant="h2" color="textSecondary" align="center">
            No Gaming Domains Yet
          </Text>
          <Text variant="body" color="textTertiary" align="center" style={styles.emptyMessage}>
            Connect your gaming profiles to start tracking your achievements across multiple games.
          </Text>
          <Button title="Add Domain" variant="primary" onPress={() => {}} />
        </View>

        <View style={styles.footer}>
          <Button title="Sign Out" variant="outline" onPress={signOut} />
        </View>
      </View>
      </GestureDetector>
    );
  }

  /**
   * Render domains list
   */
  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
        >
        <View style={styles.header}>
          {user && (
            <View style={styles.avatarContainer}>
              <Avatar
                seed={user.email || user.id || 'default'}
                size={80}
              />
            </View>
          )}
          <Text variant="h1" color="textPrimary">
            My Domains
          </Text>
          {user && (
            <Text variant="body" color="textSecondary" style={styles.welcomeText}>
              Welcome, {user.displayName}!
            </Text>
          )}
        </View>

        <View style={styles.content}>
          {domains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} onPress={() => handleDomainPress(domain)} />
          ))}
        </View>

        <View style={styles.footer}>
          <Button title="Sign Out" variant="outline" onPress={signOut} fullWidth />
        </View>
      </ScrollView>
    </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['2xl'],
  },
  header: {
    marginBottom: spacing['2xl'],
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeText: {
    marginTop: spacing.sm,
  },
  content: {
    flex: 1,
    marginBottom: spacing['2xl'],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  errorTitle: {
    marginBottom: spacing.md,
  },
  errorMessage: {
    marginBottom: spacing['2xl'],
  },
  emptyMessage: {
    marginTop: spacing.md,
    marginBottom: spacing['2xl'],
    maxWidth: 300,
  },
  footer: {
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
