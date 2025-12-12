/**
 * LoadingSkeleton component
 * Placeholder for loading states
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

export interface LoadingSkeletonProps {
  /**
   * Width of skeleton (number in pt or '100%' string)
   */
  width?: number | string;

  /**
   * Height of skeleton (in pt)
   */
  height?: number;

  /**
   * Border radius variant
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * Custom style
   */
  style?: ViewStyle;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  radius = 'sm',
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: width as number | `${number}%`,
          height,
          borderRadius: borderRadius[radius],
        },
        { opacity },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.gray200,
  },
});
