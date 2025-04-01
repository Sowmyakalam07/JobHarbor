import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { 
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme 
} from '@react-navigation/native';
import { 
  MD3DarkTheme as PaperDarkTheme, 
  MD3LightTheme as PaperLightTheme 
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create custom themes by combining React Navigation and Paper themes
const CustomLightTheme = {
  ...NavigationDefaultTheme,
  ...PaperLightTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperLightTheme.colors,
    primary: '#6200ee',
    background: '#f6f6f6',
    card: '#ffffff',
    text: '#000000',
  },
};

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    primary: '#bb86fc',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
  },
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeType, setThemeType] = useState('system');
  
  // Check saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme) {
          setThemeType(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);

  // Determine if dark theme should be used
  const isDarkTheme = 
    themeType === 'dark' || (themeType === 'system' && deviceTheme === 'dark');

  // Set theme based on current state
  const theme = isDarkTheme ? CustomDarkTheme : CustomLightTheme;
  const paperTheme = isDarkTheme ? PaperDarkTheme : PaperLightTheme;

  // Function to toggle theme
  const toggleTheme = async () => {
    const newThemeType = themeType === 'dark' ? 'light' : 'dark';
    setThemeType(newThemeType);
    try {
      await AsyncStorage.setItem('themePreference', newThemeType);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Function to set theme to system
  const setSystemTheme = async () => {
    setThemeType('system');
    try {
      await AsyncStorage.setItem('themePreference', 'system');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        isDarkTheme, 
        themeType, 
        toggleTheme, 
        setSystemTheme 
      }}
    >
      {typeof children === 'function' 
        ? children(theme, paperTheme) 
        : children}
    </ThemeContext.Provider>
  );
};
