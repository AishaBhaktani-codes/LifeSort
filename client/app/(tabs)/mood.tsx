import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { TrendingUp, Smile, Cloud } from 'lucide-react-native';
import {
  ScreenShell,
  FloatingHeader,
  SectionHeading,
  SurfaceCard,
  FadeInView,
} from '../../src/components/ui';
import { EmptyState } from '../../src/components/common';
import { colors } from '../../src/constants/colors';
import { images } from '../../src/constants/images';

const MOOD_SAMPLES = [
  { label: 'Great', pct: 78, color: colors.light.mood.great },
  { label: 'Good', pct: 62, color: colors.light.mood.good },
  { label: 'Neutral', pct: 45, color: colors.light.mood.neutral },
];

export default function MoodScreen() {
  return (
    <ScreenShell header={<FloatingHeader title="LifeSort" />}>
      <View style={styles.hero}>
        <Image
          source={{ uri: images.cards.mood }}
          style={styles.heroImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.content}>
        <SectionHeading
          delay={80}
          eyebrow="Emotional climate"
          title="Understand your patterns"
          subtitle="Mood scores from voice sessions appear here as trends and insights."
        />

        <FadeInView delay={160}>
          <SurfaceCard style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <TrendingUp size={20} color={colors.light.primary} />
              <Text style={styles.chartTitle}>Weekly trend</Text>
            </View>
            <View style={styles.bars}>
              {MOOD_SAMPLES.map((m, i) => (
                <View key={m.label} style={styles.barRow}>
                  <View style={styles.barLabel}>
                    <Smile size={14} color={m.color} />
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${m.pct}%`,
                          backgroundColor: m.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
            <EmptyState
              title="No live data yet"
              subtitle="Complete a voice session to populate your mood chart."
              imageUri={images.hero.calm}
            />
          </SurfaceCard>
        </FadeInView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}
        >
          {['Calm', 'Focused', 'Anxious', 'Grateful', 'Tired'].map((chip, i) => (
            <FadeInView key={chip} delay={220 + i * 60}>
              <SurfaceCard style={styles.chip}>
                <Cloud size={14} color={colors.light.textMuted} />
                <Text style={styles.chipText}>{chip}</Text>
              </SurfaceCard>
            </FadeInView>
          ))}
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chartCard: {
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
  },
  bars: {
    gap: 12,
    marginBottom: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barLabel: {
    width: 24,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.light.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    opacity: 0.85,
  },
  chipsScroll: {
    marginTop: 8,
  },
  chips: {
    gap: 10,
    paddingRight: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
});
