import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeInLeft } from 'react-native-reanimated';
import { CheckSquare, Heart, MessageSquare, ListTodo, User, Calendar, Tag, Smile } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { Task, MoodEntry } from '../../types';

interface SessionResultsViewProps {
  transcript: string;
  aiResponse: string;
  tasks: Task[];
  mood: MoodEntry | null;
  onClear: () => void;
}

export function SessionResultsView({ transcript, aiResponse, tasks, mood, onClear }: SessionResultsViewProps) {
  // Map mood score to color and text label
  const getMoodDetails = (score: number) => {
    if (score >= 0.8) return { label: 'Great', color: colors.light.mood.great, emoji: '🟢' };
    if (score >= 0.6) return { label: 'Good', color: colors.light.mood.good, emoji: '🟢' };
    if (score >= 0.4) return { label: 'Neutral', color: colors.light.mood.neutral, emoji: '🟡' };
    if (score >= 0.2) return { label: 'Low', color: colors.light.mood.low, emoji: '🟠' };
    return { label: 'Tough', color: colors.light.mood.tough, emoji: '🔴' };
  };

  const moodDetails = mood ? getMoodDetails(mood.score) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header section with Clear action */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Companion Response</Text>
        <Pressable onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Start New</Text>
        </Pressable>
      </View>

      {/* AI Empathetic Response Card */}
      <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.aiCard}>
        <View style={styles.cardHeader}>
          <Heart size={20} color="#10B981" fill="#10B981" />
          <Text style={styles.cardTitle}>Companion Reply</Text>
        </View>
        <Text style={styles.aiText}>{aiResponse}</Text>
      </Animated.View>

      {/* Mood Orb & Analysis Card (if available) */}
      {mood && moodDetails && (
        <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Smile size={20} color={moodDetails.color} />
            <Text style={styles.cardTitle}>Emotional Climate</Text>
            <View style={[styles.moodBadge, { backgroundColor: moodDetails.color + '20' }]}>
              <Text style={[styles.moodBadgeText, { color: moodDetails.color }]}>
                {moodDetails.emoji} {moodDetails.label} ({Math.round(mood.score * 100)}%)
              </Text>
            </View>
          </View>
          
          <View style={styles.emotionContainer}>
            {mood.emotions.map((emotion, idx) => (
              <View key={idx} style={styles.emotionChip}>
                <Text style={styles.emotionChipText}>{emotion}</Text>
              </View>
            ))}
          </View>

          {mood.triggers.length > 0 && (
            <View style={styles.triggersSection}>
              <Text style={styles.subLabel}>Triggers:</Text>
              <Text style={styles.triggersText}>{mood.triggers.join(', ')}</Text>
            </View>
          )}

          {mood.notes && (
            <Text style={styles.moodNotes}>{mood.notes}</Text>
          )}
        </Animated.View>
      )}

      {/* Structured Tasks Card */}
      {tasks.length > 0 && (
        <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <ListTodo size={20} color="#14B8A6" />
            <Text style={styles.cardTitle}>Action Items Structured</Text>
            <View style={styles.taskCountBadge}>
              <Text style={styles.taskCountText}>{tasks.length} tasks</Text>
            </View>
          </View>

          <View style={styles.taskList}>
            {tasks.map((task, idx) => (
              <Animated.View
                key={task.id}
                entering={FadeInLeft.delay(500 + idx * 100).duration(400)}
                style={styles.taskItem}
              >
                <View style={styles.taskInfo}>
                  <CheckSquare size={18} color={task.priority === 'high' ? '#EF4444' : '#64748B'} />
                  <Text style={styles.taskTitle}>{task.title}</Text>
                </View>

                {/* Task Details Subrow */}
                <View style={styles.taskDetails}>
                  {task.category && (
                    <View style={styles.detailBadge}>
                      <Tag size={12} color="#64748B" />
                      <Text style={styles.detailText}>{task.category}</Text>
                    </View>
                  )}
                  {task.dueDate && (
                    <View style={styles.detailBadge}>
                      <Calendar size={12} color="#64748B" />
                      <Text style={styles.detailText}>
                        {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  )}
                  {task.people.length > 0 && (
                    <View style={styles.detailBadge}>
                      <User size={12} color="#64748B" />
                      <Text style={styles.detailText}>{task.people.join(', ')}</Text>
                    </View>
                  )}
                  <View style={[styles.priorityBadge, styles[`priority_${task.priority}`]]}>
                    <Text style={styles.priorityText}>{task.priority}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Transcript Card */}
      <Animated.View entering={FadeInUp.delay(550).duration(500)} style={styles.card}>
        <View style={styles.cardHeader}>
          <MessageSquare size={20} color="#64748B" />
          <Text style={styles.cardTitle}>Speech Transcript</Text>
        </View>
        <Text style={styles.transcriptText}>"{transcript}"</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  aiCard: {
    backgroundColor: '#E6F9F3',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    elevation: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  aiText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
  transcriptText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  moodBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  moodBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emotionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  emotionChip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emotionChipText: {
    fontSize: 13,
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  triggersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    marginRight: 6,
  },
  triggersText: {
    fontSize: 13,
    color: '#374151',
  },
  moodNotes: {
    fontSize: 14,
    color: '#4B5563',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 6,
  },
  taskCountBadge: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  taskCountText: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '600',
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  taskDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    paddingLeft: 28,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 11,
    color: '#64748B',
  },
  priorityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  priority_high: {
    backgroundColor: '#FEE2E2',
  },
  priority_highText: {
    color: '#EF4444',
  },
  priority_medium: {
    backgroundColor: '#FEF3C7',
  },
  priority_mediumText: {
    color: '#D97706',
  },
  priority_low: {
    backgroundColor: '#ECFDF5',
  },
  priority_lowText: {
    color: '#059669',
  },
} as any);
