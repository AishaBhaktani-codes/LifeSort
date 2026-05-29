import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { FadeInView } from '../ui/FadeInView';

interface StatPillProps {
  label: string;
  value: string;
  highlight?: string;
  delay?: number;
}

export function StatPill({ label, value, highlight, delay = 0 }: StatPillProps) {
  return (
    <FadeInView delay={delay} style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value}
        {highlight != null && <Text style={styles.highlight}> {highlight}</Text>}
      </Text>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.light.borderLight,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.light.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
  },
  highlight: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.primary,
  },
});
