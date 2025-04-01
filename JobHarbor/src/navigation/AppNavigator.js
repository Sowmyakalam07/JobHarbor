import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, useTheme } from 'react-native-paper';

import JobsScreen from '../screens/JobsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for Job screens
const JobsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="JobsList" component={JobsScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    </Stack.Navigator>
  );
};

// Stack navigator for Bookmark screens
const BookmarksStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BookmarksList" component={BookmarksScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { colors } = useTheme();
  const { isDarkTheme, toggleTheme } = useCustomTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }

          // Adjust size to work better with IconButton
          const adjustedSize = size - 2;
          
          return (
            <IconButton 
              icon={iconName} 
              size={adjustedSize} 
              color={color}
              style={{ margin: 0, padding: 0 }}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: 'rgba(0,0,0,0.1)',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarksStack}
        options={{
          tabBarBadge: null, // Can be used later to show count of bookmarks
          headerRight: () => (
            <IconButton
              icon={isDarkTheme ? 'weather-night' : 'white-balance-sunny'}
              color={colors.text}
              size={24}
              onPress={toggleTheme}
              style={{ marginRight: 8 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
