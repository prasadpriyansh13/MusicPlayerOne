import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import ThemedText from '../../components/common/ThemedText';
import ThemedView from '../../components/common/ThemedView';
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ThemedView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Settings" />
        
        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#8A2BE2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons name="moon" size={20} color="#FFFFFF" />
              </View>
              <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>
                Dark Mode
              </ThemedText>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CCCCCC', true: '#9D50BB' }}
              thumbColor={isDarkMode ? '#8A2BE2' : '#F5F5F5'}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#8A2BE2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons name="information-circle" size={20} color="#FFFFFF" />
              </View>
              <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>
                About
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? '#BBBBBB' : '#888888'}
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
} 