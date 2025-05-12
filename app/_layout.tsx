import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MusicProvider, useMusic } from '../contexts/MusicContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Request permissions when the app starts
function PermissionInitializer() {
  const { requestPermission } = useMusic();
  
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);
  
  return null;
}

// App content with the appropriate theme
function MainContent() {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <MusicProvider>
            <PermissionInitializer />
            <BottomSheetModalProvider>
              <MainContent />
            </BottomSheetModalProvider>
          </MusicProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
