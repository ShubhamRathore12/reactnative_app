

import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { Formik } from "formik"
import { useState } from "react"
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import * as Yup from "yup"

// Custom components
const Input = ({ 
  label, 
  error, 
  secureTextEntry = false, 
  ...props 
}: {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
  [key: string]: any;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, error && styles.inputWrapperError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            props.onBlur && props.onBlur()
          }}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const Button = ({ title, onPress, isLoading, style }:any) => (
  <TouchableOpacity
    style={[styles.button, style, isLoading && styles.buttonDisabled]}
    onPress={onPress}
    disabled={isLoading}
  >
    {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>{title}</Text>}
  </TouchableOpacity>
)

// Dropdown component
const Dropdown = ({ label, placeholder, options, value, onChange, isOpen, setIsOpen, multiSelect = false, error }:any) => {
  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={[styles.dropdownButton, error && styles.inputWrapperError]} onPress={() => setIsOpen(!isOpen)}>
        <Text
          style={[
            styles.dropdownButtonText,
            (!value || (Array.isArray(value) && value.length === 0)) && styles.placeholderText,
          ]}
        >
          {multiSelect ? (value && value.length > 0 ? value.join(", ") : placeholder) : value || placeholder}
        </Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
      </Pressable>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          {options.map((option:any) => {
            const isSelected = multiSelect ? value && value.includes(option) : value === option

            return (
              <Pressable
                key={option}
                style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                onPress={() => {
                  if (multiSelect) {
                    const newValue =
                      value && value.includes(option)
                        ? value.filter((item:any) => item !== option)
                        : [...(value || []), option]
                    onChange(newValue)
                  } else {
                    onChange(option)
                    setIsOpen(false)
                  }
                }}
              >
                <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextSelected]}>{option}</Text>
                {multiSelect && isSelected && (
                  <Ionicons name="checkmark" size={16} color={Colors.coffeeTheme.primary} />
                )}
              </Pressable>
            )
          })}
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

// Import TextInput
import { TextInput } from "react-native"

interface FormValues {
  accountType: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  company: string
  locations: string
  password: string
  confirmPassword: string
  monitorAccess: string[]
}

// Yup Schema
const validationSchema = Yup.object().shape({
  accountType: Yup.string()
    .oneOf(["Manufacturer", "Customer"], "Please select an account type")
    .required("Please select an account type"),
  firstName: Yup.string().min(2, "First name must be at least 2 characters").required("First name is required"),
  lastName: Yup.string().min(2, "Last name must be at least 2 characters").required("Last name is required"),
  username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  phoneNumber: Yup.string().min(10, "Phone number must be at least 10 digits").required("Phone number is required"),
  company: Yup.string().min(1, "Please select a company").required("Company is required"),
  locations: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one location")
    .required("At least one location is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  monitorAccess: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one monitor access option")
    .required("At least one monitor access is required"),
})

const accountTypes = ["Manufacturer", "Customer"]
const companies = ["Company A", "Company B", "Company C", "Company D"]
const locationsList = ["Location 1", "Location 2", "Location 3", "Location 4"]
const monitorAccessOptions = ["Overview", "Devices", "Dashboards", "Notifications", "Reports", "Analytics"]

