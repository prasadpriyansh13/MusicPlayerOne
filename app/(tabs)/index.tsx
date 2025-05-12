import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import ThemedText from '../../components/common/ThemedText';
import ThemedView from '../../components/common/ThemedView';
import SongItem from '../../components/library/SongItem';
import { Song, useMusic } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function SongsScreen() {
  const { isDarkMode } = useTheme();
  const { 
    songs, 
    playSong, 
    isLoading, 
    hasPermission, 
    requestPermission, 
    loadSongs 
  } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (hasPermission) {
      loadSongs();
    }
  }, [hasPermission, loadSongs]);

  // Filter songs when search query or songs change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs(songs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        (song.artist && song.artist.toLowerCase().includes(query)) ||
        (song.album && song.album.toLowerCase().includes(query))
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  const handleSongPress = (song: Song) => {
    playSong(song);
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <SongItem song={item} onPress={() => handleSongPress(item)} />
  );

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  // Clear search query
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Permission not granted
  if (!hasPermission) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={styles.center}>
          <Ionicons 
            name="musical-notes" 
            size={70} 
            color={isDarkMode ? '#8A2BE2' : '#8A2BE2'} 
            style={styles.icon}
          />
          <ThemedText style={styles.title}>Music Player</ThemedText>
          <ThemedText style={styles.message}>
            We need permission to access your music library
          </ThemedText>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRequestPermission}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <ThemedText style={styles.loadingText}>Loading your music...</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // No songs found
  if (songs.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={styles.center}>
          <Ionicons 
            name="alert-circle-outline" 
            size={70} 
            color={isDarkMode ? '#FFFFFF' : '#000000'} 
            style={styles.icon}
          />
          <ThemedText style={styles.title}>No Music Found</ThemedText>
          <ThemedText style={styles.message}>
            We couldn't find any music files on your device.
          </ThemedText>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => loadSongs()}
          >
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Main list view
  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="All Songs" />
        
        {/* Search Bar */}
        <View style={[
          styles.searchBarContainer,
          {backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5'}
        ]}>
          <Ionicons name="search" size={20} color={isDarkMode ? '#BBBBBB' : '#888888'} />
          <TextInput
            style={[
              styles.searchInput,
              {color: isDarkMode ? '#FFFFFF' : '#000000'}
            ]}
            placeholder="Search songs, artists or albums"
            placeholderTextColor={isDarkMode ? '#888888' : '#BBBBBB'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={isDarkMode ? '#BBBBBB' : '#888888'} />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={filteredSongs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={styles.emptySearchContainer}>
                <Ionicons
                  name="search-outline"
                  size={60}
                  color={isDarkMode ? '#444444' : '#CCCCCC'}
                />
                <ThemedText style={styles.emptySearchText}>
                  No results found for "{searchQuery}"
                </ThemedText>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 16,
  },
  emptySearchContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySearchText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 