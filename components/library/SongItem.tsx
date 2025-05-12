import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Song, useMusic } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDuration, getDisplayTitle, getSubtitleText } from '../../utils/musicUtils';
import ThemedText from '../common/ThemedText';

interface SongItemProps {
  song: Song;
  onPress: () => void;
}

const SongItem: React.FC<SongItemProps> = ({ song, onPress }) => {
  const { isDarkMode } = useTheme();
  const { isFavorite, toggleFavorite } = useMusic();
  
  const isFav = isFavorite(song.id);
  
  const handleFavoritePress = (e: any) => {
    e.stopPropagation(); // Prevent triggering the parent's onPress
    toggleFavorite(song.id);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5' }
      ]} 
      onPress={onPress}
    >
      <View style={styles.musicIcon}>
        <Ionicons name="musical-note" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.infoContainer}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {getDisplayTitle(song)}
        </ThemedText>
        <ThemedText style={styles.subtitle} numberOfLines={1}>
          {getSubtitleText(song)}
        </ThemedText>
      </View>
      <TouchableOpacity 
        onPress={handleFavoritePress}
        style={styles.favoriteButton}
      >
        <Ionicons 
          name={isFav ? "heart" : "heart-outline"} 
          size={22} 
          color={isFav ? "#FF4081" : (isDarkMode ? "#BBBBBB" : "#888888")}
        />
      </TouchableOpacity>
      <ThemedText style={styles.duration}>
        {formatDuration(song.duration || 0)}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  musicIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  favoriteButton: {
    padding: 8,
    marginRight: 4,
  },
  duration: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default SongItem; 