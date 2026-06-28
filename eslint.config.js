import { configApp, PLUGINS_LIST } from '@adonisjs/eslint-config'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

const frontendConfig = {
  name: 'Inertia Frontend',
  files: ['./inertia/**/*.{ts,tsx}'],
  plugins: {
    ...PLUGINS_LIST,
    react,
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
    ...prettier.plugins,
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      React: 'readonly',
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [tseslint.configs.recommended],
  rules: {
    ...react.configs.flat['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
    '@unicorn/filename-case': ['error', { case: 'kebabCase' }],
    '@unicorn/no-for-loop': 'off',
    'jsx-a11y/alt-text': [
      'warn',
      {
        elements: ['img'],
        img: ['Image'],
      },
    ],
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',

    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-key': 'error',

    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useGSAP',
      },
    ],

    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
        disallowTypeAnnotations: false,
      },
    ],

    ...prettier.rules,
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
}

export default configApp(frontendConfig)
