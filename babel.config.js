module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
        verbose: false,
        safe: false,
      },
    ],
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
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
}
