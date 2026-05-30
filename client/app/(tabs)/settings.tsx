import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Bell, Lock, Moon, LogOut, ChevronRight, User as UserIcon, Save } from 'lucide-react-native';
import {
  ScreenShell,
  FloatingHeader,
  SectionHeading,
  SurfaceCard,
  FadeInView,
  PrimaryButton,
} from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { useAuthStore } from '../../src/store/authStore';
import { useProfile } from '../../src/hooks/useProfile';
import { colors } from '../../src/constants/colors';

const SETTINGS_ROWS = [
  { icon: Bell, label: 'Reminders', desc: 'Gentle nudges for tasks and check-ins' },
  { icon: Lock, label: 'TEE encryption', desc: 'On-device secure processing' },
  { icon: Moon, label: 'Appearance', desc: 'Light mode (dark coming soon)' },
] as const;

export default function SettingsScreen() {
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const { profile, loading, fetchProfile, updateProfile } = useProfile();
  
  const [reminders, setReminders] = useState(true);
  
  // Editable profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTone, setEditTone] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.displayName || '');
      setEditTone(profile.preferences?.companionTone || 'Empathetic & supportive');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    await updateProfile({
      displayName: editName,
      preferences: {
        ...profile?.preferences,
        companionTone: editTone,
      }
    });
    setIsEditing(false);
  };

  return (
    <ScreenShell scroll={true} header={<FloatingHeader title="LifeSort" />}>
      <View style={styles.content}>
        <SectionHeading
          delay={60}
          title="Profile & Settings"
          subtitle="Configure your details and companion behavior."
          size="md"
        />

        {loading && !profile ? (
          <ActivityIndicator color={colors.light.primary} style={{ marginVertical: 20 }} />
        ) : (
          <FadeInView delay={80}>
            <SurfaceCard style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </Text>
                </View>
                {!isEditing && (
                  <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </Pressable>
                )}
              </View>
              
              <View style={styles.profileInfo}>
                {isEditing ? (
                  <View style={styles.editForm}>
                    <Text style={styles.inputLabel}>Display Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="What should I call you?"
                      placeholderTextColor={colors.light.textMuted}
                    />
                    
                    <Text style={styles.inputLabel}>AI Companion Tone</Text>
                    <TextInput
                      style={styles.input}
                      value={editTone}
                      onChangeText={setEditTone}
                      placeholder="e.g., Professional, Casual, Direct..."
                      placeholderTextColor={colors.light.textMuted}
                    />
                    
                    <View style={styles.formActions}>
                      <PrimaryButton
                        label="Save Changes"
                        onPress={handleSaveProfile}
                        disabled={loading}
                        style={{ flex: 1 }}
                      />
                      <Pressable 
                        style={styles.cancelBtn} 
                        onPress={() => {
                          setIsEditing(false);
                          setEditName(profile?.displayName || '');
                          setEditTone(profile?.preferences?.companionTone || '');
                        }}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text style={styles.profileEmail}>{profile?.displayName || user?.email || 'User'}</Text>
                    <Text style={styles.profileStatus}>
                      Tone: {profile?.preferences?.companionTone || 'Default (Empathetic)'}
                    </Text>
                    <Text style={styles.profileMuted}>{user?.email}</Text>
                  </>
                )}
              </View>
            </SurfaceCard>
          </FadeInView>
        )}

        <Text style={styles.sectionLabel}>App Preferences</Text>
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
                      trackColor={{ false: colors.light.border, true: colors.light.primaryLight }}
                      thumbColor={reminders ? colors.light.primary : '#f4f3f4'}
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
        
        <View style={{ height: 40 }} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 12,
  },
  profileCard: {
    padding: 20,
    marginBottom: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.primaryDark,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.light.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  profileInfo: {},
  profileEmail: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  profileMuted: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  editForm: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.light.text,
    backgroundColor: colors.light.surfaceElevated,
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.textSecondary,
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
    marginTop: 30,
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
});
