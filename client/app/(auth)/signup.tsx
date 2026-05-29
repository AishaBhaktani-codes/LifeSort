import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import {
  ScreenShell,
  PillBadge,
  PrimaryButton,
  SectionHeading,
  FadeInView,
  FloatingHeader,
} from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';

export default function SignupScreen() {
  const { signUpWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email.trim() || !password) return;
    await signUpWithEmail(email.trim(), password);
  };

  return (
    <ScreenShell scroll scrollProps={{ keyboardShouldPersistTaps: 'handled' }}>
      <FloatingHeader logoOnly />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.body}
      >
        <FadeInView delay={80}>
          <PillBadge>Join LifeSort free</PillBadge>
        </FadeInView>

        <SectionHeading
          delay={140}
          title="Create your companion"
          subtitle="Organize tasks, track mood, and talk through your day — all from one calm, secure app."
        />

        <FadeInView delay={220} style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.light.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min 6 characters)"
            placeholderTextColor={colors.light.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <PrimaryButton
            label={loading ? 'Creating account…' : 'Create account'}
            onPress={handleSignUp}
            disabled={loading}
          />
        </FadeInView>

        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.linkWrap}>
            <Text style={styles.link}>
              Already have an account?{' '}
              <Text style={styles.linkBold}>Sign in</Text>
            </Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  form: {
    marginTop: 8,
    gap: 0,
  },
  input: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 12,
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  link: {
    fontSize: 15,
    color: colors.light.textSecondary,
  },
  linkBold: {
    color: colors.light.primary,
    fontWeight: '700',
  },
});
