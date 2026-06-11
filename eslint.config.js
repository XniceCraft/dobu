import { configApp, RULES_LIST } from '@adonisjs/eslint-config'
import eslint from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

const frontendConfig = {
  name: 'Inertia Frontend',
  files: ['./inertia/**/*.{ts,tsx}'],
  ...eslint.configs.recommended,
  ...react.configs.flat.recommended,
  ...reactHooks.configs.flat.recommended,
  rules: {
    ...RULES_LIST,
    '@unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'react-hooks/rules-of-hooks': 'error',
  },
}

export default configApp(frontendConfig)
