import SafeArea from '@/components/SafeArea';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Toast from "react-native-toast-message";

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode, getColors } = useThemeStore();
  
  const colors = getColors();
  
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={isDarkMode ? customDarkTheme : customTheme}>
      <SafeArea>
        <Toast />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(root)" options={{ animation: 'fade' }} />
        </Stack>
      </SafeArea>
    </ThemeProvider>
  );
}