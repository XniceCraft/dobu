import { configApp, PLUGINS_LIST, RULES_LIST } from '@adonisjs/eslint-config'
import eslint from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

const frontendConfig = {
  name: 'Inertia Frontend',
  files: ['./inertia/**/*.{ts,tsx}'],
  languageOptions: {
    globals: {
      ...globals.browser,
      React: 'readonly',
    },
    ...react.configs.flat['jsx-runtime'].languageOptions,
  },
  plugins: {
    ...PLUGINS_LIST,
    ...react.configs.flat['jsx-runtime'].plugins,
    ...reactHooks.configs.flat.recommended.plugins,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...RULES_LIST,
    ...react.configs.flat['jsx-runtime'].rules,
    ...reactHooks.configs.flat.recommended.rules,
    ...eslint.configs.recommended.rules,
    '@unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'react-hooks/rules-of-hooks': 'error',
  },
}

export default configApp(frontendConfig)
