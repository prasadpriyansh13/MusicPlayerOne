import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMusic } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getDisplayTitle } from '../../utils/musicUtils';
import ThemedText from '../common/ThemedText';
import PlayerModal from './PlayerModal';

const { width } = Dimensions.get('window');

const MiniPlayer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { currentSong, isPlaying, pauseSong, resumeSong, progress, duration } = useMusic();
  
  // State to control modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  
  // Animation for progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Handle play/pause button
  const handlePlayPause = useCallback((e: any) => {
    e.stopPropagation(); // Prevent triggering the parent's onPress
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  }, [isPlaying, pauseSong, resumeSong]);
  
  // Show/hide the player modal
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  
  // Update progress bar
  useEffect(() => {
    if (duration > 0) {
      progressAnim.setValue((progress / duration) * width);
    }
  }, [progress, duration, progressAnim, width]);
  
  // Don't show mini player if no song is playing
  if (!currentSong) return null;
  
  return (
    <>
      <View style={styles.container}>
        {/* Progress bar */}
        <Animated.View
          style={[
            styles.progressBar,
            { width: progressAnim, backgroundColor: '#8A2BE2' }
          ]}
        />
        
        <Pressable 
          style={[
            styles.miniPlayerContainer,
            {
              backgroundColor: isDarkMode 
                ? 'rgba(30, 30, 30, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              borderTopWidth: 1,
              borderTopColor: isDarkMode ? '#333333' : '#EEEEEE',
            }
          ]} 
          onPress={openModal}
        >
          <View style={styles.songInfoContainer}>
            <View style={styles.albumArt}>
              <Ionicons name="musical-note" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.songTitle} numberOfLines={1}>
                {getDisplayTitle(currentSong)}
              </ThemedText>
              <ThemedText style={styles.artistName} numberOfLines={1}>
                {currentSong.artist || 'Unknown Artist'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              onPress={handlePlayPause} 
              style={styles.playButton}
            >
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={24} 
                color={isDarkMode ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
      
      {/* Player modal - completely standard React Native Modal */}
      <PlayerModal 
        visible={modalVisible} 
        onClose={closeModal} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // For bottom tab height
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  progressBar: {
    height: 2,
    width: 0,
  },
  miniPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  songInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumArt: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  artistName: {
    fontSize: 12,
    opacity: 0.7,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniPlayer; 