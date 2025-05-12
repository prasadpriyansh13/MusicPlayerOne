import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Song } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDuration, getDisplayTitle } from '../../utils/musicUtils';
import ThemedText from '../common/ThemedText';

interface CategoryItemListProps {
  songs: Song[];
  onSongPress: (song: Song) => void;
  title: string;
  goBack: () => void;
}

const CategoryItemList: React.FC<CategoryItemListProps> = ({
  songs,
  onSongPress,
  title,
  goBack,
}) => {
  const { isDarkMode } = useTheme();

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={[
        styles.songItem,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5' }
      ]}
      onPress={() => onSongPress(item)}
    >
      <View style={styles.songIcon}>
        <Ionicons name="musical-note" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.songInfo}>
        <ThemedText style={styles.songTitle} numberOfLines={1}>
          {getDisplayTitle(item)}
        </ThemedText>
        <ThemedText style={styles.songArtist} numberOfLines={1}>
          {item.artist || 'Unknown Artist'}
        </ThemedText>
      </View>
      <ThemedText style={styles.duration}>
        {formatDuration(item.duration || 0)}
      </ThemedText>
    </TouchableOpacity>
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
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="albums-outline"
              size={60}
              color={isDarkMode ? '#444444' : '#CCCCCC'}
            />
            <ThemedText style={styles.emptyText}>
              No songs found
            </ThemedText>
          </View>
        }
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
    paddingBottom: 100, // Extra padding for mini player
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  songIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    opacity: 0.7,
  },
  duration: {
    fontSize: 14,
    marginLeft: 8,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    opacity: 0.7,
  },
});

export default CategoryItemList; 