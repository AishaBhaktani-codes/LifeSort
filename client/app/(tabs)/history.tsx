import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MessageSquare, Calendar } from 'lucide-react-native';
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

const PLACEHOLDER_SESSIONS = [
  {
    id: '1',
    title: 'Brain Dump',
    date: 'When you’re ready',
    preview: 'Your past voice journals will appear here.',
    image: images.cards.tasks,
  },
  {
    id: '2',
    title: 'Morning Check-in',
    date: 'Scheduled flows',
    preview: 'Review transcripts, AI replies, and extracted tasks.',
    image: images.cards.voice,
  },
];

export default function HistoryScreen() {
  return (
    <ScreenShell header={<FloatingHeader title="LifeSort" />}>
      <View style={styles.content}>
        <SectionHeading
          delay={60}
          eyebrow="Your journal"
          title="Conversation history"
          subtitle="Every session is encrypted and organized for easy review."
        />

        {PLACEHOLDER_SESSIONS.map((session, index) => (
          <FadeInView key={session.id} delay={120 + index * 80}>
            <SurfaceCard style={styles.sessionCard}>
              <View style={styles.sessionRow}>
                <Image
                  source={{ uri: session.image }}
                  style={styles.thumb}
                  contentFit="cover"
                />
                <View style={styles.sessionMeta}>
                  <View style={styles.sessionTitleRow}>
                    <MessageSquare size={16} color={colors.light.primary} />
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                  </View>
                  <View style={styles.dateRow}>
                    <Calendar size={12} color={colors.light.textMuted} />
                    <Text style={styles.date}>{session.date}</Text>
                  </View>
                  <Text style={styles.preview}>{session.preview}</Text>
                </View>
              </View>
            </SurfaceCard>
          </FadeInView>
        ))}

        <FadeInView delay={320}>
          <EmptyState
            title="No sessions yet"
            subtitle="Head to Voice and record your first conversation."
            imageUri={images.hero.journal}
          />
        </FadeInView>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: 14,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  sessionMeta: {
    flex: 1,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  preview: {
    fontSize: 13,
    color: colors.light.textSecondary,
    lineHeight: 18,
  },
});
