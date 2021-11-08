export default {
	testEnvironment: 'jest-environment-node',
	transform: {},
	globalTeardown: './tests/teardownTests.js',
	setupFilesAfterEnv: ['./jest.setup.js'],
};
