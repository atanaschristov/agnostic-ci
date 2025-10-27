module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/*.test.ts'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	globals: {
		'ts-jest': {
			// TODO check why every time a change happens all tests fail
			tsconfig: 'tsconfig.lib.json',
		},
	},
};
