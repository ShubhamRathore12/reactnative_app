import { Colors } from "@/constants/Colors";
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

export default function SplashScreen({ isLoading = false, user = null }) {
  const router = useRouter();

  useEffect(() => {
    const redirectAfterSplash = () => {
      setTimeout(() => {
       
          router.replace("/login");
        
      }, 2000);
    };

    if (!isLoading) {
      redirectAfterSplash();
    }
  }, [isLoading, user, router]);

  const Content = () => (
    <Animated.View
      entering={FadeIn.duration(1000)}
      style={styles.logoContainer}
    >
      <Image source={Logo} style={styles.logo} />
      <Animated.Text entering={FadeIn.delay(500)} style={styles.appName}>
        Grain Technik
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(700)} style={styles.tagline}>
        Each grain matters
      </Animated.Text>
    </Animated.View>
  );

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, styles.webGradient]}>
        <Content />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.nativeGradient]}>
      <Content />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webGradient: {
    backgroundColor: Colors.coffeeTheme.background,
    justifyContent: "center",
    alignItems: "center",
  },
  nativeGradient: {
    backgroundColor: "#1E3A8A",
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
    color: Colors.coffeeTheme.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.coffeeTheme.textLight,
    fontWeight: "500",
  },
});
