import { create } from 'zustand';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  isHapticEnabled: boolean;
  isSilenceAutoPauseEnabled: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setHapticEnabled: (enabled: boolean) => void;
  setSilenceAutoPauseEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  isHapticEnabled: true,
  isSilenceAutoPauseEnabled: true,
  setTheme: (theme) => set({ theme }),
  setHapticEnabled: (isHapticEnabled) => set({ isHapticEnabled }),
  setSilenceAutoPauseEnabled: (isSilenceAutoPauseEnabled) => set({ isSilenceAutoPauseEnabled }),
}));
