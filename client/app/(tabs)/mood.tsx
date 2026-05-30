import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
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
import { useMoodData } from '../../src/hooks/useMoodData';

const { width } = Dimensions.get('window');

export default function MoodScreen() {
  const { moodHistory, averageScore, loading, fetchMoodHistory } = useMoodData();

  useFocusEffect(
    useCallback(() => {
      fetchMoodHistory();
    }, [fetchMoodHistory])
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const chartWidth = width - 80;
  const chartHeight = 120;
  const maxDataPoints = 7;
  
  const recentMoods = [...moodHistory].slice(0, maxDataPoints).reverse();
  
  let pathD = '';
  let points: {x: number, y: number}[] = [];

  if (recentMoods.length > 1) {
    const xStep = chartWidth / (recentMoods.length - 1);
    
    recentMoods.forEach((entry, index) => {
      const x = index * xStep;
      const y = chartHeight - (entry.score * (chartHeight - 20) + 10);
      points.push({ x, y });
      
      if (index === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        const prev = points[index - 1];
        const cp1x = prev.x + (x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (x - prev.x) / 2;
        const cp2y = y;
        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
    });
  }

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

        {loading && moodHistory.length === 0 ? (
          <ActivityIndicator size="large" color={colors.light.primary} style={{ marginTop: 40 }} />
        ) : (
          moodHistory.length > 0 ? (
            <FadeInView delay={140}>
              <SurfaceCard style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>7-Day average</Text>
                  <Text style={styles.chartScore}>{averageScore.toFixed(2)}</Text>
                </View>
                
                {recentMoods.length > 1 ? (
                  <View style={styles.chartWrapper}>
                    <Svg width={chartWidth} height={chartHeight}>
                      <Defs>
                        <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <Stop offset="0" stopColor={colors.light.primary} stopOpacity="0.2" />
                          <Stop offset="1" stopColor={colors.light.primary} stopOpacity="0" />
                        </SvgLinearGradient>
                      </Defs>
                      
                      <Path
                        d={`${pathD} L ${points[points.length - 1].x} ${chartHeight} L 0 ${chartHeight} Z`}
                        fill="url(#grad)"
                      />
                      
                      <Path
                        d={pathD}
                        fill="none"
                        stroke={colors.light.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {points.map((p, i) => (
                        <Circle
                          key={`pt-${i}`}
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill={colors.light.surface}
                          stroke={colors.light.primary}
                          strokeWidth="2"
                        />
                      ))}
                    </Svg>

                    <View style={styles.xAxis}>
                      {recentMoods.map((d) => (
                        <Text key={d.id} style={styles.xLabel}>{formatDate(d.createdAt)}</Text>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={[styles.chartWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: colors.light.textSecondary }}>Not enough data for chart</Text>
                  </View>
                )}
              </SurfaceCard>
            </FadeInView>
          ) : (
            <FadeInView delay={140}>
              <EmptyState
                title="No mood data"
                subtitle="Record a conversation to track your mood over time."
                imageUri={images.hero.journal}
              />
            </FadeInView>
          )
        )}
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
  chartScore: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.primary,
  },
  chartWrapper: {
    marginTop: 10,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  xLabel: {
    fontSize: 11,
    color: colors.light.textMuted,
  },
});
