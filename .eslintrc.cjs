/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');
const { includeIgnoreFile } = require('@eslint/compat');

const path = require('node:path');
const gitignorePath = path.resolve(__dirname, '.gitignore');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  ignorePatterns: includeIgnoreFile(gitignorePath).ignores,
  extends: [
    './packages/web/.eslintrc-auto-import.json',
    '@unocss',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/no-v-html': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ]
  }
};
