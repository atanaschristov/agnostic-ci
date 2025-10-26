import { CLIContextManager } from '../lib/CLIContextManager';
import { ContextManager } from '../lib/ContextManager';
import { ContextManagerBase } from '../lib/ContextManagerBase';
import { OptionsContextManager } from '../lib/OptionsContextManager';
import { IResponse } from '../lib/types';

describe('ContextManager', () => {
	it('should create the default manager instance if no instance is provided', () => {
		const contextManager = new ContextManager();
		expect(contextManager.managerInstance).toBeInstanceOf(CLIContextManager);
	});

	it('should throw an UnsupportedManagerType error if the provided manager type is not recognized', () => {
		try {
			// @ts-expect-error Sending an unknown ManagerType for testing purposes
			new ContextManager('test');
		} catch (response) {
			expect(response).toBeInstanceOf(Error);
			expect((response as IResponse).message).toContain('Unsupported context manager type:');
		}
	});

	it('should create be a singleton', () => {
		const contextManager1 = new ContextManager('options');
		const contextManager2 = new ContextManager('options');
		expect(contextManager1).toBe(contextManager2);
		expect(contextManager1.managerInstance).toBeInstanceOf(ContextManagerBase);
	});

	it('should create a CLIContextManager manager instance but the context wrapper instance should be the same', () => {
		const contextManager1 = new ContextManager('options');
		expect(contextManager1.managerInstance).toBeInstanceOf(ContextManagerBase);

		const contextManager2 = new ContextManager('cli');
		expect(contextManager1).toBe(contextManager2);
		expect(contextManager2.managerInstance).toBeInstanceOf(CLIContextManager);
		expect(contextManager1.managerInstance).toBeInstanceOf(CLIContextManager);
	});

	it('should create a OptionsContextManager instance', () => {
		const contextManager = new ContextManager('options');
		expect(contextManager.managerInstance).toBeInstanceOf(OptionsContextManager);
	});
});
