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
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
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
  const { loginWithEmail, loginWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    await loginWithEmail(email.trim(), password);
  };

  return (
    <ScreenShell 
      scroll 
      contentStyle={styles.webContainer}
      scrollProps={{ 
        keyboardShouldPersistTaps: 'handled',
        onScroll: scrollHandler,
        scrollEventThrottle: 16
      }}
    >
      <HeroDecor variant="login" scrollOffset={scrollOffset} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
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
          <FadeInView delay={120} style={styles.badgeWrap}>
            <PillBadge variant="blue">Trusted voice-first life companion</PillBadge>
          </FadeInView>

          <SectionHeading
            delay={160}
            centered
            title="Sort your life, on time"
            subtitle="Speak naturally. LifeSort turns your thoughts into tasks, mood insights, and gentle reminders — with no clutter."
          />

          <FadeInView delay={240} style={styles.buttonWrap}>
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

          <FadeInView delay={380} style={styles.stackWrap}>
            <SessionPreviewStack scrollOffset={scrollOffset} />
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
              variant="dark"
              onPress={handleLogin}
              disabled={loading}
              style={styles.signInBtn}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <PrimaryButton
              label="Continue with Google"
              variant="primary"
              onPress={loginWithGoogle}
              disabled={loading}
              style={styles.googleBtn}
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
  webContainer: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  heroImageWrap: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 32, // Acctual style larger radius
    overflow: 'hidden',
    height: 260, // Taller image for better parallax effect
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  badgeWrap: {
    alignItems: 'center', // Center badge for Acctual style
    marginBottom: 24,
  },
  buttonWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  stackWrap: {
    alignItems: 'center',
  },
  features: {
    marginTop: 48,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    // Add Acctual card shadow to features
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 4,
  },
  form: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: colors.light.borderLight,
  },
  formLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '800',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FAFBFC',
    borderWidth: 1,
    borderColor: colors.light.borderLight,
    borderRadius: 9999, // Pill shaped inputs!
    paddingHorizontal: 24,
    paddingVertical: 18,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 12,
  },
  signInBtn: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light.borderLight,
  },
  dividerText: {
    paddingHorizontal: 10,
    color: colors.light.textMuted,
    fontSize: 14,
  },
  googleBtn: {
    marginBottom: 8,
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  link: {
    fontSize: 15,
    color: colors.light.textSecondary,
  },
  linkBold: {
    color: colors.light.cta,
    fontWeight: '800',
  },
});
