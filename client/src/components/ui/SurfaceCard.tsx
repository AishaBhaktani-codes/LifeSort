import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../constants/colors';

interface SurfaceCardProps {
  children: ReactNode;
  onPress?: () => void;
  delay?: number;
  style?: ViewStyle;
  active?: boolean;
}

export function SurfaceCard({
  children,
  onPress,
  delay = 0,
  style,
  active = false,
}: SurfaceCardProps) {
  const content = (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500).springify()}
      style={[
        styles.card,
        active && styles.cardActive,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 24, // Acctual uses large border radii
    padding: 24,
    borderWidth: 1,
    borderColor: colors.light.borderLight, // Very subtle border
    shadowColor: '#0F172A', // Using the dark charcoal for shadow
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.04, // Extremely soft
    shadowRadius: 32, // Large spread
    elevation: 4,
  },
  cardActive: {
    borderColor: colors.light.primaryLight,
    backgroundColor: '#FAFBFC',
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }], // subtle press interaction
  },
});
