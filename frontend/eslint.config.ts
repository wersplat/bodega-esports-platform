export default {

  root: true,
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_', 
      varsIgnorePattern: '^_' 
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-prototype-builtins': 'off',
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-cond-assign': ['warn', 'except-parens'],
    'no-fallthrough': 'warn',
    'no-case-declarations': 'warn',
  },
  ignorePatterns: [
    '.next/**/*',
    'node_modules/**/*',
    'out/**/*',
    'dist/**/*',
    'build/**/*',
    'public/**/*',
    '*.d.ts',
  ],
};
