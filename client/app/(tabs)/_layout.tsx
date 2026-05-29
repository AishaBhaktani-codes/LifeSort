import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Home, Mic, History, Smile, Settings } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/authStore';
import { colors } from '../../src/constants/colors';

export default function TabLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.light.primary,
        tabBarInactiveTintColor: colors.light.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="conversation"
        options={{
          title: 'Voice',
          tabBarIcon: ({ color, size }) => (
            <Mic size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Mood',
          tabBarIcon: ({ color, size }) => (
            <Smile size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 24 : 16,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.light.borderLight,
    paddingBottom: 0,
    paddingTop: 8,
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabItem: {
    paddingVertical: 4,
  },
});
