module.exports = function(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [
        "react-native-track-player",
        {
          serviceJSName: "./service.js"
        }
      ]
    ]
  };
}; 