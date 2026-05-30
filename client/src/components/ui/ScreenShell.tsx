import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

interface ScreenShellProps {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  header?: ReactNode;
  scrollProps?: ScrollViewProps;
}

export function ScreenShell({
  children,
  scroll = true,
  contentStyle,
  header,
  scrollProps,
}: ScreenShellProps) {
  const body = (
    <View style={[styles.content, contentStyle]}>
      {header}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {scroll ? (
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          {...scrollProps}
        >
          {body}
        </Animated.ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
  },
});
