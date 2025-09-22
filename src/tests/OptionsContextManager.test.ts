import { OptionsContextManager } from '../lib/OptionsContextManager';

describe('OptionsContextManager', () => {
	let contextManager: OptionsContextManager | undefined = undefined;

	beforeAll(() => {
		contextManager = new OptionsContextManager();
	});

	afterAll(() => {
		contextManager = undefined;
	});

	it('should be singleton', () => {
		const contextManager1 = new OptionsContextManager();
		expect(contextManager1).toStrictEqual(contextManager);
	});

	// it('should be able to reset the instance', () => {
	// 	const contextManager1 = new OptionsContextManager({ resetInstance: true });
	// 	expect(contextManager1).not.toBe(contextManager);
	// 	expect(contextManager1).toBeInstanceOf(OptionsContextManager);
	// });
});
