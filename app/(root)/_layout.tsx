import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Alert, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AuthLayout() {
  const { user, logout } = useAuthStore();
  const { getColors, isDarkMode } = useThemeStore();
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
          onPress: () => {logout() ;router.replace('/login');}
        }
      ]
    );
  };

  // const hasAccess = (screenName: string) => {
  //   if (!user?.monitorAccess) return true;
    
  //   const accessMap: { [key: string]: string[] } = {
  //     'dashboard': ['Overview', 'Dashboards'],
  //     'device': ['Devices'],
  //     'registration': ['Overview'], // Only admin access
  //     'reports': ['Reports', 'Analytics'],
  //     'contact': ['Overview'], // Available to all
  //     'settings': ['Overview'], // Available to all
  //   };

  //   const requiredAccess = accessMap[screenName] || [];
  //   return requiredAccess.some(access => 
  //     user.monitorAccess.includes(access)
  //   ) || requiredAccess.length === 0;
  // };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer
      screenOptions={{
        headerLeft: () => (
          <DrawerToggleButton 
            tintColor={isDarkMode ? '#ffffff' : colors.text} 
          />
        ),
        drawerType: 'front',
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerLabelStyle: {
          fontSize: 16,
          color: colors.text,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textLight,
      }}
    >
      <Drawer.Screen 
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          // drawerItemStyle: hasAccess('dashboard') ? {} : { display: 'none' },
        }}
      />
      <Drawer.Screen 
        name="device"
        options={{
          title: 'Devices',
          drawerLabel: 'Devices',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip" size={size} color={color} />
          ),
          // drawerItemStyle: hasAccess('device') ? {} : { display: 'none' },
        }}
      />
      <Drawer.Screen 
        name="registration"
        options={{
          title: 'Registration',
          drawerLabel: 'Registration',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add" size={size} color={color} />
          ),
          // drawerItemStyle: hasAccess('registration') ? {} : { display: 'none' },
        }}
      />
      <Drawer.Screen 
        name="reports"
        options={{
          title: 'Reports',
          drawerLabel: 'Reports',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
          // drawerItemStyle: hasAccess('reports') ? {} : { display: 'none' },
        }}
      />
      <Drawer.Screen 
        name="contact"
        options={{
          title: 'Contact Us',
          drawerLabel: 'Contact Us',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="mail" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="settings"
        options={{
          title: 'Settings',
          drawerLabel: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleLogout}
              style={{ marginRight: 15 }}
            >
              <Ionicons 
                name="log-out" 
                size={24} 
                color={colors.text} 
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer>
    </GestureHandlerRootView>
  );
}