import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SessionProvider } from '@/lib/session';
import { useSession } from '@/lib/session';

export const unstable_settings = {
  anchor: 'index',
};

function RootNavigator() {
  const { user, guest, loading } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key || loading) {
      return;
    }

    const inTabs = segments[0] === '(tabs)';

    if (!user && !guest && inTabs) {
      router.replace('/');
      return;
    }

    if ((user || guest) && !inTabs) {
      router.replace('/(tabs)/home');
    }
  }, [guest, loading, rootNavigationState?.key, router, segments, user]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="model" options={{ presentation: 'model', title: 'Model' }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 10, 20, 0.35)',
  },
});
