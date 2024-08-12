import jseslint from '@eslint/js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { project: './tsconfig.json', ecmaFeatures: { jsx: true } },
    },
    ignores: ['node_modules', 'dist', 'coverage', 'build'],
  },

  {
    plugins: { '@eslint/js': jseslint },
    rules: {
      ...jseslint.configs.recommended.rules,
    },
  },
  {
    plugins: { '@typescript-eslint': tsEslint },
    rules: {
      ...tsEslint.configs.recommended.rules,
      ...tsEslint.configs.recommended.rules['requiring-type-checking'],
    },
  },
  {
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      ...eslintPluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'warn',
    },
  },
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // Packages. `nestjs` related packages come first.
              '^@nestjs',
              '^@prisma',
              '^express',
              '^@?\\w',
              // Important! to not have line breaks between groups
              '^[^.]',
              '^\\.',
              // Internal packages.
              '^(filters|modules|common)(/.*|$)',
              // Side effect imports.
              '^\\u0000',
              // Parent imports. Put `..` last.
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              // Other relative imports. Put same-folder imports and `.` last.
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
          ],
        },
      ],
    },
  },
];
