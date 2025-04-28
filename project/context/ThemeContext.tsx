import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the theme types and color palette
const lightColors = {
  primary: '#967BB6',      // Lavender
  primaryLight: '#B9A3D1', // Light Lavender
  secondary: '#96D6B0',    // Mint
  secondaryLight: '#C5E9D5',
  accent: '#FFBE9D',       // Peach
  accentLight: '#FFD9C7',
  success: '#96D6B0',      // Mint Green
  successLight: '#C5E9D5',
  warning: '#FFCC80',      // Soft Orange
  warningLight: '#FFE3BF',
  danger: '#FF7F7F',       // Soft Red
  dangerSoft: '#FFEDED',
  background: '#F9F5FF',   // Very Light Lavender
  card: '#FFFFFF',         // White
  text: '#31294F',         // Dark Purple
  textSecondary: '#7A7A8C', // Gray Purple
  border: '#EAEAEE',       // Light Gray
  switchTrackOff: '#E0E0E0',
  switchThumb: '#FFFFFF',
  white: '#FFFFFF',
  relaxGradientStart: '#967BB6', // Lavender
  relaxGradientEnd: '#B9A3D1',   // Lighter Lavender
  circleBackground: '#FFFFFF',   // White
  controlBackground: 'rgba(255, 255, 255, 0.2)',
  durationActiveBackground: 'rgba(255, 255, 255, 0.3)',
};

const darkColors = {
  primary: '#B9A3D1',      // Lighter Lavender
  primaryLight: '#967BB6', // Lavender
  secondary: '#96D6B0',    // Mint
  secondaryLight: '#C5E9D5',
  accent: '#FFBE9D',       // Peach
  accentLight: '#FFD9C7',
  success: '#96D6B0',      // Mint Green
  successLight: '#75B592',
  warning: '#FFCC80',      // Soft Orange
  warningLight: '#FFBB33',
  danger: '#FF7F7F',       // Soft Red
  dangerSoft: '#3A2A2A',   // Dark Red
  background: '#15121E',   // Very Dark Purple
  card: '#252134',         // Dark Purple Gray
  text: '#F9F5FF',         // Very Light Lavender
  textSecondary: '#BBB9C9', // Light Gray Purple
  border: '#3D364F',       // Dark Gray Purple
  switchTrackOff: '#3D364F',
  switchThumb: '#F9F5FF',
  white: '#FFFFFF',
  relaxGradientStart: '#5D4A8C', // Darker Lavender
  relaxGradientEnd: '#967BB6',   // Regular Lavender
  circleBackground: '#FFFFFF',   // White
  controlBackground: 'rgba(255, 255, 255, 0.15)',
  durationActiveBackground: 'rgba(255, 255, 255, 0.25)',
};

// Theme context
type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get device color scheme
  const deviceTheme = useColorScheme();
  const [isDark, setIsDark] = useState(deviceTheme === 'dark');
  
  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_preference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // Use device theme as default if no preference is saved
          setIsDark(deviceTheme === 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme preference:', e);
      }
    };
    
    loadTheme();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('@theme_preference', isDark ? 'dark' : 'light');
      } catch (e) {
        console.error('Failed to save theme preference:', e);
      }
    };
    
    saveTheme();
  }, [isDark]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  
  // Get current theme colors
  const colors = isDark ? darkColors : lightColors;
  
  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};