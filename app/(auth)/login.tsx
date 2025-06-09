import appLogo from "@/assets/images/revenue-i4.png";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as Yup from "yup";

const { width, height } = Dimensions.get('window');

const loginSchema = Yup.object().shape({
  username: Yup.string(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;
  const errorShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(errorShakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    setLoginError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://grain-backend.onrender.com/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Invalid username or password");
        shakeError();
        return;
      }

      if (data?.token && data?.user) {
        await AsyncStorage.setItem("value", JSON.stringify(data));
        // Success animation could be added here
        router.replace("/dashboard");
      } else {
        setLoginError("Unexpected response from server. Please try again.");
        shakeError();
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        "Network error. Please check your connection and try again."
      );
      shakeError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Background gradient effect */}
            <View style={styles.backgroundGradient} />
            
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: logoScaleAnim }]
                }
              ]}
            >
              <View style={styles.logoWrapper}>
                <Image source={{ uri: appLogo.uri }} style={styles.logo} />
                <View style={styles.logoGlow} />
              </View>
              <Text style={styles.logoText}>Grain Technik</Text>
              <Text style={styles.logoSubtext}>Premium Solutions</Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.formContainer,
                {
                  transform: [{ translateY: formSlideAnim }]
                }
              ]}
            >
              <View style={styles.welcomeSection}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue your journey</Text>
              </View>

              {loginError ? (
                <Animated.View 
                  style={[
                    styles.errorContainer,
                    {
                      transform: [{ translateX: errorShakeAnim }]
                    }
                  ]}
                >
                  <Text style={styles.errorText}>{loginError}</Text>
                </Animated.View>
              ) : null}

              <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={handleLogin}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <View style={styles.form}>
                    <View style={styles.inputContainer}>
                      <Input
                        label="Username"
                        placeholder="Enter your username"
                        autoCapitalize="none"
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        value={values.username}
                        error={touched.username && errors.username || ''}
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Input
                        label="Password"
                        placeholder="Enter your password"
                        secureTextEntry
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        error={touched.password && errors.password || ''}
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.buttonContainer}>
                      <Button
                        title="Sign In"
                        onPress={() => handleSubmit()}
                        isLoading={isSubmitting || isLoading}
                        style={styles.loginButton}
                      />
                    </View>
                  </View>
                )}
              </Formik>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Secure • Reliable • Fast
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.coffeeTheme.background,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: Platform.OS === 'ios' ? 80 : 60,
    marginBottom: 60,
    zIndex: 1,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 80,
    backgroundColor: '#4f46e5',
    opacity: 0.1,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#a5b4fc',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  formContainer: {
    paddingHorizontal: 32,
    flex: 1,
    backgroundColor: Colors.coffeeTheme.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  welcomeSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color:"black"
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: Colors.coffeeTheme.primary,
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});