import { Redirect } from 'expo-router';

export default function Index() {
  // Direct entry points redirect to the auth screen by default.
  // In a real flow, this would check if the user is authenticated.
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
