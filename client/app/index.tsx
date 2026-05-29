import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    // A splash screen or simple view could go here while we check auth
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
