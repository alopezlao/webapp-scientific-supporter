import js from '@eslint/js'
import globals from 'globals'
import parser from '@typescript-eslint/parser'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'

export default [
  {
    ignores: ['node_modules', 'dist', '.next', 'pb_data'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginTypeScript.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.config.js', '**/*.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
]
