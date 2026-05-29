import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_COUNT = 40;
const CONTAINER_HEIGHT = 120;
const BAR_WIDTH = 4;
const BAR_GAP = 3;
const SVG_WIDTH = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * BAR_GAP;

interface WaveformVisualizerProps {
  isRecording: boolean;
  metering: number[]; // Array of normalized amplitudes (0 to 1)
}

export function WaveformVisualizer({ isRecording, metering }: WaveformVisualizerProps) {
  // Shared value for breathing effect when idle
  const idlePhase = useSharedValue(0);

  useEffect(() => {
    if (!isRecording) {
      // Gentle breathing loop when idle
      idlePhase.value = withRepeat(
        withTiming(1, {
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      idlePhase.value = withTiming(0, { duration: 300 });
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <Svg height={CONTAINER_HEIGHT} width={SVG_WIDTH} viewBox={`0 0 ${SVG_WIDTH} ${CONTAINER_HEIGHT}`}>
        <Defs>
          <LinearGradient id="waveformGrad" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
            <Stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#34D399" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="idleGrad" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor="#64748B" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#94A3B8" stopOpacity="0.5" />
          </LinearGradient>
        </Defs>

        {Array.from({ length: BAR_COUNT }).map((_, index) => {
          return (
            <AnimatedBar
              key={index}
              index={index}
              isRecording={isRecording}
              metering={metering}
              idlePhase={idlePhase}
            />
          );
        })}
      </Svg>
    </View>
  );
}

interface AnimatedBarProps {
  index: number;
  isRecording: boolean;
  metering: number[];
  idlePhase: SharedValue<number>;
}

// Subcomponent to animate each individual bar efficiently
const AnimatedBar = ({ index, isRecording, metering, idlePhase }: AnimatedBarProps) => {
  const heightVal = useSharedValue(8);
  const opacityVal = useSharedValue(0.4);

  useEffect(() => {
    if (isRecording) {
      // Find the corresponding metering value, or fallback to small height
      // metering contains the last 40 values; map index accordingly
      const meteringVal = metering[index] ?? 0.05;
      
      // Calculate target height (max container height is 120, min height is 8)
      const targetHeight = Math.max(8, meteringVal * CONTAINER_HEIGHT);
      
      heightVal.value = withTiming(targetHeight, {
        duration: 100,
        easing: Easing.out(Easing.quad),
      });

      opacityVal.value = withTiming(0.4 + meteringVal * 0.6, { duration: 100 });
    }
  }, [isRecording, metering, index]);

  const animatedProps = useAnimatedStyle(() => {
    let finalHeight = heightVal.value;
    let finalOpacity = opacityVal.value;

    if (!isRecording) {
      // Compute sine-wave based breathing height when idle
      const wave = Math.sin((index / BAR_COUNT) * Math.PI * 2 - idlePhase.value * Math.PI) * 0.5 + 0.5;
      finalHeight = 12 + wave * 16 * idlePhase.value;
      finalOpacity = 0.3 + wave * 0.3 * idlePhase.value;
    }

    const y = (CONTAINER_HEIGHT - finalHeight) / 2;

    return {
      height: finalHeight,
      y,
      opacity: finalOpacity,
    };
  });

  return (
    <AnimatedRect
      x={index * (BAR_WIDTH + BAR_GAP)}
      width={BAR_WIDTH}
      rx={BAR_WIDTH / 2}
      ry={BAR_WIDTH / 2}
      fill={isRecording ? 'url(#waveformGrad)' : 'url(#idleGrad)'}
      animatedStyle={animatedProps}
    />
  );
};

// Creating an Animated wrapper for SVG Rect
const AnimatedRect = Animated.createAnimatedComponent(
  ({
    x,
    width,
    rx,
    ry,
    fill,
    animatedStyle,
  }: {
    x: number;
    width: number;
    rx: number;
    ry: number;
    fill: string;
    animatedStyle: any;
  }) => {
    const style = animatedStyle;
    return (
      <Rect
        x={x}
        width={width}
        rx={rx}
        ry={ry}
        fill={fill}
        y={style.y}
        height={style.height}
        opacity={style.opacity}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
});
