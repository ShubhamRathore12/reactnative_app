"use client"

import type React from "react"

import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [cardAnimations, setCardAnimations] = useState([false, false, false])

  // Trigger animations after initial render
  useEffect(() => {
    setAnimateIn(true)

    // Staggered card animations
    const timeouts = cardAnimations.map((_, index) => {
      return setTimeout(
        () => {
          setCardAnimations((prev) => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        },
        200 + index * 150,
      )
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      // Shake animation for error
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 2000)
  }

  const handleContactMethod = (type: "email" | "phone" | "location") => {
    switch (type) {
      case "email":
        Linking.openURL("mailto:hello@company.com")
        break
      case "phone":
        Linking.openURL("tel:+1234567890")
        break
      case "location":
        Linking.openURL("https://maps.google.com/?q=123+Business+St,+City,+State")
        break
    }
  }

  const ContactCard = ({
    children,
    index,
    onPress,
  }: {
    children: React.ReactNode
    index: number
    onPress: () => void
  }) => {
    const [isPressed, setIsPressed] = useState(false)

    const handlePressIn = () => setIsPressed(true)
    const handlePressOut = () => setIsPressed(false)

    return (
      <View
        style={[
          styles.contactCardWrapper,
          cardAnimations[index] ? styles.cardAnimated : styles.cardHidden,
          isPressed && styles.cardPressed,
        ]}
      >
        <TouchableOpacity
          style={styles.contactCard}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {children}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, animateIn ? styles.headerAnimated : styles.headerHidden]}>
          <Text style={styles.title}>Get in Touch</Text>
          <Text style={styles.subtitle}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactMethods}>
          <ContactCard index={0} onPress={() => handleContactMethod("email")}>
            <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="mail" size={24} color="white" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactDetail}>hello@company.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </ContactCard>

          <ContactCard index={1} onPress={() => handleContactMethod("phone")}>
            <View style={[styles.iconContainer, { backgroundColor: "#10B981" }]}>
              <Ionicons name="call" size={24} color="white" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Phone</Text>
              <Text style={styles.contactDetail}>+1 (234) 567-8900</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </ContactCard>

          <ContactCard index={2} onPress={() => handleContactMethod("location")}>
            <View style={[styles.iconContainer, { backgroundColor: "#F59E0B" }]}>
              <Ionicons name="location" size={24} color="white" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Office</Text>
              <Text style={styles.contactDetail}>123 Business St, City, State</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </ContactCard>
        </View>

        {/* Contact Form */}
        <View
          style={[styles.formContainer, animateIn ? styles.formAnimated : styles.formHidden, shake && styles.formShake]}
        >
          <Text style={styles.formTitle}>Send us a message</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <View style={[styles.inputWrapper, focusedInput === "name" && styles.inputFocused]}>
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                placeholderTextColor="#9CA3AF"
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <View style={[styles.inputWrapper, focusedInput === "email" && styles.inputFocused]}>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <View style={[styles.inputWrapper, focusedInput === "subject" && styles.inputFocused]}>
              <TextInput
                style={styles.input}
                placeholder="What's this about?"
                value={formData.subject}
                onChangeText={(value) => handleInputChange("subject", value)}
                placeholderTextColor="#9CA3AF"
                onFocus={() => setFocusedInput("subject")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message *</Text>
            <View style={[styles.inputWrapper, focusedInput === "message" && styles.inputFocused]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChangeText={(value) => handleInputChange("message", value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                onFocus={() => setFocusedInput("message")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.submitButtonWrapper}>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonLoading]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>{isSubmitting ? "Sending..." : "Send Message"}</Text>
              {isSubmitting ? (
                <View style={styles.loadingIcon}>
                  <Ionicons name="refresh" size={20} color="white" style={{ marginLeft: 8 }} />
                </View>
              ) : (
                <Ionicons name="send" size={20} color="white" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Success Message */}
        {showSuccess && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.successText}>Message sent successfully!</Text>
          </View>
        )}

        {/* Business Hours */}
        <View style={[styles.businessHours, animateIn ? styles.businessHoursAnimated : styles.businessHoursHidden]}>
          <Text style={styles.businessHoursTitle}>Business Hours</Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hourRow}>
              <Text style={styles.dayText}>Monday - Friday</Text>
              <Text style={styles.timeText}>9:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hourRow}>
              <Text style={styles.dayText}>Saturday</Text>
              <Text style={styles.timeText}>10:00 AM - 4:00 PM</Text>
            </View>
            <View style={styles.hourRow}>
              <Text style={styles.dayText}>Sunday</Text>
              <Text style={styles.timeText}>Closed</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",

  },
  headerHidden: {
    opacity: 0,
    transform: [{ translateY: 50 }, { scale: 0.9 }],
  },
  headerAnimated: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  contactMethods: {
    padding: 24,
    gap: 16,
  },
  contactCardWrapper: {
   
    marginBottom: 16,
  },
  cardHidden: {
    opacity: 0,
    transform: [{ translateY: 50 }],
  },
  cardAnimated: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  cardPressed: {
    transform: [{ scale: 0.95 }],
  },
  contactCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: "#6B7280",
  },
  formContainer: {
    backgroundColor: "white",
    margin: 24,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,

  },
  formHidden: {
    opacity: 0,
    transform: [{ translateY: 100 }],
  },
  formAnimated: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  formShake: {
    animationName: "shake",
    animationDuration: "0.5s",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",

  },
  inputFocused: {
    borderColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    transform: [{ scale: 1.02 }],
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  submitButtonWrapper: {

    transform: [{ scale: 1 }],

  },
  submitButton: {
    backgroundColor: "#3B82F6",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonLoading: {
    backgroundColor: "#6B7280",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingIcon: {
    animationName: "spin",
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  successMessage: {
    backgroundColor: "#ECFDF5",
    margin: 24,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#10B981",
    animationName: "fadeInUp",
    animationDuration: "0.5s",
    animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  successText: {
    color: "#065F46",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  businessHours: {
    backgroundColor: "white",
    margin: 24,
    marginTop: 0,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,

  },
  businessHoursHidden: {
    opacity: 0,
    transform: [{ translateY: 50 }],
  },
  businessHoursAnimated: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  businessHoursTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  hoursContainer: {
    gap: 12,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    color: "#374151",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
})
