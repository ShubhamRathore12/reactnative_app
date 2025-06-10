import { useAuthStore } from '@/store/authStore';
import { ThemeType, useThemeStore } from '@/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const themeOptions: { key: ThemeType; name: string; colors: string[] }[] = [
  {
    key: 'coffeeTheme',
    name: 'Coffee Theme',
    colors: ['#8B593E', '#FFF8F3', '#4A3428'],
  },
  {
    key: 'forestTheme',
    name: 'Forest Theme',
    colors: ['#2E7D32', '#E8F5E9', '#1B5E20'],
  },
  {
    key: 'purpleTheme',
    name: 'Purple Theme',
    colors: ['#6A1B9A', '#F3E5F5', '#4A148C'],
  },
  {
    key: 'oceanTheme',
    name: 'Ocean Theme',
    colors: ['#0277BD', '#E1F5FE', '#01579B'],
  },
];

export default function SettingsScreen() {
  const { 
    currentTheme, 
    isDarkMode, 
    setTheme, 
    toggleDarkMode, 
    getColors 
  } = useThemeStore();
  const { user, logout } = useAuthStore();
  const colors = getColors();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.username || 'Unknown User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
            <Text style={styles.userDetails}>Company: {user?.company || 'N/A'}</Text>
            <Text style={styles.userDetails}>Location: {user?.location || 'N/A'}</Text>
            <Text style={styles.userDetails}>Account Type: {user?.accountType || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Theme Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Settings</Text>
        
        {/* Dark Mode Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDarkMode ? colors.background : colors.textLight}
          />
        </View>

        {/* Theme Selection */}
        <Text style={styles.subSectionTitle}>Color Themes</Text>
        {themeOptions.map((theme) => (
          <TouchableOpacity
            key={theme.key}
            style={[
              styles.themeOption,
              currentTheme === theme.key && styles.selectedTheme,
            ]}
            onPress={() => setTheme(theme.key)}
          >
            <View style={styles.themeInfo}>
              <View style={styles.colorPreview}>
                {theme.colors.map((color, index) => (
                  <View
                    key={index}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.themeName}>{theme.name}</Text>
            </View>
            {currentTheme === theme.key && (
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={colors.primary} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Monitor Access */}
      {user?.monitorAccess && user.monitorAccess.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monitor Access</Text>
          <View style={styles.accessContainer}>
            {user.monitorAccess.map((access, index) => (
              <View key={index} style={styles.accessChip}>
                <Text style={styles.accessText}>{access}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    margin: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTheme: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    flexDirection: 'row',
    marginRight: 12,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeName: {
    fontSize: 16,
    color: colors.text,
  },
  accessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accessChip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  accessText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 12,
  },
});