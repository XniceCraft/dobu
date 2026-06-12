import { configApp, RULES_LIST } from '@adonisjs/eslint-config'
import eslint from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

const frontendConfig = {
  name: 'Inertia Frontend',
  files: ['./inertia/**/*.{ts,tsx}'],
  languageOptions: react.configs.flat['jsx-runtime'].languageOptions,
  plugins: {
    ...react.configs.flat['jsx-runtime'].plugins,
    ...reactHooks.configs.flat.recommended.plugins,
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
