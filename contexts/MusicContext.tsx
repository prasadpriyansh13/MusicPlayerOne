import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface Song {
  id: string;
  uri: string;
  title: string;
  artist: string;
  artwork?: string;
  album?: string;
  duration?: number;
  filename?: string;
}

interface MusicContextType {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: number;
  progress: number;
  duration: number;
  isPlayerReady: boolean;
  isLoading: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seekTo: (position: number) => void;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;
  loadSongs: () => Promise<void>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  favorites: string[];
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  getFavoriteSongs: () => Song[];
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: track, 2: queue
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Sound player reference
  const soundRef = useRef<Audio.Sound | null>(null);
  
  // Use a ref for the interval to avoid dependency issues in useEffect
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Load favorites from storage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    
    loadFavorites();
  }, []);

  // Save favorites to storage when they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };
    
    saveFavorites();
  }, [favorites]);
  
  // Toggle a song as favorite
  const toggleFavorite = useCallback((songId: string) => {
    setFavorites(prevFavorites => {
      const exists = prevFavorites.includes(songId);
      if (exists) {
        return prevFavorites.filter(id => id !== songId);
      } else {
        return [...prevFavorites, songId];
      }
    });
  }, []);
  
  // Check if a song is a favorite
  const isFavorite = useCallback((songId: string) => {
    return favorites.includes(songId);
  }, [favorites]);
  
  // Get all favorite songs
  const getFavoriteSongs = useCallback(() => {
    return songs.filter(song => favorites.includes(song.id));
  }, [songs, favorites]);
  
  // Request media library permissions
  const requestPermission = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const isGranted = status === 'granted';
      setHasPermission(isGranted);
      
      if (isGranted) {
        // Initialize audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        });
        
        setIsPlayerReady(true);
      }
      
      return isGranted;
    } catch (error) {
      console.error('Error requesting media permissions:', error);
      return false;
    }
  }, []);
  
  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await MediaLibrary.getPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        });
        
        setIsPlayerReady(true);
        // Don't call loadSongs here, we'll call it from component when hasPermission changes
      }
    };
    
    checkPermissions();
    
    // Cleanup audio on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []); // Empty dependency array so it only runs once on mount
  
  // Load sample songs as fallback
  const loadSampleSongs = useCallback(() => {
    console.log('Loading sample songs as fallback');
    const sampleSongs: Song[] = [
      {
        id: '1',
        uri: '',
        title: 'Feel Good Inc',
        artist: 'Gorillaz',
        album: 'Demon Days',
        duration: 222,
      },
      {
        id: '2',
        uri: '',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
      },
      {
        id: '3',
        uri: '',
        title: 'Bad Guy',
        artist: 'Billie Eilish',
        album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
        duration: 194,
      },
      {
        id: '4',
        uri: '',
        title: 'Uptown Funk',
        artist: 'Mark Ronson ft. Bruno Mars',
        album: 'Uptown Special',
        duration: 270,
      },
      {
        id: '5',
        uri: '',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷ (Divide)',
        duration: 234,
      },
      {
        id: '6',
        uri: '',
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        duration: 203,
      },
      {
        id: '7',
        uri: '',
        title: 'Savage Love',
        artist: 'Jason Derulo',
        album: 'Savage Love - Single',
        duration: 174,
      },
      {
        id: '8',
        uri: '',
        title: 'Watermelon Sugar',
        artist: 'Harry Styles',
        album: 'Fine Line',
        duration: 174,
      },
      {
        id: '9',
        uri: '',
        title: 'Dance Monkey',
        artist: 'Tones and I',
        album: 'The Kids Are Coming',
        duration: 210,
      },
      {
        id: '10',
        uri: '',
        title: 'Mood',
        artist: '24kGoldn ft. iann dior',
        album: 'El Dorado',
        duration: 140,
      },
    ];
    
    setSongs(sampleSongs);
  }, []);
  
  // Load songs from media library
  const loadSongs = useCallback(async () => {
    if (!hasPermission) {
      console.log('No permission to access media library');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get only audio files
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 500, // Limit to first 500 songs for performance
      });
      
      if (media.assets.length === 0) {
        // If no songs are found, use sample songs
        loadSampleSongs();
        setIsLoading(false);
        return;
      }
      
      const audioFiles = await Promise.all(
        media.assets.map(async (asset) => {
          // Get more detailed info about the asset
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
          
          return {
            id: asset.id,
            uri: asset.uri,
            title: asset.filename.replace(/\.[^/.]+$/, ''), // Remove file extension
            artist: assetInfo.creationTime ? 'Unknown Artist' : 'Unknown Artist',
            album: 'Unknown Album',
            duration: asset.duration || 0,
            filename: asset.filename,
          };
        })
      );
      
      setSongs(audioFiles);
      console.log(`Loaded ${audioFiles.length} songs from device`);
    } catch (error) {
      console.error('Error loading songs:', error);
      // Load sample songs as fallback
      loadSampleSongs();
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission, loadSampleSongs]);
  
  // Play a song - defined before nextSong/prevSong to avoid circular dependencies
  const playSong = useCallback(async (song: Song) => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      // For sample songs without real URIs, just simulate playing
      if (!song.uri) {
        setCurrentSong(song);
        setIsPlaying(true);
        setDuration(song.duration || 0);
        setProgress(0);
        return;
      }
      
      // Load and play the sound
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      setCurrentSong(song);
      setIsPlaying(true);
      
      // Set duration if available from the status
      if (status && 'durationMillis' in status && status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      } else {
        setDuration(song.duration || 0);
      }
      
      setProgress(0);
    } catch (error) {
      console.error('Error playing song:', error);
      // Fallback to simulation mode
      setCurrentSong(song);
      setIsPlaying(true);
      setDuration(song.duration || 0);
      setProgress(0);
    }
  }, []);
  
  // Handle playback status updates
  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (!status.isLoaded) return;
    
    if (status.isPlaying) {
      // Update progress
      setProgress(status.positionMillis / 1000);
    }
    
    if (status.didJustFinish) {
      // Song ended
      if (repeatMode === 1) {
        // Repeat current song
        soundRef.current?.replayAsync();
      } else if (repeatMode === 2 || songs.length > 1) {
        // Go to next song - we need to define this as a separate helper function
        // to avoid circular dependency with nextSong
        const handleSongEnd = () => {
          if (!currentSong || songs.length === 0) return;
          
          const currentIndex = songs.findIndex(song => song.id === currentSong.id);
          let nextIndex = (currentIndex + 1) % songs.length;
          
          // If shuffle is on, pick a random song that's not the current one
          if (isShuffle && songs.length > 1) {
            do {
              nextIndex = Math.floor(Math.random() * songs.length);
            } while (nextIndex === currentIndex && songs.length > 1);
          }
          
          playSong(songs[nextIndex]);
        };
        
        handleSongEnd();
      } else {
        // Stop playing
        setIsPlaying(false);
      }
    }
  }, [currentSong, songs, repeatMode, isShuffle]);
  
  // Simulate progress updates for dummy songs (without real URIs)
  useEffect(() => {
    if (isPlaying && currentSong && !currentSong.uri) {
      // Clear existing interval if any
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      
      // Set up a new interval to update progress every second
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          // If reached the end of the song
          if (prev >= duration) {
            if (repeatMode === 1) {
              // Repeat the current song
              return 0;
            } else {
              // Move to next song or stop
              clearInterval(progressInterval.current!);
              progressInterval.current = null;
              if (repeatMode === 2 || songs.length > 1) {
                // Use setTimeout to avoid update during render
                setTimeout(() => {
                  if (nextSong) nextSong();
                }, 500);
              } else {
                setIsPlaying(false);
              }
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
      
      // Initial progress reset when starting a new song
      if (progress > 0) {
        setProgress(0);
      }
    } else if (!isPlaying || (currentSong && currentSong.uri)) {
      // Clear interval when paused or when playing real songs
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [isPlaying, currentSong, duration, repeatMode, songs.length]); // Remove 'nextSong' and 'progress' from dependencies
  
  // Pause the current song
  const pauseSong = useCallback(async () => {
    if (soundRef.current && currentSong?.uri) {
      await soundRef.current.pauseAsync();
    }
    setIsPlaying(false);
  }, [currentSong]);
  
  // Resume the current song
  const resumeSong = useCallback(async () => {
    if (soundRef.current && currentSong?.uri) {
      await soundRef.current.playAsync();
    }
    setIsPlaying(true);
  }, [currentSong]);
  
  // Next song function
  const nextSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    let nextIndex = (currentIndex + 1) % songs.length;
    
    // If shuffle is on, pick a random song that's not the current one
    if (isShuffle && songs.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentIndex && songs.length > 1);
    }
    
    playSong(songs[nextIndex]);
  }, [currentSong, songs, isShuffle, playSong]);
  
  // Go to the previous song
  const prevSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    
    // If shuffle is on, pick a random song that's not the current one
    if (isShuffle && songs.length > 1) {
      do {
        prevIndex = Math.floor(Math.random() * songs.length);
      } while (prevIndex === currentIndex && songs.length > 1);
    }
    
    playSong(songs[prevIndex]);
  }, [currentSong, songs, isShuffle, playSong]);
  
  // Seek to a specific position in the song
  const seekTo = useCallback(async (position: number) => {
    if (soundRef.current && currentSong?.uri) {
      await soundRef.current.setPositionAsync(position * 1000); // Convert to milliseconds
    }
    setProgress(position);
  }, [currentSong]);
  
  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);
  
  // Toggle repeat mode
  const toggleRepeatMode = useCallback(() => {
    setRepeatMode(prev => (prev + 1) % 3);
  }, []);
  
  const value = {
    songs,
    currentSong,
    isPlaying,
    isShuffle,
    repeatMode,
    progress,
    duration,
    isPlayerReady,
    isLoading,
    playSong,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    seekTo,
    toggleShuffle,
    toggleRepeatMode,
    loadSongs,
    hasPermission,
    requestPermission,
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteSongs,
  };
  
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}; 
