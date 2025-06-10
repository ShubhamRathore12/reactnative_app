import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Logo from "../assets/images/logo1.jpeg";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { getColors } = useThemeStore();
  const colors = getColors();

  useEffect(() => {
    const redirectAfterSplash = () => {
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/(root)/dashboard");
        } else {
          router.replace("/(auth)/login");
        }
      }, 2000);
    };

    redirectAfterSplash();
  }, [isAuthenticated, router]);

  const Content = () => (
    <Animated.View
      entering={FadeIn.duration(1000)}
      style={styles.logoContainer}
    >
      <Image source={Logo} style={styles.logo} />
      <Animated.Text entering={FadeIn.delay(500)} style={[styles.appName, { color: colors.text }]}>
        Grain Technik
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(700)} style={[styles.tagline, { color: colors.textLight }]}>
        Each grain matters
      </Animated.Text>
    </Animated.View>
  );

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Content />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Content />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
  },
});