import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../constants/colors';
import { FadeInView } from '../ui/FadeInView';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  imageUri?: string;
}

export function EmptyState({ title, subtitle, imageUri }: EmptyStateProps) {
  return (
    <FadeInView style={styles.wrap}>
      {imageUri != null && (
        <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 20,
    opacity: 0.85,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
