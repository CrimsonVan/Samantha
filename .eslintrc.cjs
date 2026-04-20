// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true
  },

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'no-undef': 'error', // 禁止出现未使用的变量
    // 'prefer-arrow-callback': 'off',
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    'no-unused-vars': 'error', // 禁止出现未使用的变量
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prefer-const': 'off',
    'no-constant-condition': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-console': 'error',
    'react/display-name': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
