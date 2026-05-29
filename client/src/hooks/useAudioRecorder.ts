import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0); // in seconds
  const [metering, setMetering] = useState<number[]>([]);
  const [isSilent, setIsSilent] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const silenceCounterRef = useRef<number>(0);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Check and request microphone permissions on mount
    (async () => {
      const { status } = await Audio.getPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
      } else {
        const request = await Audio.requestPermissionsAsync();
        setHasPermission(request.status === 'granted');
      }
    })();

    return () => {
      cleanupRecording();
    };
  }, []);

  const cleanupRecording = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(() => {});
      recordingRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      if (!hasPermission) {
        const request = await Audio.requestPermissionsAsync();
        setHasPermission(request.status === 'granted');
        if (request.status !== 'granted') {
          alert('Microphone permission is required to record audio.');
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Clear previous recording state
      cleanupRecording();
      setDuration(0);
      setMetering([]);
      setIsSilent(false);
      silenceCounterRef.current = 0;

      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Start recording with high quality options and 100ms update interval for metering
      const { recording } = await Audio.Recording.createAsync(
        {
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        },
        (status) => {
          if (status.metering !== undefined) {
            // Convert dB metering (typically -160 to 0) to a normalized value between 0.05 and 1
            const db = status.metering;
            const amplitude = Math.max(0.05, Math.pow(10, db / 20));
            
            setMetering((prev) => {
              const updated = [...prev, amplitude];
              // Keep the last 40 elements for the waveform visualization
              if (updated.length > 40) {
                return updated.slice(updated.length - 40);
              }
              return updated;
            });

            // Silence detection: amplitude < 0.08 (roughly -40dB to -45dB)
            const isFrameSilent = amplitude < 0.08;
            if (isFrameSilent) {
              silenceCounterRef.current += 1;
              // 20 frames * 100ms = 2 seconds of silence
              if (silenceCounterRef.current >= 20) {
                setIsSilent(true);
              }
            } else {
              silenceCounterRef.current = 0;
              setIsSilent(false);
            }
          }
        },
        100
      );

      recordingRef.current = recording;
      setIsRecording(true);

      // Track duration in seconds
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording', err);
      cleanupRecording();
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return null;

    try {
      setIsRecording(false);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const recording = recordingRef.current;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      recordingRef.current = null;
      return {
        uri,
        durationSeconds: duration,
        metering,
      };
    } catch (err) {
      console.error('Failed to stop recording', err);
      return null;
    }
  };

  return {
    isRecording,
    duration,
    metering,
    isSilent,
    hasPermission,
    startRecording,
    stopRecording,
  };
}
