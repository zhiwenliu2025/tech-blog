import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import configTypeScript from '@typescript-eslint/eslint-plugin'
import parserTypeScript from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      '.vercel/**',
      'dist/**',
      'node_modules/**',
      '*.d.ts',
      'commitlint.config.js'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript
      },
      globals: {
        defineNuxtConfig: 'readonly',
        process: 'readonly',
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        IntersectionObserverInit: 'readonly',
        HTMLElementEventMap: 'readonly',
        module: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': configTypeScript
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-empty': 'off',
      'no-useless-escape': 'off'
    }
  }
]
