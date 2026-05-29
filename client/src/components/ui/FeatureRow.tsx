import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';

interface FeatureRowProps {
  label: string;
  value?: string;
  highlight?: string;
}

export function FeatureRow({ label, value, highlight }: FeatureRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Check size={14} color={colors.light.primary} strokeWidth={3} />
      </View>
      <Text style={styles.label}>
        {label}
        {value != null && (
          <Text style={styles.value}>
            {' '}
            {value}
            {highlight != null && (
              <Text style={styles.highlight}> {highlight}</Text>
            )}
          </Text>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.light.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
    fontWeight: '500',
  },
  value: {
    fontWeight: '600',
    color: colors.light.text,
  },
  highlight: {
    color: colors.light.primary,
    fontWeight: '700',
  },
});
