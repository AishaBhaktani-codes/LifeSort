import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface PillBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'neutral';
}

export function PillBadge({ children, variant = 'primary' }: PillBadgeProps) {
  const isPrimary = variant === 'primary';
  return (
    <View
      style={[
        styles.badge,
        isPrimary ? styles.badgePrimary : styles.badgeNeutral,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.textPrimary : styles.textNeutral,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  badgePrimary: {
    backgroundColor: colors.light.badge,
  },
  badgeNeutral: {
    backgroundColor: colors.light.surfaceElevated,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textPrimary: {
    color: colors.light.badgeText,
  },
  textNeutral: {
    color: colors.light.textSecondary,
  },
});
