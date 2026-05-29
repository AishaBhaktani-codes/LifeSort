import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConversationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Conversation</Text>
      <Text style={styles.subtitle}>Tap to speak to your life companion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },
});
