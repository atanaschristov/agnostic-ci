import { defineConfig, Format } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

const libOptions = {
	entry: ['src/lib/index.ts'],
	format: ['cjs'] as Format[],
	tsconfig: 'tsconfig.lib.json',
	minify: true,
	sourcemap: true,
};

const mockOptions = {
	entry: ['src/__mocks__/contexts/index.ts'],
	format: ['cjs'] as Format[],
};

const libConfigs = [
	{
		...libOptions,
		format: [...libOptions.format, 'esm'] as Format[],
		outDir: 'dist/lib/es2020',
		target: 'es2020',
	},
	{
		...libOptions,
		outDir: 'dist/lib/es5',
		target: 'es5',
	},
];

const mockConfigs = [
	{
		...mockOptions,
		format: [...libOptions.format, 'esm'] as Format[],
		outDir: 'dist/mocks/es2020',
		target: 'es2020',
	},
	{
		...mockOptions,
		outDir: 'dist/mocks/es5',
		target: 'es5',
	},
];

const configs = [...libConfigs, ...(isProduction ? [] : mockConfigs)];

export default defineConfig(configs);
