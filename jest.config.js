module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/*.test.ts'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.es6.json',
		},
	},
};
