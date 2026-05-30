import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { animations } from '../../constants/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'dark' | 'primary';
  style?: ViewStyle;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'dark',
  style,
  disabled = false,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDark = variant === 'dark';

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.95, animations.springConfig.bouncy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, animations.springConfig.smooth);
      }}
      style={[
        styles.button,
        isDark ? styles.buttonDark : styles.buttonPrimary,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      <Text style={[styles.label, isDark ? styles.labelDark : styles.labelPrimary]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 9999, // Pill shape
    alignItems: 'center',
    justifyContent: 'center',
    // Removed massive shadow for a flatter, modern Acctual look
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDark: {
    backgroundColor: colors.light.cta,
  },
  buttonPrimary: {
    backgroundColor: colors.light.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  labelDark: {
    color: colors.light.ctaText,
  },
  labelPrimary: {
    color: colors.light.ctaText,
  },
  disabled: {
    opacity: 0.5,
  },
});
