import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeType = 'coffeeTheme' | 'forestTheme' | 'purpleTheme' | 'oceanTheme';

interface ThemeState {
  currentTheme: ThemeType;
  isDarkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleDarkMode: () => void;
  getColors: () => any;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'coffeeTheme',
      isDarkMode: false,
      
      setTheme: (theme) => {
        set({ currentTheme: theme });
      },
      
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      getColors: () => {
        const { currentTheme, isDarkMode } = get();
        const themeColors = Colors[currentTheme];
        
        if (isDarkMode) {
          return {
            ...themeColors,
            background: '#1a1a1a',
            text: '#ffffff',
            textLight: '#cccccc',
            card: '#2a2a2a',
            border: '#444444',
          };
        }
        
        return themeColors;
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);