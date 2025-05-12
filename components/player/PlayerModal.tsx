import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMusic } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDuration, getDisplayTitle } from '../../utils/musicUtils';
import ThemedText from '../common/ThemedText';
import ThemedView from '../common/ThemedView';

const { width } = Dimensions.get('window');

interface PlayerModalProps {
  visible: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ visible, onClose }) => {
  const { isDarkMode } = useTheme();
  const { 
    currentSong, 
    isPlaying, 
    pauseSong, 
    resumeSong, 
    progress, 
    duration, 
    seekTo, 
    nextSong, 
    prevSong, 
    repeatMode, 
    isShuffle, 
    toggleRepeatMode, 
    toggleShuffle 
  } = useMusic();
  
  // If no song, don't render content
  if (!currentSong) return null;
  
  // Handle slider change
  const handleSliderChange = (value: number) => {
    seekTo(value * duration);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.container}>
          {/* Header with close button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons 
                name="chevron-down" 
                size={28} 
                color={isDarkMode ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Album Art */}
          <View style={styles.albumContainer}>
            <View style={styles.albumArt}>
              <Ionicons name="musical-note" size={80} color="#FFFFFF" />
            </View>
          </View>
          
          {/* Song Info */}
          <View style={styles.songInfo}>
            <ThemedText style={styles.songTitle} numberOfLines={2}>
              {getDisplayTitle(currentSong)}
            </ThemedText>
            <ThemedText style={styles.artistName}>
              {currentSong.artist || 'Unknown Artist'}
            </ThemedText>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <ThemedText style={styles.timeText}>{formatDuration(progress)}</ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={duration > 0 ? progress / duration : 0}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#8A2BE2"
              maximumTrackTintColor={isDarkMode ? '#444444' : '#DDDDDD'}
              thumbTintColor="#8A2BE2"
            />
            <ThemedText style={styles.timeText}>{formatDuration(duration)}</ThemedText>
          </View>
          
          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
              <Ionicons 
                name="shuffle" 
                size={24} 
                color={isShuffle ? '#8A2BE2' : (isDarkMode ? '#BBBBBB' : '#888888')} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={prevSong} style={styles.controlButton}>
              <Ionicons 
                name="play-skip-back" 
                size={35} 
                color={isDarkMode ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={isPlaying ? pauseSong : resumeSong} style={styles.playPauseButton}>
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={30} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={nextSong} style={styles.controlButton}>
              <Ionicons 
                name="play-skip-forward" 
                size={35} 
                color={isDarkMode ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleRepeatMode} style={styles.controlButton}>
              <Ionicons 
                name="repeat" 
                size={24} 
                color={repeatMode !== 0 ? '#8A2BE2' : (isDarkMode ? '#BBBBBB' : '#888888')} 
              />
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  albumArt: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 12,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  songInfo: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default PlayerModal; 