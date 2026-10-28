module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-screens|@react-native-async-storage|@react-native-vector-icons)/)',
  ],
  moduleNameMapper: {
    '\\.(ttf|otf)$': '<rootDir>/__mocks__/fontMock.js',
  },
};
