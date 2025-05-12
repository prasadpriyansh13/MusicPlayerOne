// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // This is required for Expo projects
  projectRoot: __dirname,
});

// Remove any CSS transformer config
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

module.exports = config; 