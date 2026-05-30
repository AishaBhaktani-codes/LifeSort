import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { FadeInView } from './FadeInView';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  delay?: number;
  size?: 'lg' | 'md';
  centered?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  delay = 0,
  size = 'lg',
  centered = false,
}: SectionHeadingProps) {
  return (
    <FadeInView delay={delay} style={[styles.wrap, centered && styles.wrapCentered]}>
      {eyebrow != null && <Text style={[styles.eyebrow, centered && styles.textCentered]}>{eyebrow}</Text>}
      <Text
        style={[
          styles.title,
          size === 'md' && styles.titleMd,
          centered && styles.textCentered,
        ]}
      >
        {title}
      </Text>
      {subtitle != null && <Text style={[styles.subtitle, centered && styles.textCentered]}>{subtitle}</Text>}
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  wrapCentered: {
    alignItems: 'center',
  },
  textCentered: {
    textAlign: 'center',
  },
  eyebrow: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '700',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: typography.fontSizes.displaySm,
    fontWeight: '900', // Making heading bolder for Acctual style
    color: colors.light.text,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: 40, // Increased line height for bigger font
  },
  titleMd: {
    fontSize: typography.fontSizes.xxl,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    color: colors.light.textSecondary,
    lineHeight: 24,
    marginTop: 12,
  },
});
