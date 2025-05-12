# MusicPlayerOne

A sleek, modern music player app built with React Native and NativeWind. This app allows you to play music from your device with a beautiful UI and smooth animations.

## Features

- Play music from local folders stored on your device
- Sleek, modern UI with a purplish-pinkish color scheme
- Dark mode support that can be toggled in settings
- Music browsing screen showing local songs with metadata
- Library screen to browse songs by artist, album, etc.
- Custom music player UI with a beautiful visualizer
- Mini-player that persists across screens
- Smooth animations and transitions

## Tech Stack

- React Native
- NativeWind (Tailwind CSS for React Native)
- Expo Router for navigation
- React Native Track Player for audio playback
- React Native Reanimated for animations
- Bottom Sheet for the player modal

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Screenshots

[Coming soon]

## Project Structure

```
MusicPlayerOne/
├── app/                 # Main app screens and navigation
│   ├── (tabs)/          # Tab-based navigation
│   │   ├── index.tsx    # All songs screen
│   │   ├── library.tsx  # Library screen
│   │   └── settings.tsx # Settings screen
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Entry point
├── assets/              # Static assets
├── components/          # UI components
│   ├── common/          # Reusable components
│   ├── player/          # Music player components
│   └── library/         # Library screen components
├── contexts/            # React contexts
│   ├── ThemeContext.tsx # Theme management
│   └── MusicContext.tsx # Music player state
├── hooks/               # Custom hooks
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

## Contributions

Contributions, issues, and feature requests are welcome!

## License

MIT
