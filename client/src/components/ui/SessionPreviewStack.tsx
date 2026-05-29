import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { images } from '../../constants/images';

const PREVIEWS = [
  {
    id: '1',
    mode: 'Brain Dump',
    summary: '3 tasks extracted',
    from: 'You',
    to: 'LifeSort',
    accent: colors.light.primary,
    image: images.cards.tasks,
    offset: { top: 0, left: 0, rotate: '-2deg' },
    zIndex: 3,
  },
  {
    id: '2',
    mode: 'Mood Check',
    summary: 'Feeling good · 78%',
    from: 'Morning',
    to: 'Insights',
    accent: colors.light.accent,
    image: images.cards.mood,
    offset: { top: 24, left: 28, rotate: '1.5deg' },
    zIndex: 2,
  },
  {
    id: '3',
    mode: 'Quick Vent',
    summary: 'Empathetic reply ready',
    from: 'Session',
    to: 'Companion',
    accent: '#F59E0B',
    image: images.cards.voice,
    offset: { top: 48, left: 56, rotate: '3deg' },
    zIndex: 1,
  },
] as const;

export function SessionPreviewStack() {
  return (
    <View style={styles.container}>
      {PREVIEWS.map((card, index) => (
        <Animated.View
          key={card.id}
          entering={FadeInUp.delay(200 + index * 100)
            .duration(550)
            .springify()}
          style={[
            styles.card,
            {
              top: card.offset.top,
              left: card.offset.left,
              zIndex: card.zIndex,
              transform: [{ rotate: card.offset.rotate }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Image source={{ uri: card.image }} style={styles.thumb} />
            <View style={styles.cardMeta}>
              <Text style={styles.mode}>{card.mode}</Text>
              <Text style={styles.summary}>{card.summary}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{card.from}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>{card.to}</Text>
          </View>
          <View style={[styles.ctaStrip, { backgroundColor: card.accent + '18' }]}>
            <View style={[styles.ctaDot, { backgroundColor: card.accent }]} />
            <Text style={[styles.ctaText, { color: card.accent }]}>
              Open in LifeSort
            </Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginTop: 8,
    marginBottom: 8,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: 260,
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  cardMeta: {
    flex: 1,
  },
  mode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.borderLight,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.text,
  },
  ctaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  ctaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
