import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Mic, Square } from 'lucide-react-native';
import { colors } from '../../constants/colors';

interface VoiceButtonProps {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const BUTTON_SIZE = 84;

export function VoiceButton({ isRecording, onPress, disabled = false }: VoiceButtonProps) {
  const scale = useSharedValue(1);
  const glowScale1 = useSharedValue(1);
  const glowOpacity1 = useSharedValue(0);
  const glowScale2 = useSharedValue(1);
  const glowOpacity2 = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      // Glow ring 1 animation loop
      glowScale1.value = withRepeat(
        withTiming(1.8, {
          duration: 1600,
          easing: Easing.out(Easing.quad),
        }),
        -1,
        false
      );
      glowOpacity1.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 200 }),
          withTiming(0, { duration: 1400, easing: Easing.out(Easing.quad) })
        ),
        -1,
        false
      );

      // Glow ring 2 (staggered delay)
      glowScale2.value = withDelay(
        800,
        withRepeat(
          withTiming(1.8, {
            duration: 1600,
            easing: Easing.out(Easing.quad),
          }),
          -1,
          false
        )
      );
      glowOpacity2.value = withDelay(
        800,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 200 }),
            withTiming(0, { duration: 1400, easing: Easing.out(Easing.quad) })
          ),
          -1,
          false
        )
      );

      // Main button pulse
      scale.value = withRepeat(
        withTiming(1.08, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      // Return to normal
      glowScale1.value = withTiming(1, { duration: 300 });
      glowOpacity1.value = withTiming(0, { duration: 300 });
      glowScale2.value = withTiming(1, { duration: 300 });
      glowOpacity2.value = withTiming(0, { duration: 300 });
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    }
  }, [isRecording]);

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9, { damping: 8, stiffness: 120 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    if (!isRecording) {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glow1Style = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale1.value }],
    opacity: glowOpacity1.value,
  }));

  const glow2Style = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale2.value }],
    opacity: glowOpacity2.value,
  }));

  return (
    <View style={styles.container}>
      {/* Outer Pulse Rings */}
      <Animated.View style={[styles.glowRing, glow1Style]} />
      <Animated.View style={[styles.glowRing, glow2Style]} />

      {/* Main Interactive Button */}
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          isRecording ? styles.pressableActive : styles.pressableInactive,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View style={[styles.buttonInner, buttonAnimatedStyle]}>
          {isRecording ? (
            <Square size={32} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Mic size={36} color="#FFFFFF" />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: BUTTON_SIZE * 2,
    height: BUTTON_SIZE * 2,
  },
  glowRing: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#10B981',
  },
  pressable: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  pressableInactive: {
    backgroundColor: '#10B981',
  },
  pressableActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonInner: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
