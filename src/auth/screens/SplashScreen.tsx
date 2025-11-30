/**
 * SplashScreen
 * Initial screen with branding and auto-advance logic
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { SplashScreenNavigationProp } from '../../common/types/navigation';
import { Text } from '../../common/components/Text';
import { colors } from '../../common/theme/colors';
import { spacing } from '../../common/theme/spacing';

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    // Auto-advance to Welcome screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text variant="displayLarge" color="primary" align="center">
        AliasCore
      </Text>
      <Text variant="body" color="textSecondary" align="center" style={styles.tagline}>
        Your Universal Gaming Identity
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing['2xl'],
  },
  tagline: {
    marginTop: spacing.lg,
  },
});
