import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import MiniPlayer from '../../components/player/MiniPlayer';
import { useTheme } from '../../contexts/ThemeContext';

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
            borderTopColor: isDarkMode ? '#333333' : '#EEEEEE',
            paddingBottom: 5,
            height: 60,
          },
          tabBarActiveTintColor: '#8A2BE2', // primary purple
          tabBarInactiveTintColor: isDarkMode ? '#888888' : '#999999',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'All Songs',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="musical-notes" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="library" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <MiniPlayer />
    </>
  );
} 