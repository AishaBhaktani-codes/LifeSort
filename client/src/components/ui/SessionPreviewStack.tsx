import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInUp, SharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { images } from '../../constants/images';

const PREVIEWS = [
  {
    id: '1',
    mode: 'Brain Dump',
    summary: '3 tasks extracted',
    from: 'You',
    to: 'LifeSort',
    accent: '#0369A1',
    bgAccent: '#E0F2FE',
    image: images.cards.tasks,
    baseOffset: { top: 0, left: 0, rotate: '-2deg' },
    zIndex: 3,
  },
  {
    id: '2',
    mode: 'Mood Check',
    summary: 'Feeling good · 78%',
    from: 'Morning',
    to: 'Insights',
    accent: '#B45309',
    bgAccent: '#FEF3C7',
    image: images.cards.mood,
    baseOffset: { top: 24, left: 28, rotate: '1.5deg' },
    zIndex: 2,
  },
  {
    id: '3',
    mode: 'Quick Vent',
    summary: 'Empathetic reply ready',
    from: 'Session',
    to: 'Companion',
    accent: '#BE185D',
    bgAccent: '#FCE7F3',
    image: images.cards.voice,
    baseOffset: { top: 48, left: 56, rotate: '3deg' },
    zIndex: 1,
  },
] as const;

export function SessionPreviewStack({ scrollOffset }: { scrollOffset?: SharedValue<number> }) {
  return (
    <View style={styles.container}>
      {PREVIEWS.map((card, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          if (!scrollOffset) return {};
          
          const translateY = interpolate(
            scrollOffset.value,
            [0, 400],
            [0, -40 * (3 - index)],
            Extrapolation.CLAMP
          );
          
          return {
            transform: [
              { translateY },
              { rotate: card.baseOffset.rotate }
            ]
          };
        });

        return (
          <Animated.View
            key={card.id}
            entering={FadeInUp.delay(200 + index * 100)
              .duration(550)
              .springify()}
            style={[
              styles.card,
              {
                top: card.baseOffset.top,
                left: card.baseOffset.left,
                zIndex: card.zIndex,
                transform: scrollOffset ? undefined : [{ rotate: card.baseOffset.rotate }],
              },
              scrollOffset && animatedStyle,
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
            <View style={[styles.ctaStrip, { backgroundColor: card.bgAccent }]}>
              <View style={[styles.ctaDot, { backgroundColor: card.accent }]} />
              <Text style={[styles.ctaText, { color: card.accent }]}>
                Open in LifeSort
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginTop: 16,
    marginBottom: 8,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: 280,
    backgroundColor: colors.light.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.borderLight,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
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
    fontWeight: '800',
    color: colors.light.text,
    marginTop: 2,
    letterSpacing: -0.2,
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
    borderRadius: 9999,
  },
  ctaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
