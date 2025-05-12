import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import ThemedText from '../../components/common/ThemedText';
import ThemedView from '../../components/common/ThemedView';
import CategoryScreen from '../../components/library/CategoryScreen';
import { useMusic } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';

// Library category interface
interface LibraryCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  itemCount: number;
}

export default function LibraryScreen() {
  const { isDarkMode } = useTheme();
  const { songs } = useMusic();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create library categories based on songs metadata
  const categories: LibraryCategory[] = [
    {
      id: 'artists',
      title: 'Artists',
      icon: 'person',
      itemCount: Array.from(new Set(songs.map(song => song.artist))).length,
    },
    {
      id: 'albums',
      title: 'Albums',
      icon: 'disc',
      itemCount: Array.from(new Set(songs.map(song => song.album || 'Unknown'))).length,
    },
    {
      id: 'genres',
      title: 'Genres',
      icon: 'musical-notes',
      itemCount: 0, // In a real app, you'd calculate this from song metadata
    },
    {
      id: 'favorites',
      title: 'Favorites',
      icon: 'heart',
      itemCount: 0, // This would be user-specific data
    },
    {
      id: 'playlists',
      title: 'Playlists',
      icon: 'list',
      itemCount: 0, // User created playlists
    },
  ];

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter(category => 
      category.title.toLowerCase().includes(query)
    );
  }, [searchQuery, categories]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleGoBack = () => {
    setSelectedCategory(null);
  };

  // Clear search query
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // If a category is selected, show the category screen
  if (selectedCategory) {
    const category = categories.find(cat => cat.id === selectedCategory);
    return (
      <ThemedView style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={{ flex: 1 }}>
          <CategoryScreen 
            type={selectedCategory as any}
            title={category?.title || selectedCategory}
            goBack={handleGoBack}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const renderCategoryItem = ({ item }: { item: LibraryCategory }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',
        borderRadius: 12,
        marginBottom: 12,
      }}
      onPress={() => handleCategoryPress(item.id)}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#8A2BE2',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 16,
        }}
      >
        <Ionicons name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText
          style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}
        >
          {item.title}
        </ThemedText>
        <ThemedText
          style={{ fontSize: 14, opacity: 0.7 }}
        >
          {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
        </ThemedText>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isDarkMode ? '#BBBBBB' : '#888888'}
      />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Library" />
        
        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 8,
          backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',
        }}>
          <Ionicons name="search" size={20} color={isDarkMode ? '#BBBBBB' : '#888888'} />
          <TextInput
            style={{
              flex: 1,
              height: 40,
              marginLeft: 8,
              fontSize: 16,
              color: isDarkMode ? '#FFFFFF' : '#000000',
            }}
            placeholder="Search categories"
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
          data={filteredCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={{
                padding: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons
                  name="search-outline"
                  size={60}
                  color={isDarkMode ? '#444444' : '#CCCCCC'}
                />
                <ThemedText style={{
                  marginTop: 16,
                  fontSize: 16,
                  textAlign: 'center',
                  opacity: 0.7,
                }}>
                  No categories found for "{searchQuery}"
                </ThemedText>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
} 