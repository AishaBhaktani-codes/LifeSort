import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { FadeInView } from './FadeInView';

interface FloatingHeaderProps {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  /** Compact pill bar (Acctual nav style) */
  logoOnly?: boolean;
}

export function FloatingHeader({
  title = 'LifeSort',
  subtitle,
  right,
  logoOnly = false,
}: FloatingHeaderProps) {
  return (
    <FadeInView delay={0} subtle>
      <View style={styles.wrapper}>
        <View style={styles.pill}>
          <View style={styles.brand}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>{title}</Text>
          </View>
          {!logoOnly && right != null && <View style={styles.right}>{right}</View>}
        </View>
        {subtitle != null && !logoOnly && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.light.borderLight,
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.light.primary,
  },
  logoText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.light.text,
    letterSpacing: typography.letterSpacing.tight,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.light.textSecondary,
    marginTop: 10,
    paddingHorizontal: 4,
  },
});
