import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { Bell, Lock, Moon, LogOut, ChevronRight } from 'lucide-react-native';
import {
  ScreenShell,
  FloatingHeader,
  SectionHeading,
  SurfaceCard,
  FadeInView,
  PrimaryButton,
} from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/constants/colors';

const SETTINGS_ROWS = [
  { icon: Bell, label: 'Reminders', desc: 'Gentle nudges for tasks and check-ins' },
  { icon: Lock, label: 'TEE encryption', desc: 'On-device secure processing' },
  { icon: Moon, label: 'Appearance', desc: 'Light mode (dark coming soon)' },
] as const;

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [reminders, setReminders] = React.useState(true);

  return (
    <ScreenShell header={<FloatingHeader title="LifeSort" />}>
      <View style={styles.content}>
        <SectionHeading
          delay={60}
          title="Settings"
          subtitle="Configure companion behavior and privacy options."
          size="md"
        />

        {SETTINGS_ROWS.map((row, index) => {
          const Icon = row.icon;
          return (
            <FadeInView key={row.label} delay={100 + index * 70}>
              <SurfaceCard style={styles.row}>
                <View style={styles.rowInner}>
                  <View style={styles.iconWrap}>
                    <Icon size={20} color={colors.light.primary} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                    <Text style={styles.rowDesc}>{row.desc}</Text>
                  </View>
                  {row.label === 'Reminders' ? (
                    <Switch
                      value={reminders}
                      onValueChange={setReminders}
                      trackColor={{
                        false: colors.light.border,
                        true: colors.light.primaryLight,
                      }}
                      thumbColor={
                        reminders ? colors.light.primary : '#f4f3f4'
                      }
                    />
                  ) : (
                    <ChevronRight size={18} color={colors.light.textMuted} />
                  )}
                </View>
              </SurfaceCard>
            </FadeInView>
          );
        })}

        <FadeInView delay={360} style={styles.logoutSection}>
          <Pressable onPress={logout}>
            <View style={styles.logoutRow}>
              <LogOut size={18} color={colors.light.error} />
              <Text style={styles.logoutText}>Sign out</Text>
            </View>
          </Pressable>
        </FadeInView>

        <FadeInView delay={420}>
          <PrimaryButton
            label="Send feedback"
            variant="primary"
            style={styles.feedbackBtn}
          />
        </FadeInView>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  row: {
    marginBottom: 10,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.light.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  rowDesc: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  logoutSection: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.error,
  },
  feedbackBtn: {
    marginTop: 16,
  },
});
