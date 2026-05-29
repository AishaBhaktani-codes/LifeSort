import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, SafeAreaView } from 'react-native';
import { Lock, Brain, Flame, Sun, AlertCircle } from 'lucide-react-native';
import { useAudioRecorder } from '../../src/hooks/useAudioRecorder';
import { useConversation } from '../../src/hooks/useConversation';
import {
  VoiceButton,
  WaveformVisualizer,
  SessionResultsView,
} from '../../src/components/voice';
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
  if (activeTranscript && activeAiResponse) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>LifeSort</Text>
              <Text style={styles.headerSubtitle}>Conversational Companion</Text>
            </View>
            <View style={styles.teeBadge}>
              <Lock size={12} color="#10B981" />
              <Text style={styles.teeBadgeText}>TEE Encrypted</Text>
            </View>
          </View>

          <SessionResultsView
            transcript={activeTranscript}
            aiResponse={activeAiResponse}
            tasks={activeTasks}
            mood={activeMood}
            onClear={clearActiveSession}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>LifeSort</Text>
            <Text style={styles.headerSubtitle}>Conversational Companion</Text>
          </View>
          <View style={styles.teeBadge}>
            <Lock size={12} color="#10B981" />
            <Text style={styles.teeBadgeText}>TEE Encrypted</Text>
          </View>
        </View>

        {/* Processing State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Processing Audio Securely...</Text>
            <Text style={styles.loadingSubtext}>
              TEE encrypts your thoughts on-device. Generating empathetic insights and extracting tasks.
            </Text>
          </View>
        ) : (
          <View style={styles.mainContent}>
            {/* Mode / Flow Selector (Only visible when not recording) */}
            {!isRecording && (
              <View style={styles.selectorSection}>
                <Text style={styles.sectionLabel}>Select Conversation Mode</Text>
                
                <View style={styles.flowSelector}>
                  <Pressable
                    onPress={() => setFlowType('brain_dump')}
                    style={[
                      styles.flowCard,
                      flowType === 'brain_dump' && styles.flowCardActive,
                    ]}
                  >
                    <View style={[styles.iconWrapper, flowType === 'brain_dump' && styles.iconWrapperActive]}>
                      <Brain size={24} color={flowType === 'brain_dump' ? '#10B981' : '#64748B'} />
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
                      <Flame size={24} color={flowType === 'quick_vent' ? '#14B8A6' : '#64748B'} />
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
                      <Sun size={24} color={flowType === 'morning_checkin' ? '#F59E0B' : '#64748B'} />
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  teeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  teeBadgeText: {
    fontSize: 12,
    color: '#047857',
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  flowSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  flowCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-start',
    elevation: 1,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  flowCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrapperActive: {
    backgroundColor: '#D1FAE5',
  },
  flowCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  flowCardDesc: {
    fontSize: 11,
    color: '#64748B',
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
    color: '#1F2937',
    fontVariant: ['tabular-nums'],
  },
  recordingLabel: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 8,
  },
  silenceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 14,
    color: '#64748B',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
});
