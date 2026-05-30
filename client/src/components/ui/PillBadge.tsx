import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';

export type BadgeVariant = 'blue' | 'pink' | 'yellow' | 'green' | 'purple' | 'neutral';

interface PillBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PillBadge({ children, variant = 'blue', style, textStyle }: PillBadgeProps) {
  
  const getColors = () => {
    if (variant === 'neutral') {
      return { bg: colors.light.surfaceElevated, text: colors.light.textSecondary };
    }
    const pastels = colors.light.pastels as any;
    return {
      bg: pastels[variant] || pastels.blue,
      text: pastels[`${variant}Text`] || pastels.blueText,
    };
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
