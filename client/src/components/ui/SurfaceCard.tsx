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
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardActive: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.primaryMuted,
  },
  pressed: {
    opacity: 0.92,
  },
});
