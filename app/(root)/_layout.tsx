import { useColorScheme } from '@/hooks/useColorScheme';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
 
    <Drawer
      screenOptions={{
        headerLeft: () => <DrawerToggleButton />,
        drawerType: 'front',
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        drawerLabelStyle: {
          fontSize: 16
        }
      }}
    >
      <Drawer.Screen 
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerLabel: 'Dashboard'
        }}
      />
      <Drawer.Screen 
        name="device"
        options={{
          title: 'Devices',
          drawerLabel: 'Devices'
        }}
      />
      <Drawer.Screen 
        name="registration"
        options={{
          title: 'Registration',
          drawerLabel: 'Registration'
        }}
      />
      <Drawer.Screen 
        name="reports"
        options={{
          title: 'Reports',
          drawerLabel: 'Reports'
        }}
      />
      <Drawer.Screen 
        name="contact"
        options={{
          title: 'Contact Us',
          drawerLabel: 'Contact Us'
        }}
      />
    </Drawer>
 
  );
}