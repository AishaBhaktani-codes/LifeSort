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
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScreenShell,
  PillBadge,
  PrimaryButton,
  FeatureRow,
  SectionHeading,
  SessionPreviewStack,
  HeroDecor,
  FadeInView,
} from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/constants/colors';
import { images } from '../../src/constants/images';
import { typography } from '../../src/constants/typography';

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    await loginWithEmail(email.trim(), password);
  };

  return (
    <ScreenShell scroll scrollProps={{ keyboardShouldPersistTaps: 'handled' }}>
      <HeroDecor variant="login" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.heroImageWrap}>
          <FadeInView delay={100}>
            <Image
              source={{ uri: images.hero.calm }}
              style={styles.heroImage}
              contentFit="cover"
              transition={400}
            />
            <LinearGradient
              colors={['transparent', colors.light.background]}
              style={styles.heroGradient}
            />
          </FadeInView>
        </View>

        <View style={styles.body}>
          <FadeInView delay={120}>
            <PillBadge>Trusted voice-first life companion</PillBadge>
          </FadeInView>

          <SectionHeading
            delay={160}
            title="Sort your life, on time"
            subtitle="Speak naturally. LifeSort turns your thoughts into tasks, mood insights, and gentle reminders — with no clutter."
          />

          <FadeInView delay={240}>
            <PrimaryButton
              label="Start speaking"
              onPress={() => router.push('/(auth)/signup')}
            />
          </FadeInView>

          <FadeInView delay={300} style={styles.features}>
            <FeatureRow label="Voice sessions" value="unlimited" />
            <FeatureRow
              label="Mood tracking"
              value="AI-powered"
              highlight="insights"
            />
            <FeatureRow
              label="TEE encryption"
              value="on-device"
              highlight="secure"
            />
          </FadeInView>

          <FadeInView delay={380}>
            <SessionPreviewStack />
          </FadeInView>

          <FadeInView delay={440} style={styles.form}>
            <Text style={styles.formLabel}>Sign in with email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={colors.light.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.light.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <PrimaryButton
              label={loading ? 'Signing in…' : 'Sign in'}
              variant="primary"
              onPress={handleLogin}
              disabled={loading}
              style={styles.signInBtn}
            />
            <Link href="/(auth)/signup" asChild>
              <Pressable style={styles.linkWrap}>
                <Text style={styles.link}>
                  New here? <Text style={styles.linkBold}>Create account</Text>
                </Text>
              </Pressable>
            </Link>
          </FadeInView>
        </View>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroImageWrap: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    height: 180,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  features: {
    marginTop: 20,
    marginBottom: 8,
  },
  form: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.light.borderLight,
  },
  formLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '700',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
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
  signInBtn: {
    marginTop: 4,
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: 16,
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
