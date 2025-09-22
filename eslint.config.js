// eslint.config.js
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {
			semi: 'error', // Require semicolons
			'no-unused-vars': 'warn', // Warn about unused variables
			'no-console': 'warn', // Warn about console statements
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off', // Disable this rule in TS/TSX files
		},
	},
]);
