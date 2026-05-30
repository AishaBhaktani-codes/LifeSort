import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Mic, Heart, History, Sparkles } from 'lucide-react-native';
import {
  ScreenShell,
  FloatingHeader,
  PillBadge,
  SectionHeading,
  PrimaryButton,
  HeroDecor,
  FadeInView,
} from '../../src/components/ui';
import { QuickActionCard, StatPill } from '../../src/components/dashboard';
import { colors } from '../../src/constants/colors';
import { images } from '../../src/constants/images';
import { useAuthStore } from '../../src/store/authStore';
import { useDashboard } from '../../src/hooks/useDashboard';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { stats, fetchDashboardStats } = useDashboard();
  
  useFocusEffect(
    useCallback(() => {
      fetchDashboardStats();
    }, [fetchDashboardStats])
  );

  const displayName = user?.email?.split('@')[0] ?? 'there';

  const formatMoodScore = (score: number) => {
    if (!score) return '—';
    return score.toFixed(1);
  };

  const sessionCountText =
    stats.sessionCount === 0
      ? 'No sessions yet ! Begin today !'
      : stats.sessionCount.toString();

  const taskCountText =
    stats.pendingTaskCount === 0
      ? 'No tasks remaining !!'
      : stats.pendingTaskCount.toString();

  return (
    <ScreenShell
      header={
        <>
          <HeroDecor variant="dashboard" />
          <FloatingHeader
            title="LifeSort"
            right={
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            }
          />
        </>
      }
    >
      <View style={styles.heroBanner}>
        <FadeInView delay={100} style={styles.bannerImage} subtle>
          <Image
            source={require('../../assets/dashboard-marble-bg.png')}
            style={styles.bannerImage}
            contentFit="cover"
            transition={300}
          />
        </FadeInView>
        <View style={styles.heroOverlay}>
          <FadeInView delay={140}>
            <PillBadge>Welcome {displayName} !</PillBadge>
          </FadeInView>
          <FadeInView delay={180}>
            <Text style={styles.heroTitle}>What’s on your mind today?</Text>
            <Text style={styles.heroSub}>
              Your voice companion is ready. Tap below to start a session.
            </Text>
          </FadeInView>
        </View>
      </View>

      <View style={styles.section}>
        <FadeInView delay={220}>
          <PrimaryButton
            label="Start a voice session"
            onPress={() => router.push('/(tabs)/conversation')}
          />
        </FadeInView>
      </View>

      <View style={styles.statsRow}>
        <StatPill label="Sessions" value={sessionCountText} delay={260} />
        <StatPill label="Mood avg" value={formatMoodScore(stats.avgMoodScore)} highlight="this week" delay={300} />
        <StatPill label="Tasks" value={taskCountText} delay={340} />
      </View>

      <View style={styles.section}>
        <SectionHeading
          delay={380}
          eyebrow="Quick actions"
          title="Find calm and clarity in chaos !"
          subtitle="Pick a flow — brain dump, vent, or morning check-in."
          size="md"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          <QuickActionCard
            title="Voice"
            description="Speak freely. Get tasks and empathetic replies."
            icon={Mic}
            imageUri={images.cards.voice}
            accentColor={colors.light.primary}
            delay={400}
            onPress={() => router.push('/(tabs)/conversation')}
          />
          <QuickActionCard
            title="Mood"
            description="Track patterns and emotional climate over time."
            icon={Heart}
            imageUri={images.cards.mood}
            accentColor={colors.light.accent}
            delay={460}
            onPress={() => router.push('/(tabs)/mood')}
          />
          <QuickActionCard
            title="History"
            description="Review past conversations and digests."
            icon={History}
            imageUri={images.cards.tasks}
            delay={520}
            onPress={() => router.push('/(tabs)/history')}
          />
        </ScrollView>
      </View>

      <View style={styles.section}>
        <FadeInView delay={560}>
          <Pressable
            style={styles.quoteCard}
            onPress={() => router.push('/(tabs)/conversation')}
          >
            <Sparkles size={20} color={colors.light.primary} />
            <Text style={styles.quote}>
              “LifeSort : Turn scattered thoughts into structure — in under a
              minute.”
            </Text>
            <Text style={styles.quoteAuthor}>Your daily companion</Text>
          </Pressable>
        </FadeInView>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.primaryDark,
  },
  heroBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 24,
    overflow: 'hidden',
    height: 200,
    backgroundColor: colors.light.surfaceElevated,
  },
  bannerImage: {
    ...StyleSheet.absoluteFill,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    // backgroundColor: 'rgba(241, 128, 226, 0.45)',
  },
  heroTitle: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 42,
    color: '#0c0c0c',
    marginTop: 10,
    letterSpacing: -0.3,
  },
  heroSub: {
    //fontFamily: 'DancingScript_500Medium',
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(12, 12, 12, 0.85)',
    marginTop: 6,
    lineHeight: 20,
  },
  bannerCursiveText: {
    fontFamily: 'DancingScript_700Bold',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  carousel: {
    paddingRight: 20,
    paddingBottom: 4,
  },
  quoteCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 12,
  },
  quote: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.light.text,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 13,
    color: colors.light.textSecondary,
    fontWeight: '600',
  },
});
