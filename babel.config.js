module.exports = {
  presets: ["module:@react-native/babel-preset", "nativewind/babel"],
  plugins: [[
    "module:react-native-dotenv",
    {
      moduleName: "@env",
      path: ".env",
      blacklist: null, // or specify keys to exclude
      whitelist: null, // or specify keys to include
      safe: false, // set to true for error if variables are missing
      allowUndefined: true, // allow undefined variables
    },
  ], ["module-resolver", {
    root: ["./"],
    extensions: [".js", ".ts", ".tsx", ".jsx"],

    alias: {
      "@": "./",
      "tailwind.config": "./tailwind.config.js"
    }
  }]],
  // env: {
  //   production: {
  //     plugins: ['react-native-paper/babel'],
  //   },
  // },
};
