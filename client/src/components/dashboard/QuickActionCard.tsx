import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LucideIcon } from 'lucide-react-native';
import { SurfaceCard } from '../ui/SurfaceCard';
import { colors } from '../../constants/colors';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  imageUri?: string;
  onPress?: () => void;
  delay?: number;
  accentColor?: string;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  imageUri,
  onPress,
  delay = 0,
  accentColor = colors.light.primary,
}: QuickActionCardProps) {
  return (
    <SurfaceCard onPress={onPress} delay={delay} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: accentColor + '20' }]}>
          <Icon size={22} color={accentColor} />
        </View>
        {imageUri != null && (
          <Image source={{ uri: imageUri }} style={styles.thumb} contentFit="cover" />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    minHeight: 140,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    opacity: 0.9,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: colors.light.textSecondary,
    lineHeight: 17,
  },
});
