import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Song, useMusic } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemedText from '../common/ThemedText';
import CategoryItemList from './CategoryItemList';

// Define a simpler interface for category items
interface CategoryItem {
  id: string;
  title: string;
  subtitle?: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  songs: Song[];
}

interface CategoryItemProps {
  id: string;
  title: string;
  subtitle?: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface CategoryScreenProps {
  type: 'artists' | 'albums' | 'genres' | 'playlists';
  title: string;
  goBack: () => void;
}

const CategoryItemComponent = ({ id, title, subtitle, count, icon, onPress }: CategoryItemProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5' }
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemTitle} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={styles.itemSubtitle} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <ThemedText style={styles.countText}>
        {count} {count === 1 ? 'song' : 'songs'}
      </ThemedText>
    </TouchableOpacity>
  );
};

const CategoryScreen: React.FC<CategoryScreenProps> = ({ type, title, goBack }) => {
  const { songs, playSong } = useMusic();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  const items: CategoryItem[] = useMemo(() => {
    switch (type) {
      case 'artists':
        // Group songs by artist
        const artistGroups = songs.reduce((groups, song) => {
          const artist = song.artist || 'Unknown Artist';
          if (!groups[artist]) {
            groups[artist] = [];
          }
          groups[artist].push(song);
          return groups;
        }, {} as Record<string, Song[]>);
        
        // Convert to array of artist items
        return Object.entries(artistGroups).map(([artist, artistSongs]) => ({
          id: artist,
          title: artist,
          count: artistSongs.length,
          icon: 'person' as keyof typeof Ionicons.glyphMap,
          songs: artistSongs,
        }));
        
      case 'albums':
        // Group songs by album
        const albumGroups = songs.reduce((groups, song) => {
          const album = song.album || 'Unknown Album';
          if (!groups[album]) {
            groups[album] = [];
          }
          groups[album].push(song);
          return groups;
        }, {} as Record<string, Song[]>);
        
        // Convert to array of album items
        return Object.entries(albumGroups).map(([album, albumSongs]) => {
          const artist = [...new Set(albumSongs.map(song => song.artist))].join(', ');
          return {
            id: album,
            title: album,
            subtitle: artist,
            count: albumSongs.length,
            icon: 'disc' as keyof typeof Ionicons.glyphMap,
            songs: albumSongs,
          };
        });
        
      case 'genres':
        // For demo purposes since we don't have genre metadata
        return [
          {
            id: 'pop',
            title: 'Pop',
            count: 0,
            icon: 'musical-notes' as keyof typeof Ionicons.glyphMap,
            songs: [],
          },
          {
            id: 'rock',
            title: 'Rock',
            count: 0,
            icon: 'musical-notes' as keyof typeof Ionicons.glyphMap,
            songs: [],
          },
        ];
        
      case 'playlists':
        // Demo playlists
        return [
          {
            id: 'favorites',
            title: 'Favorites',
            count: 0,
            icon: 'heart' as keyof typeof Ionicons.glyphMap,
            songs: [],
          },
          {
            id: 'recently-played',
            title: 'Recently Played',
            count: 0,
            icon: 'time' as keyof typeof Ionicons.glyphMap,
            songs: [],
          },
        ];
        
      default:
        return [];
    }
  }, [songs, type]);
  
  const handleItemPress = (item: CategoryItem) => {
    setSelectedItem(item.id);
  };
  
  const handleBackFromItemList = () => {
    setSelectedItem(null);
  };
  
  const handleSongPress = (song: Song) => {
    playSong(song);
  };
  
  // If an item is selected, show its songs
  if (selectedItem) {
    const selectedItemData = items.find(item => item.id === selectedItem);
    
    if (selectedItemData) {
      return (
        <CategoryItemList
          songs={selectedItemData.songs}
          onSongPress={handleSongPress}
          title={selectedItemData.title}
          goBack={handleBackFromItemList}
        />
      );
    }
  }
  
  const renderItem = ({ item }: { item: CategoryItem }) => (
    <CategoryItemComponent
      id={item.id}
      title={item.title}
      subtitle={item.subtitle}
      count={item.count}
      icon={item.icon}
      onPress={() => handleItemPress(item)}
    />
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{title}</ThemedText>
        <View style={styles.rightHeaderSpace} />
      </View>
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightHeaderSpace: {
    width: 40, // Balance the back button width
  },
  listContainer: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  countText: {
    fontSize: 12,
    opacity: 0.8,
    marginLeft: 8,
  },
  separator: {
    height: 8,
  },
});

export default CategoryScreen; 