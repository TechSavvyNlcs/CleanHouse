module.exports = {
  root: true,
<<<<<<< HEAD
  extends: '@react-native',
=======
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
>>>>>>> 146c5f8310c0cd9663e53514746aa41ee8b31137
};
