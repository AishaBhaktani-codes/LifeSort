import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { animations } from '../../constants/animations';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle;
  /** Use fade-only (no vertical slide) for subtle elements */
  subtle?: boolean;
}

export function FadeInView({
  children,
  delay = 0,
  style,
  subtle = false,
}: FadeInViewProps) {
  const entering = subtle
    ? FadeIn.delay(delay).duration(animations.duration.reveal)
    : FadeInUp.delay(delay)
        .duration(animations.duration.reveal)
        .springify()
        .damping(animations.springConfig.smooth.damping);

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
