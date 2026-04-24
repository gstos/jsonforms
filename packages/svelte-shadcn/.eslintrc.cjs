module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.svelte'],
  },
  // Exclude generated and dependency directories
  ignorePatterns: ['/*', '!/src', '!/tests'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  rules: {
    // Svelte 5 patterns: $props() without full destructuring and reactive
    // values used in sync init context are intentional patterns in this package.
    'svelte/valid-compile': 'warn',
    // Allow explicit any in framework binding code and tests
    '@typescript-eslint/no-explicit-any': 'off',
    // Allow empty functions (e.g. no-op dispatch stubs in tests)
    '@typescript-eslint/no-empty-function': 'off',
    // Allow non-null assertions in framework binding code
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Base rule must be disabled to avoid incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};
