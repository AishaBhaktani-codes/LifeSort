import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('AsyncStorage read error:', e);
      return null;
    }
  },
  set: async (key: string, value: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('AsyncStorage write error:', e);
      return false;
    }
  },
  remove: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('AsyncStorage delete error:', e);
      return false;
    }
  },
};
