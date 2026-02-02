import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SessionProvider } from '@/lib/session';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <SessionProvider>
        <ImageBackground
          source={require('../assets/icons/ChatGPT Image Jan 31, 2026, 09_18_33 PM.png')}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.overlay}>
            <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="light" />
          </View>
        </ImageBackground>
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
