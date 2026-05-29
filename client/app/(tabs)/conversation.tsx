import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Lock, Brain, Flame, Sun, AlertCircle } from 'lucide-react-native';
import { useAudioRecorder } from '../../src/hooks/useAudioRecorder';
import { useConversation } from '../../src/hooks/useConversation';
import {
  VoiceButton,
  WaveformVisualizer,
  SessionResultsView,
} from '../../src/components/voice';
import {
  ScreenShell,
  FloatingHeader,
  PillBadge,
  FadeInView,
} from '../../src/components/ui';
import { colors } from '../../src/constants/colors';

export default function ConversationScreen() {
  const [flowType, setFlowType] = useState<'brain_dump' | 'quick_vent' | 'morning_checkin'>('brain_dump');
  const { isRecording, duration, metering, isSilent, startRecording, stopRecording } = useAudioRecorder();
  const {
    activeTranscript,
    activeAiResponse,
    activeTasks,
    activeMood,
    loading,
    uploadConversation,
    clearActiveSession,
  } = useConversation();

  // Format recording duration (seconds -> MM:SS)
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRecordPress = async () => {
    if (isRecording) {
      const recordingData = await stopRecording();
      if (recordingData && recordingData.uri) {
        const { uri, durationSeconds } = recordingData;
        await uploadConversation(uri, flowType, durationSeconds);
      }
    } else {
      await startRecording();
    }
  };

  // If a session has results, display the SessionResultsView
  const teeBadge = (
    <View style={styles.teeBadge}>
      <Lock size={12} color={colors.light.primary} />
      <Text style={styles.teeBadgeText}>TEE Encrypted</Text>
    </View>
  );

  if (activeTranscript && activeAiResponse) {
    return (
      <ScreenShell scroll={false} contentStyle={styles.shellContent}>
        <FloatingHeader
          title="LifeSort"
          subtitle="Session results"
          right={teeBadge}
        />
        <SessionResultsView
          transcript={activeTranscript}
          aiResponse={activeAiResponse}
          tasks={activeTasks}
          mood={activeMood}
          onClear={clearActiveSession}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scroll={false} contentStyle={styles.shellContent}>
      <FloatingHeader
        title="LifeSort"
        subtitle="Conversational companion"
        right={teeBadge}
      />

        {/* Processing State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.light.primary} />
            <Text style={styles.loadingText}>Processing audio securely…</Text>
            <Text style={styles.loadingSubtext}>
              TEE encrypts your thoughts on-device. Generating empathetic insights and extracting tasks.
            </Text>
          </View>
        ) : (
          <View style={styles.mainContent}>
            {!isRecording && (
              <View style={styles.selectorSection}>
                <FadeInView delay={80}>
                  <PillBadge>Choose your flow</PillBadge>
                </FadeInView>
                <Text style={styles.sectionLabel}>Conversation mode</Text>

                <View style={styles.flowSelector}>
                  <Pressable
                    onPress={() => setFlowType('brain_dump')}
                    style={[
                      styles.flowCard,
                      flowType === 'brain_dump' && styles.flowCardActive,
                    ]}
                  >
                    <View style={[styles.iconWrapper, flowType === 'brain_dump' && styles.iconWrapperActive]}>
                      <Brain size={24} color={flowType === 'brain_dump' ? colors.light.primary : colors.light.textSecondary} />
                    </View>
                    <Text style={styles.flowCardTitle}>Brain Dump</Text>
                    <Text style={styles.flowCardDesc}>Organize scattered ideas into structured task lists.</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setFlowType('quick_vent')}
                    style={[
                      styles.flowCard,
                      flowType === 'quick_vent' && styles.flowCardActive,
                    ]}
                  >
                    <View style={[styles.iconWrapper, flowType === 'quick_vent' && styles.iconWrapperActive]}>
                      <Flame size={24} color={flowType === 'quick_vent' ? colors.light.accent : colors.light.textSecondary} />
                    </View>
                    <Text style={styles.flowCardTitle}>Quick Vent</Text>
                    <Text style={styles.flowCardDesc}>Express frustrations and release emotional weight.</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setFlowType('morning_checkin')}
                    style={[
                      styles.flowCard,
                      flowType === 'morning_checkin' && styles.flowCardActive,
                    ]}
                  >
                    <View style={[styles.iconWrapper, flowType === 'morning_checkin' && styles.iconWrapperActive]}>
                      <Sun size={24} color={flowType === 'morning_checkin' ? colors.light.warning : colors.light.textSecondary} />
                    </View>
                    <Text style={styles.flowCardTitle}>Morning</Text>
                    <Text style={styles.flowCardDesc}>Establish positive daily intentions and focus.</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Visualizer & Timer Area */}
            <View style={styles.visualizerContainer}>
              {isRecording ? (
                <View style={styles.recordingStatusContainer}>
                  <Text style={styles.timerText}>{formatTime(duration)}</Text>
                  <Text style={styles.recordingLabel}>Listening to your thoughts...</Text>
                  
                  {isSilent && (
                    <View style={styles.silenceWarning}>
                      <AlertCircle size={14} color="#F59E0B" />
                      <Text style={styles.silenceWarningText}>Silence detected. Tap to finish.</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>What's on your mind?</Text>
                  <Text style={styles.welcomeSubtext}>
                    Select a mode, then tap the mic below to start. Your audio is analyzed inside a secure enclave and deleted immediately.
                  </Text>
                </View>
              )}

              {/* Real-time/Idle Waveform */}
              <WaveformVisualizer isRecording={isRecording} metering={metering} />
            </View>

            {/* Interaction Button */}
            <View style={styles.buttonContainer}>
              <VoiceButton isRecording={isRecording} onPress={handleRecordPress} />
              <Text style={styles.buttonLabel}>
                {isRecording ? 'Tap to complete' : 'Tap to start speaking'}
              </Text>
            </View>
          </View>
        )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shellContent: {
    flex: 1,
    paddingBottom: 100,
  },
  teeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.badge,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.light.primaryLight,
    gap: 6,
  },
  teeBadgeText: {
    fontSize: 11,
    color: colors.light.badgeText,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  selectorSection: {
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 12,
  },
  flowSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  flowCard: {
    flex: 1,
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'flex-start',
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  flowCardActive: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.primaryMuted,
    borderWidth: 1.5,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.light.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrapperActive: {
    backgroundColor: colors.light.primaryLight,
  },
  flowCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  flowCardDesc: {
    fontSize: 11,
    color: colors.light.textSecondary,
    lineHeight: 15,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  recordingStatusContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.light.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  recordingLabel: {
    fontSize: 14,
    color: colors.light.error,
    fontWeight: '600',
    marginTop: 8,
  },
  silenceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginTop: 10,
    gap: 6,
  },
  silenceWarningText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '500',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonLabel: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: '600',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 16,
    letterSpacing: -0.3,
  },
  loadingSubtext: {
    fontSize: 15,
    color: colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
});