export default function RegistrationScreen() {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false)

  // Close other dropdowns when one is opened
  const handleDropdownToggle = (dropdown: string) => {
    if (dropdown === "company") {
      setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
      setIsLocationDropdownOpen(false)
      setIsAccessDropdownOpen(false)
    } else if (dropdown === "location") {
      setIsLocationDropdownOpen(!isLocationDropdownOpen)
      setIsCompanyDropdownOpen(false)
      setIsAccessDropdownOpen(false)
    } else if (dropdown === "access") {
      setIsAccessDropdownOpen(!isAccessDropdownOpen)
      setIsCompanyDropdownOpen(false)
      setIsLocationDropdownOpen(false)
    }
  }

  const initialValues: FormValues = {
    accountType: "Customer",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    company: "",
    locations: "",
    password: "",
    confirmPassword: "",
    monitorAccess: [],
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
    
        monitorAccess: values.monitorAccess,
      }

      const response = await fetch("https://grain-backend.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Success:", data)
        // Handle successful registration
      } else {
        console.error("Registration error:", data.message)
        // Handle registration error
      }
    } catch (error) {
      console.error("Error submitting form", error)
      // Handle network error
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>Fill in your details to register</Text>
          </View>

          <Formik<FormValues> initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
              <View style={styles.form}>
                {/* Account Type */}
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Account Type</Text>
                </View>

                <View style={styles.accountTypeContainer}>
                  {accountTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.accountTypeButton, values.accountType === type && styles.accountTypeButtonActive]}
                      onPress={() => setFieldValue("accountType", type)}
                    >
                      <Ionicons
                        name={type === "Manufacturer" ? "business" : "person"}
                        size={18}
                        color={values.accountType === type ? Colors.coffeeTheme.primary : "#6B7280"}
                        style={styles.accountTypeIcon}
                      />
                      <Text
                        style={[styles.accountTypeText, values.accountType === type && styles.accountTypeTextActive]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.accountType && errors.accountType && (
                  <Text style={styles.errorText}>{errors.accountType}</Text>
                )}

                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Personal Information</Text>
                </View>

                {/* First & Last Name */}
                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Input
                      label="First Name"
                      placeholder="Enter first name"
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      error={touched.firstName ? errors.firstName : undefined}
                    />
                  </View>
                  <View style={styles.formColumn}>
                    <Input
                      label="Last Name"
                      placeholder="Enter last name"
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      error={touched.lastName ? errors.lastName : undefined}
                    />
                  </View>
                </View>

                {/* Username */}
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  error={touched.username ? errors.username : undefined}
                />

                {/* Email */}
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email ? errors.email : undefined}
                  keyboardType="email-address"
                />

                {/* Phone Number */}
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={values.phoneNumber}
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  error={touched.phoneNumber ? errors.phoneNumber : undefined}
                  keyboardType="phone-pad"
                />

                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Organization Details</Text>
                </View>

                {/* Company Dropdown */}
                <Dropdown
                  label="Company"
                  placeholder="Select Company"
                  options={companies}
                  value={values.company}
                  onChange={(value:any) => setFieldValue("company", value)}
                  isOpen={isCompanyDropdownOpen}
                  setIsOpen={() => handleDropdownToggle("company")}
                  error={touched.company ? errors.company : undefined}
                />

                {/* Locations */}
                <Dropdown
                  label="Locations"
                  placeholder="Select Locations"
                  options={locationsList}
                  value={values.locations}
                  onChange={(value:any) => setFieldValue("locations", value)}
                  isOpen={isLocationDropdownOpen}
                  setIsOpen={() => handleDropdownToggle("location")}
                  multiSelect={true}
                  error={touched.locations ? errors.locations : undefined}
                />

                {/* Monitor Access */}
                <Dropdown
                  label="Monitor Access"
                  placeholder="Select Access"
                  options={monitorAccessOptions}
                  value={values.monitorAccess}
                  onChange={(value:any) => setFieldValue("monitorAccess", value)}
                  isOpen={isAccessDropdownOpen}
                  setIsOpen={() => handleDropdownToggle("access")}
                  multiSelect={true}
                  error={touched.monitorAccess ? errors.monitorAccess : undefined}
                />

                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Security</Text>
                </View>

                {/* Password */}
                <Input
                  label="Password"
                  placeholder="Enter password"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={touched.password ? errors.password : undefined}
                />

                {/* Confirm Password */}
                <Input
                  label="Confirm Password"
                  placeholder="Confirm password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                />

                {/* Submit Button */}
                <Button
                  title={isSubmitting ? "Registering..." : "Create Account"}
                  onPress={() => handleSubmit()}
                  isLoading={isSubmitting}
                  style={styles.submitButton}
                />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.coffeeTheme.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
    backgroundColor: Colors.coffeeTheme.primary,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  form: {
    padding: 24,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.coffeeTheme.primary,
    paddingLeft: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  accountTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  accountTypeButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  accountTypeButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  accountTypeIcon: {
    marginRight: 6,
  },
  accountTypeText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  accountTypeTextActive: {
    color: Colors.coffeeTheme.primary,
    fontWeight: "600",
  },
  formRow: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
  formColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: Colors.coffeeTheme.primary,
    backgroundColor: "#FFFFFF",
    shadowColor: Colors.coffeeTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  inputWrapperError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#1F2937",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 4,
    maxHeight: 200,
    zIndex: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemSelected: {
    backgroundColor: "rgba(79, 70, 229, 0.05)",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#1F2937",
  },
  dropdownItemTextSelected: {
    color: Colors.coffeeTheme.primary,
    fontWeight: "500",
  },
  button: {
    height: 56,
    borderRadius: 10,
    backgroundColor: Colors.coffeeTheme.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 24,
  },
})
