module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['nativewind/babel'],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@routes': './src/routes',
          '@screens': './src/screens',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@config': './src/config',
          '@services': './src/services',
          '@storage': './src/storage',
        },
      },
    ],
  ],
}
