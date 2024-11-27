module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blacklist: null, // or specify keys to exclude
        whitelist: null, // or specify keys to include
        safe: false, // set to true for error if variables are missing
        allowUndefined: true, // allow undefined variables
      },
      "react-native-reanimated/plugin",
    ],
  ],
  // env: {
  //   production: {
  //     plugins: ['react-native-paper/babel'],
  //   },
  // },
};
