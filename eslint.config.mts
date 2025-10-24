import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		ignores: ['coverage/**', './**/dist/**', 'node_modules/**'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		plugins: { js },
		settings: {
			react: {
				version: 'detect',
			},
		},
		extends: ['js/recommended'],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
	},
	tseslint.configs.recommended,
	{
		files: ['**/*.{jsx,tsx}'],
		...pluginReact.configs.flat.recommended,
		rules: {
			'react/react-in-jsx-scope': 'off',
		},
	},
	{
		files: ['**/*.json'],
		ignores: ['**/package-lock.json'],
		plugins: { json },
		language: 'json/json',
		extends: ['json/recommended'],
	},
	{
		files: ['**/*.jsonc'],
		plugins: { json },
		language: 'json/jsonc',
		extends: ['json/recommended'],
	},
	{
		files: ['**/*.cjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		rules: {
			semi: 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^___',
					argsIgnorePattern: '^___',
				},
			],
			'no-console': 'warn',
		},
	},
	{
		files: ['**/*.css'],
		plugins: { css },
		language: 'css/css',
		extends: ['css/recommended'],
	},
	// TODO; find a scss linting plugin
	// {
	// 	files: ['**/*.scss'],
	// 	plugins: { css },
	// 	language: 'css/css',
	// 	extends: ['css/recommended'],
	// 	rules: {
	// 		'css/use-baseline': 'off',
	// 	},
	// },
]);
