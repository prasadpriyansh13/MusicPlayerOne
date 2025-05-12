import { Song } from '../contexts/MusicContext';

/**
 * Format seconds to MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Clean up song title, especially for filenames
 */
export const getDisplayTitle = (song: Song): string => {
  if (!song.title) return 'Unknown Title';
  
  // If it's a real file, try to clean up the filename
  if (song.filename) {
    // Remove file extension
    let cleanTitle = song.title.replace(/\.[^/.]+$/, '');
    
    // Remove track numbers (e.g., "01 -", "01.", "01 ")
    cleanTitle = cleanTitle.replace(/^\d+[\s.-]+/, '');
    
    // Remove any common prefixes or tags
    cleanTitle = cleanTitle.replace(/^\[.*?\]/, '').trim();
    
    return cleanTitle || 'Unknown Title';
  }
  
  return song.title;
};

/**
 * Get subtitle display text (artist and album)
 */
export const getSubtitleText = (song: Song): string => {
  const artist = song.artist || 'Unknown Artist';
  const album = song.album || '';
  
  if (album) {
    return `${artist} • ${album}`;
  }
  
  return artist;
}; 