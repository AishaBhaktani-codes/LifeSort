import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn, SharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { images } from '../../constants/images';

const { width: SCREEN_W } = Dimensions.get('window');

interface HeroDecorProps {
  variant?: 'login' | 'dashboard';
  scrollOffset?: SharedValue<number>;
}

export function HeroDecor({ variant = 'login', scrollOffset }: HeroDecorProps) {
  
  const plantStyle = useAnimatedStyle(() => {
    if (!scrollOffset) return {};
    const translateY = interpolate(scrollOffset.value, [0, 500], [0, -100], Extrapolation.CLAMP);
    return { transform: [{ translateY }, { rotate: '-12deg' }] };
  });

  const headphonesStyle = useAnimatedStyle(() => {
    if (!scrollOffset) return {};
    const translateY = interpolate(scrollOffset.value, [0, 500], [0, -40], Extrapolation.CLAMP);
    return { transform: [{ translateY }, { rotate: '8deg' }] };
  });

  const workspaceStyle = useAnimatedStyle(() => {
    if (!scrollOffset) return {};
    const translateY = interpolate(scrollOffset.value, [0, 500], [0, -70], Extrapolation.CLAMP);
    return { transform: [{ translateY }, { rotate: '4deg' }] };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        entering={FadeIn.delay(400).duration(800)}
        style={[styles.decor, styles.plant, plantStyle]}
      >
        <Image
          source={{ uri: images.decor.plant }}
          style={styles.decorImage}
          contentFit="cover"
        />
      </Animated.View>
      <Animated.View
        entering={FadeIn.delay(550).duration(800)}
        style={[styles.decor, styles.headphones, headphonesStyle]}
      >
        <Image
          source={{ uri: images.decor.headphones }}
          style={styles.decorImage}
          contentFit="cover"
        />
      </Animated.View>
      {variant === 'dashboard' && (
        <Animated.View
          entering={FadeIn.delay(650).duration(800)}
          style={[styles.decor, styles.workspace, workspaceStyle]}
        >
          <Image
            source={{ uri: images.decor.workspace }}
            style={styles.decorImageWide}
            contentFit="cover"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  decor: {
    position: 'absolute',
    borderRadius: 16,
    overflow: 'hidden',
    opacity: 0.35,
  },
  decorImage: {
    width: '100%',
    height: '100%',
  },
  decorImageWide: {
    width: '100%',
    height: '100%',
  },
  plant: {
    width: 72,
    height: 72,
    top: 60,
    left: -12,
    transform: [{ rotate: '-12deg' }],
  },
  headphones: {
    width: 80,
    height: 80,
    top: 48,
    right: -8,
    transform: [{ rotate: '8deg' }],
  },
  workspace: {
    width: Math.min(120, SCREEN_W * 0.28),
    height: 80,
    bottom: 120,
    right: 12,
    opacity: 0.25,
    transform: [{ rotate: '4deg' }],
  },
});
