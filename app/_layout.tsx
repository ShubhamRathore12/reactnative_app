import SafeArea from '@/components/SafeArea';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Toast from "react-native-toast-message";
 // ⛔ prevent splash from hiding automatically

export default function RootLayout() {
  const colorScheme = useColorScheme();

 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeArea>
      <Toast />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        </Stack>
      </SafeArea>
    </ThemeProvider>
  );
}
