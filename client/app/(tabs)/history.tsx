import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { MessageSquare, Calendar } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useConversation } from '../../src/hooks/useConversation';
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

export default function HistoryScreen() {
  const { conversations, fetchConversations, loading } = useConversation();

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [fetchConversations])
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  return (
    <ScreenShell header={<FloatingHeader title="LifeSort" />}>
      <View style={styles.content}>
        <SectionHeading
          delay={60}
          eyebrow="Your journal"
          title="Conversation history"
          subtitle="Every session is encrypted and organized for easy review."
        />

        {loading && conversations.length === 0 ? (
          <ActivityIndicator size="large" color={colors.light.primary} style={{ marginTop: 40 }} />
        ) : (
          conversations.length > 0 ? (
            conversations.map((session, index) => (
              <FadeInView key={session.id} delay={120 + index * 80}>
                <SurfaceCard style={styles.sessionCard}>
                  <View style={styles.sessionRow}>
                    <Image
                      source={{ uri: session.flowType === 'morning_checkin' ? images.cards.voice : images.cards.tasks }}
                      style={styles.thumb}
                      contentFit="cover"
                    />
                    <View style={styles.sessionMeta}>
                      <View style={styles.sessionTitleRow}>
                        <MessageSquare size={16} color={colors.light.primary} />
                        <Text style={styles.sessionTitle}>{session.title || 'Untitled Session'}</Text>
                      </View>
                      <View style={styles.dateRow}>
                        <Calendar size={12} color={colors.light.textMuted} />
                        <Text style={styles.date}>{formatDate(session.createdAt)}</Text>
                      </View>
                      <Text style={styles.preview} numberOfLines={2}>{session.summary}</Text>
                    </View>
                  </View>
                </SurfaceCard>
              </FadeInView>
            ))
          ) : (
            <FadeInView delay={320}>
              <EmptyState
                title="No sessions yet"
                subtitle="Head to Voice and record your first conversation."
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
