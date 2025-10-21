import { sha1 } from 'object-hash';

import INTERNAL from '../lib/internalCommands';
import INTERNAL_STRINGS from '../lib/strings';

import { CLIContextManager } from '../lib/CLIContextManager';
import {
	COMMAND_SPLITTING_SYMBOL,
	I18N_DEFAULT_NS,
	I18N_EXTERNAL_NS,
	I18N_FALLBACK_LANGUAGE,
	PROMPT_DEFAULT,
	PROMPT_FORMAT,
	PROMPT_SPLITTING_SYMBOL,
	PROMPT_SUFFIX,
} from '../lib/constants';
import { CONTEXT_NAMES } from '../__mocks__/contexts';
import { ICommands, IContextContainer, IContextDefinition, ILocaleStrings } from '../lib/types';
import { COMMAND_NAMES as INTERNAL_COMMAND_NAMES } from '../lib/internalCommands/constants';
import { COMMAND_NAMES as EXTERNAL_COMMAND_NAMES } from '../__mocks__/contexts';

describe('CLIContextManager', () => {
	const {
		ROOT: { COLOR, FIRST_NAME, LIST, LENGTH, AGE, UI_SETTINGS },
	} = EXTERNAL_COMMAND_NAMES;
	const {
		HELP,
		BACK,
		CONFIG,
		PROMPT_FORMAT: PROMPT_FORMAT_COMMAND,
		PROMPT_PREFIX: PROMPT_PREFIX_COMMAND,
		PROMPT_SUFFIX: PROMPT_SUFFIX_COMMAND,
		PROMPT_SPLITTING_SYMBOL: PROMPT_SPLITTING_SYMBOL_COMMAND,
	} = INTERNAL_COMMAND_NAMES;

	const { ROOT_CONTEXT, CHARACTER_CONTEXT, BODY_CONTEXT, HEAD_CONTEXT, HAIR_CONTEXT } =
		CONTEXT_NAMES.ROOT;
	const { SETTINGS_CONTEXT } = CONTEXT_NAMES.SETTINGS;
	let contextManager: CLIContextManager | undefined;
	let MockedContexts: IContextContainer | undefined;
	let MockedCommandStrings: ILocaleStrings;

	beforeAll(async () => {
		const Mocks = await import('../__mocks__/contexts');
		contextManager = new CLIContextManager();

		MockedContexts = Mocks.default;
		MockedCommandStrings = Mocks.COMMAND_STRINGS;
	});
	afterAll(async () => {
		jest.resetModules();
		if (MockedContexts) MockedContexts = undefined;
	});

	it('should be singleton', () => {
		const contextManager2 = new CLIContextManager();
		expect(contextManager).toStrictEqual(contextManager2);
	});

	describe('validates prompts', () => {
		it('should set default prompt if the context manager is not initialized', () => {
			expect(contextManager?.prompt).toBe(PROMPT_DEFAULT);
		});

		it('should use the context name as a prompt for the first found context if there are not contexts with set isInitialContext flag', async () => {
			const ROOT_CONTEXT_NODE = (MockedContexts?.[ROOT_CONTEXT] || {}) as IContextDefinition;
			ROOT_CONTEXT_NODE.isInitialContext = false; // RESET THE FLAG OF THE ALREADY SET ROOT CONTEXT
			const firstContext = (Object.keys(MockedContexts || {}) || [])[0];
			const EXPECTED_PROMPT = `${firstContext} ${PROMPT_SUFFIX} `;

			contextManager?.initialize(MockedContexts || {});

			expect(contextManager?.prompt).toBe(EXPECTED_PROMPT);
		});

		it('should use the context name as a prompt for the first found context with set isInitialContext flag', async () => {
			const EXPECTED_PROMPT = `${MockedContexts?.[ROOT_CONTEXT].name} ${PROMPT_SUFFIX} `;
			if (!MockedContexts) throw new Error('Mocked contexts are not defined');

			MockedContexts[SETTINGS_CONTEXT].isInitialContext = true;
			MockedContexts[ROOT_CONTEXT].isInitialContext = true;

			contextManager?.initialize(MockedContexts);
			expect(contextManager?.prompt).toBe(EXPECTED_PROMPT);
		});
	});

	describe('validates CLI context manager configuration', () => {
		it('validates the default configuration', () => {
			const configuration = contextManager?.getConfiguration();
			expect(configuration).toBeDefined();
			expect(configuration?.promptFormat).toBe(PROMPT_FORMAT);
			expect(configuration?.promptSuffix).toBe(PROMPT_SUFFIX);
			expect(configuration?.promptPrefix).toBe('');
			expect(configuration?.promptSplittingSymbol).toBe(PROMPT_SPLITTING_SYMBOL);
		});
	});

	describe('validates implicit global commands', () => {
		beforeEach(async () => {
			contextManager?.initialize(MockedContexts || {});
		});

		afterEach(async () => {
			jest.clearAllMocks();
			jest.resetModules();
		});

		it('can be accessed from every context. They are global', async () => {
			const implicitCommandNames: string[] = [];
			for (const [key] of Object.entries(INTERNAL.commands.common)) {
				implicitCommandNames.push(key);
			}
			for (const [key] of Object.entries(INTERNAL.commands.cli)) {
				if (!implicitCommandNames.includes(key)) implicitCommandNames.push(key);
			}

			const { contextContainer } = contextManager || {};

			expect(contextContainer).toBeDefined();
			if (contextContainer) {
				for (const [, value] of Object.entries(contextContainer)) {
					implicitCommandNames.map((implicitCommandName) =>
						expect(Object.keys(value?.commands).includes(implicitCommandName)).toBeTruthy(),
					);
				}
			}
		});

		it('generates hash for each of the implicit command', async () => {
			const commandHashes = contextManager?.['__commandHashes'] as Set<string>;

			const commandIterator = (commands: ICommands) => {
				for (const [, command] of Object.entries(commands)) {
					expect(commandHashes.has(sha1(command))).toBeTruthy();
				}
			};

			commandIterator(INTERNAL.commands.cli);

			for (const [, context] of Object.entries(INTERNAL.contexts.cli)) {
				commandIterator(context.commands);
			}
		});

		it('can be overwritten with a custom command command', async () => {
			// The help command in the mocks in the MockedContexts[CHARACTER_CONTEXT]
			// is customized and overrides the implicit help command, only for the corresponding context
			// defining a different action
			// When the command is executed the response should contain the custom action
			// and not the implicit one.
			// The implicit behavior should be ignored
			const COMMAND = HELP;
			const customHelpCommand = MockedContexts?.[CHARACTER_CONTEXT].commands[COMMAND];
			const implicitHelpCommand = MockedContexts?.[ROOT_CONTEXT].commands[COMMAND];
			const mockedImplicitlyExecuteHelpAction = jest.spyOn(
				CLIContextManager.prototype,
				// @ts-expect-error Using the private property for testing purposes
				'implicitlyExecuteHelpAction',
			);

			//1. executes the command in a context where it is not overridden, checks the actions and makes sure
			// the so the implicit method is called
			contextManager?.send(COMMAND);
			let { actions, info } = contextManager?.response || {};
			let action = actions?.find((action) => action.name === implicitHelpCommand?.action?.name);
			expect(info?.command?.name).toBe(COMMAND);
			expect(action?.name).toBe(implicitHelpCommand?.action?.name);
			expect(action?.name).not.toBe(customHelpCommand?.action?.name);
			expect(mockedImplicitlyExecuteHelpAction).toHaveBeenCalledTimes(1);

			//2. executes the command in a context where it is not overridden again
			// and verify the implicit method is called one more time
			contextManager?.send(COMMAND);
			expect(mockedImplicitlyExecuteHelpAction).toHaveBeenCalledTimes(2);

			//3. execute the command in a context where it is customized
			// and verify the implicit method has not been called one more time, but the result
			// contains the custom action
			contextManager?.send([CHARACTER_CONTEXT, COMMAND].join(COMMAND_SPLITTING_SYMBOL));
			actions = contextManager?.response?.actions;
			info = contextManager?.response?.info;
			action = actions?.find((action) => action.name === customHelpCommand?.action?.name);
			expect(info?.command?.name).toBe(COMMAND);
			expect(action?.name).toBe(customHelpCommand?.action?.name);
			expect(action?.name).not.toBe(implicitHelpCommand?.action?.name);
			expect(mockedImplicitlyExecuteHelpAction).toHaveBeenCalledTimes(2);
		});

		it("doesn't have the internal behavior if the command is overwritten", async () => {
			contextManager?.send(HELP);
			const { response } = contextManager || {};

			expect(response?.info);
			// TODO
		});

		describe(BACK, () => {
			let spy: jest.SpyInstance;
			beforeEach(async () => {
				spy = jest.spyOn(console, 'error').mockImplementation(() => null);
				contextManager?.initialize(MockedContexts || {});
			});

			afterEach(async () => {
				if (spy) spy.mockRestore();
				jest.resetModules();
			});

			it("shouldn't exist and throw an UnrecognizedCommand error if executed from the root context", async () => {
				contextManager?.send(BACK);
				const { message, success } = contextManager?.response || {};
				const partialError =
					INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].ERRORS.UnrecognizedCommand.split("'")[0];

				expect(success).toBeFalsy();
				expect(message).toContain(`${partialError}'${BACK}'`);
			});

			it('accepts positive numbers parameters only', async () => {
				const COMMAND = [CHARACTER_CONTEXT, BACK];
				let PARAMETER: string | number = 1;
				contextManager?.send([...COMMAND, PARAMETER].join(COMMAND_SPLITTING_SYMBOL));
				let response = contextManager?.response;
				expect(response?.success).toBeTruthy();

				PARAMETER = 211;
				contextManager?.send([...COMMAND, PARAMETER].join(COMMAND_SPLITTING_SYMBOL));
				response = contextManager?.response;
				expect(response?.success).toBeTruthy();

				PARAMETER = '000';
				contextManager?.send([...COMMAND, PARAMETER].join(COMMAND_SPLITTING_SYMBOL));
				response = contextManager?.response;
				expect(response?.success).toBeTruthy();

				PARAMETER = 'test';
				contextManager?.send([...COMMAND, PARAMETER].join(COMMAND_SPLITTING_SYMBOL));
				response = contextManager?.response;

				expect(response?.success).toBeFalsy();

				PARAMETER = -1;
				contextManager?.send([...COMMAND, PARAMETER].join(COMMAND_SPLITTING_SYMBOL));
				response = contextManager?.response;

				expect(response?.success).toBeFalsy();
			});

			it('goes back one level if executed without parameters and we are not at the root level', async () => {
				const BODY_PROMPT = `${MockedContexts?.[BODY_CONTEXT].name} ${PROMPT_SUFFIX} `;
				const CHARACTER_PROMPT = `${MockedContexts?.[CHARACTER_CONTEXT].name} ${PROMPT_SUFFIX} `;

				contextManager?.send([CHARACTER_CONTEXT, BODY_CONTEXT].join(COMMAND_SPLITTING_SYMBOL));
				let info = contextManager?.response?.info;

				expect(info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(BODY_PROMPT);
				expect(contextManager?.contextDepth).toHaveLength(3);
				expect(info?.contextDepth).toHaveLength(3);

				contextManager?.send(BACK);
				info = contextManager?.response?.info;

				expect(info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(CHARACTER_PROMPT);
				expect(info?.contextDepth).toHaveLength(2);
			});

			it('goes back 3 levels if 3 is passed as a param', async () => {
				const HEAD_PROMPT = `${MockedContexts?.[HEAD_CONTEXT].name} ${PROMPT_SUFFIX} `;
				const ROOT_PROMPT = `${MockedContexts?.[ROOT_CONTEXT].name} ${PROMPT_SUFFIX} `;
				const COMMAND = [BACK, 3]; // Trying to go 3 levels back

				contextManager?.send(
					[CHARACTER_CONTEXT, BODY_CONTEXT, HEAD_CONTEXT].join(COMMAND_SPLITTING_SYMBOL),
				);
				let info = contextManager?.response?.info;

				expect(info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(HEAD_PROMPT);
				expect(contextManager?.contextDepth).toHaveLength(4);
				expect(info?.contextDepth).toHaveLength(4);

				contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
				info = contextManager?.response?.info;

				expect(info?.prompt).toBe(ROOT_PROMPT);
				expect(info?.contextDepth).toHaveLength(1);
			});

			it('goes back to the root level if the param is bigger then the actual depth', async () => {
				const CONTEXT_GRANDCHILD_PROMPT = `${MockedContexts?.[HEAD_CONTEXT].name} ${PROMPT_SUFFIX} `;
				const ROOT_PROMPT = `${MockedContexts?.[ROOT_CONTEXT].name} ${PROMPT_SUFFIX} `;
				const COMMAND = [BACK, 50]; // Trying to go 50 levels back

				contextManager?.send(
					[CHARACTER_CONTEXT, BODY_CONTEXT, HEAD_CONTEXT].join(COMMAND_SPLITTING_SYMBOL),
				);
				let info = contextManager?.response?.info;

				expect(info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
					CONTEXT_GRANDCHILD_PROMPT,
				);
				expect(contextManager?.contextDepth).toHaveLength(4);
				expect(info?.contextDepth).toHaveLength(4);

				contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
				info = contextManager?.response?.info;

				expect(info?.prompt).toBe(ROOT_PROMPT);
				expect(info?.contextDepth).toHaveLength(1);
			});
		});

		describe('help', () => {
			it('gets information for all commands executed without parameters', async () => {
				// TODO
			});

			it('gets information for command passed as parameters', async () => {
				// contextManager?.send('config lang cz');
				// contextManager?.send('help help');
				// contextManager?.send('config lang en');
				// const { success, message } = contextManager?.response || {};
			});
		});

		describe('config', () => {
			it('enters the config context', () => {
				const COMMAND = CONFIG;
				contextManager?.send(COMMAND);
				const { prompt, response } = contextManager || {};
				const { success, message } = response || {};
				expect(success).toBeTruthy();
				expect(message).toBe(INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].HINTS.ProcessedCommand);
				expect(prompt).toBe(
					`${ROOT_CONTEXT}${PROMPT_SPLITTING_SYMBOL}${COMMAND} ${PROMPT_SUFFIX} `,
				);
			});

			it('enters the config context using its alias', () => {
				const CONTEXT = CONFIG;
				const COMMAND = MockedContexts?.[ROOT_CONTEXT]?.commands?.[CONTEXT]?.aliases?.[0];

				contextManager?.send(COMMAND);
				const { prompt, response } = contextManager || {};
				const { success, message } = response || {};
				expect(success).toBeTruthy();
				expect(message).toBe(INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].HINTS.ProcessedCommand);
				expect(prompt).toBe(
					`${ROOT_CONTEXT}${PROMPT_SPLITTING_SYMBOL}${CONTEXT} ${PROMPT_SUFFIX} `,
				);
			});

			it('throws na error if we try to go to config if we are already there', () => {
				const COMMAND = CONFIG;

				contextManager?.send(COMMAND);
				contextManager?.send(COMMAND);
				const { response } = contextManager || {};
				const { success, message } = response || {};
				const partialErrorMessage =
					INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].ERRORS.UnrecognizedCommand.split("'")[0];
				expect(success).toBeFalsy();
				expect(message).toContain(`${partialErrorMessage}'${COMMAND}'`);
			});

			it('validates the promptFormat command', () => {
				const CONTEXT = CONFIG;
				contextManager?.send(CONTEXT); // go to the correct context

				const testPrompt = (parameter: string, expectedPrompt: string) => {
					const COMMAND = [PROMPT_FORMAT_COMMAND, parameter];
					contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
					const prompt = contextManager?.prompt;
					expect(prompt).toBe(expectedPrompt);
				};

				const getExpectedPrompt = (elements: string[]) => {
					const SUFFIX = elements.pop();
					const PROMPT_SUFFIX =
						(elements.length > 0 ? COMMAND_SPLITTING_SYMBOL : '') +
						`${SUFFIX}${COMMAND_SPLITTING_SYMBOL}`;

					return elements.join(PROMPT_SPLITTING_SYMBOL) + PROMPT_SUFFIX;
				};

				testPrompt('f', getExpectedPrompt([ROOT_CONTEXT, CONTEXT, PROMPT_SUFFIX]));

				testPrompt('n', getExpectedPrompt([CONTEXT, PROMPT_SUFFIX]));

				testPrompt('b', getExpectedPrompt([PROMPT_SUFFIX]));
			});

			it('validates the promptSuffix command', () => {
				const NEW_SUFFIX = '$$';
				const COMMAND = [CONFIG, PROMPT_SUFFIX_COMMAND, NEW_SUFFIX];
				contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
				const prompt = contextManager?.prompt;
				expect(prompt).toContain(`${NEW_SUFFIX} `);
			});

			it('validates the promptPrefix command', () => {
				const NEW_PREFIX = '{';
				const COMMAND = [CONFIG, PROMPT_PREFIX_COMMAND, NEW_PREFIX];
				contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
				const prompt = contextManager?.prompt;
				expect(prompt).toContain(NEW_PREFIX);
			});

			it('validates the splitting symbol command', () => {
				const NEW_PROMPT_SPLITTING_SYMBOL = ' : ';
				const ADDITIONAL_DUMMY_PARAMETER = ' blbbb aaasdasd ';
				const COMMAND = [
					CONFIG,
					PROMPT_SPLITTING_SYMBOL_COMMAND,
					`'${NEW_PROMPT_SPLITTING_SYMBOL}'`,
					`'${ADDITIONAL_DUMMY_PARAMETER}'`,
				];
				contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
				const prompt = contextManager?.prompt;
				expect(prompt).toContain(NEW_PROMPT_SPLITTING_SYMBOL);
			});
		});
	});

	describe('validates commands execution', () => {
		let spy: jest.SpyInstance;
		beforeEach(async () => {
			spy = jest.spyOn(console, 'error').mockImplementation(() => null);
			contextManager?.initialize(MockedContexts || {});
		});

		afterEach(async () => {
			if (spy) spy.mockRestore();
			jest.resetModules();
		});

		it("throws an error if a command doesn't have a corresponding action", () => {
			contextManager?.send('commandWithoutAnAction');
			const response = contextManager?.response;
			const { success, message } = response || {};

			expect(success).toBeFalsy();
			expect(message).toContain("Action for 'commandWithoutAnAction' is not found");
		});

		it("throws an error if a command doesn't have its corresponding commandNode", () => {
			contextManager?.send('commandWithoutANode');
			const response = contextManager?.response;
			const { success, message } = response || {};

			expect(success).toBeFalsy();
			expect(message).toContain("Command node not found for command 'commandWithoutANode'");
		});

		it('throws an error message with all possible commands if the command is not found', async () => {
			const contextCommands = Object.keys(contextManager?.currentContext?.commands || {});

			contextManager?.send('nonExistingContext');

			const { success, message } = contextManager?.response || {};

			expect(success).toBeFalsy();
			expect(message).toContain('');
			expect(message).toContain(contextCommands.join(', '));
		});

		it('throws an error message with the possible commands if the input causes unbigueuty', async () => {
			const PARTIAL_COMMAND = 'c';
			const FULL_COMMAND = [
				CHARACTER_CONTEXT,
				BODY_CONTEXT,
				HEAD_CONTEXT,
				HAIR_CONTEXT,
				PARTIAL_COMMAND,
			];

			if (!MockedContexts) throw new Error('Mocked commands are not defined');

			const filteredMockedCommands = Object.keys(MockedContexts?.[HAIR_CONTEXT].commands).filter(
				(el) => el.startsWith(PARTIAL_COMMAND),
			);

			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const { success, message } = contextManager?.response || {};

			expect(success).toBeFalsy();
			expect(message).toContain('Unrecognized or ambiguous command'); // TODO use the strings
			expect(message).toContain(filteredMockedCommands.join(', '));
		});

		it('simple input command which changes context (config)', async () => {
			const EXPECTED_PROMPT = `${MockedContexts?.config.name} ${PROMPT_SUFFIX} `;
			const mockedCommands = MockedContexts?.config.commands;
			if (!mockedCommands) throw new Error('Mocked commands are not defined');

			contextManager?.send('config');
			const { success, message, info } = contextManager?.response || {};

			expect(success).toBeTruthy();
			expect(message).toContain(INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].HINTS.ProcessedCommand);
			expect(info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(EXPECTED_PROMPT);
			expect(info?.contextDepth).toHaveLength(2); // including the root
			expect(contextManager?.currentContext?.commands).toBeDefined();
			if (contextManager?.currentContext?.commands)
				Object.keys(contextManager?.currentContext?.commands).forEach((cmd) => {
					expect(mockedCommands[cmd]).toBeDefined();
				});
		});

		it('should ignore the trailing spaces', async () => {
			const COMMAND = MockedContexts?.config.name;
			const EXPECTED_PROMPT = `${COMMAND} ${PROMPT_SUFFIX} `;
			const mockedCommands = MockedContexts?.config.commands;
			if (!mockedCommands) throw new Error('Mocked commands are not defined');

			contextManager?.send(`${COMMAND}  `);
			const { success, info } = contextManager?.response || {};

			expect(success).toBeTruthy();
			expect(info?.contextDepth).toHaveLength(2); // including the root
			expect(contextManager?.prompt).toContain(EXPECTED_PROMPT);
		});

		it('validates a simple command which results in single action (start)', async () => {
			const COMMAND_NAME = LIST;
			const EXPECTED_PROMPT = `${MockedContexts?.[ROOT_CONTEXT].name} ${PROMPT_SUFFIX} `;
			const EXPECTED_ACTION = MockedContexts?.[ROOT_CONTEXT].commands[COMMAND_NAME].action;

			contextManager?.send(COMMAND_NAME);
			const response = contextManager?.response;

			expect(response?.success).toBeTruthy();
			expect(response?.info?.prompt).toBe(EXPECTED_PROMPT);
			expect(response?.info?.contextDepth).toHaveLength(1); // root context
			expect(EXPECTED_ACTION?.name).toBeDefined();
			if (!EXPECTED_ACTION?.name) throw new Error('Expected action name is not defined');
			const actions = response?.actions?.map((action) => action.name);
			expect(actions).toHaveLength(1);
			expect(actions?.includes(EXPECTED_ACTION?.name)).toBeTruthy();
		});

		it(`validates commands changing a context within a context (${CHARACTER_CONTEXT} ${BODY_CONTEXT})`, async () => {
			const FULL_COMMAND = `${CHARACTER_CONTEXT}${COMMAND_SPLITTING_SYMBOL}${BODY_CONTEXT}`;

			if (!MockedContexts) throw new Error('Mocked commands are not defined');

			const EXPECTED_PROMPT = `${MockedContexts?.[BODY_CONTEXT].name} ${PROMPT_SUFFIX} `;
			const mockedCommands = MockedContexts?.[BODY_CONTEXT].commands;

			contextManager?.send(FULL_COMMAND);
			const { info } = contextManager?.response || {};

			expect(info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(EXPECTED_PROMPT);
			expect(info?.contextDepth).toHaveLength(3); // including the root
			expect(contextManager?.currentContext?.commands?.length).toBe(mockedCommands.length);
			Object.keys(mockedCommands).forEach((cmd) => {
				expect(contextManager?.currentContext?.commands[cmd]).toBeDefined();
			});
		});

		it(`validates when context looping back would aways make sure the root context is present at the beginning of the prompt(${CHARACTER_CONTEXT} ${BODY_CONTEXT} ${ROOT_CONTEXT}) and back`, async () => {
			let FULL_COMMAND: string[] = [];

			if (!MockedContexts) throw new Error('Mocked commands are not defined');

			let EXPECTED_PROMPT = `${ROOT_CONTEXT} ${PROMPT_SUFFIX} `;
			const mockedCommands = MockedContexts?.[ROOT_CONTEXT].commands;
			expect(contextManager?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
				EXPECTED_PROMPT,
			);
			expect(contextManager?.contextDepth).toHaveLength(1); // including the root

			FULL_COMMAND = [CHARACTER_CONTEXT, BODY_CONTEXT, ROOT_CONTEXT];
			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));

			expect(contextManager?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
				EXPECTED_PROMPT,
			);
			expect(contextManager?.contextDepth).toHaveLength(3); // including the root
			expect(contextManager?.currentContext?.commands?.length).toBe(mockedCommands.length);

			EXPECTED_PROMPT = `${BODY_CONTEXT} ${PROMPT_SUFFIX} `;
			contextManager?.send('back');
			expect(contextManager?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
				EXPECTED_PROMPT,
			);
			expect(contextManager?.contextDepth).toHaveLength(3); // including the root
			expect(contextManager?.currentContext?.commands?.length).toBe(mockedCommands.length);

			// Go back to root context within the body context, so we can go back to 10 levels
			EXPECTED_PROMPT = `${ROOT_CONTEXT} ${PROMPT_SUFFIX} `;
			contextManager?.send(`${ROOT_CONTEXT}`);
			expect(contextManager?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
				EXPECTED_PROMPT,
			);
			expect(contextManager?.contextDepth).toHaveLength(3); // including the root

			contextManager?.send('back 10');
			expect(contextManager?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
				EXPECTED_PROMPT,
			);
			expect(contextManager?.contextDepth).toHaveLength(1); // including the root
			expect(contextManager?.currentContext?.commands?.length).toBe(mockedCommands.length);
		});

		it('validates execution of multiple commands which results in multiple actions', async () => {
			const FULL_COMMAND = `${CHARACTER_CONTEXT}${COMMAND_SPLITTING_SYMBOL}${BODY_CONTEXT}`;

			if (!MockedContexts) throw new Error('Mocked commands are not defined');
			const characterAction = MockedContexts[ROOT_CONTEXT].commands?.[CHARACTER_CONTEXT].action;
			const commandAction = MockedContexts?.[CHARACTER_CONTEXT].commands?.[BODY_CONTEXT].action;

			contextManager?.send(FULL_COMMAND);

			const { actions } = contextManager?.response || {};

			expect(actions).toHaveLength(2);
			expect(characterAction?.name?.length).toBeGreaterThan(0);
			expect(commandAction?.name?.length).toBeGreaterThan(0);
			expect(actions?.filter((action) => action.name === characterAction?.name)).toHaveLength(1);
			expect(actions?.filter((action) => action.name === commandAction?.name)).toHaveLength(1);
		});

		it('shared commands among all contexts to be accessible', async () => {
			const COMMAND_NAME = 'list';
			const FULL_COMMAND = [CHARACTER_CONTEXT, BODY_CONTEXT, COMMAND_NAME];
			const EXPECTED_ACTION = MockedContexts?.[BODY_CONTEXT].commands[COMMAND_NAME].action;

			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const response = contextManager?.response;

			expect(response?.success).toBeTruthy();
			expect(response?.info?.contextDepth).toHaveLength(3); // counting the root context as well
			expect(EXPECTED_ACTION?.name).toBeDefined();
			if (!EXPECTED_ACTION?.name) throw new Error('Expected action name is not defined');
			expect(
				response?.actions?.map((action) => action.name)?.includes(EXPECTED_ACTION?.name),
			).toBeTruthy();
		});

		it(`execute a command from a context multiple levels deeper then the current context (${CHARACTER_CONTEXT} ${BODY_CONTEXT} ${HEAD_CONTEXT} ${HAIR_CONTEXT} color brown)`, async () => {
			const COMMAND = 'color';
			const PARAMETER = 'brown';
			const FULL_COMMAND = [
				CHARACTER_CONTEXT,
				BODY_CONTEXT,
				HEAD_CONTEXT,
				HAIR_CONTEXT,
				COMMAND,
				PARAMETER,
			];
			const EXPECTED_PROMPT = `${MockedContexts?.[HAIR_CONTEXT].name} ${PROMPT_SUFFIX} `;
			const mockedCommands = MockedContexts?.[HAIR_CONTEXT].commands;
			if (!mockedCommands) throw new Error('Mocked commands are not defined');

			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const info = contextManager?.response?.info;

			expect(info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(EXPECTED_PROMPT);
			expect(info?.contextDepth).toHaveLength(5); // including the root context
			expect(JSON.stringify(contextManager?.currentContext?.commands?.length)).toBe(
				JSON.stringify(mockedCommands?.length),
			);
			Object.keys(mockedCommands).forEach((cmd) => {
				expect(contextManager?.currentContext?.commands[cmd]).toBeDefined();
			});
		});

		it('recognize and execute partially written commands', async () => {
			// Get partial sub strings from the commands which should be autocompleted
			// when full command is executed
			const PARENT = CHARACTER_CONTEXT.substring(0, 2),
				CHILD = BODY_CONTEXT.substring(0, 2),
				GRANDCHILD = HEAD_CONTEXT.substring(0, 3),
				GRANDx2CHILD = HAIR_CONTEXT.substring(0, 2),
				COMMAND = 'col',
				PARAMETER = 'brown';
			const FULL_COMMAND = [PARENT, CHILD, GRANDCHILD, GRANDx2CHILD, COMMAND, PARAMETER];
			const EXPECTED_PROMPT = `${MockedContexts?.[HAIR_CONTEXT].name} ${PROMPT_SUFFIX} `;
			const EXPECTED_ACTION = MockedContexts?.[HAIR_CONTEXT].commands.color.action;

			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const response = contextManager?.response;

			expect(response?.success).toBeTruthy();
			expect(response?.info?.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
				EXPECTED_PROMPT,
			);
			expect(response?.info?.contextDepth).toHaveLength(5); // including the root context
			expect(EXPECTED_ACTION?.name).toBeDefined();

			if (!EXPECTED_ACTION?.name) throw new Error('Expected action name is not defined');

			expect(
				response?.actions?.map((action) => action.name)?.includes(EXPECTED_ACTION.name),
			).toBeTruthy();
		});
	});

	describe('validates the translation', () => {
		let customLocales: ILocaleStrings;
		const INITIAL_LANGUAGE = 'de';
		const REQUIRED_LANGUAGE = 'cz';
		beforeEach(async () => {
			customLocales = {
				[INITIAL_LANGUAGE]: {
					[I18N_EXTERNAL_NS]: { test: 'German Translation' },
					...(MockedCommandStrings?.[INITIAL_LANGUAGE] as ILocaleStrings),
				},
				[REQUIRED_LANGUAGE]: {
					[I18N_EXTERNAL_NS]: { test: 'Czech Translation' },
					...(MockedCommandStrings?.[REQUIRED_LANGUAGE] as ILocaleStrings),
				},
				[I18N_FALLBACK_LANGUAGE]: {
					...(MockedCommandStrings?.[I18N_FALLBACK_LANGUAGE] as ILocaleStrings),
				},
			};

			// TODO for the commandsNS(MockedCommandStrings), add czech language and make sure
			// that the dynamically loaded command locales are pushed in the localization library
			contextManager?.initialize(MockedContexts || {}, customLocales, 'de');
		});

		afterEach(async () => {
			jest.resetModules();
		});

		it('should translate the output strings, which are meant to be translated if the language is set during initialization', () => {
			const translated = contextManager?.['_translate']('test', { ns: I18N_EXTERNAL_NS });
			expect(translated).toBe(
				(
					(customLocales[INITIAL_LANGUAGE] as ILocaleStrings)[
						I18N_EXTERNAL_NS
					] as ILocaleStrings
				).test,
			);
		});

		it('should translate the output strings, which are meant to be translated if the language is set explicitly', () => {
			const COMMAND = ['config', 'lang', REQUIRED_LANGUAGE];
			contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const translated = contextManager?.['_translate']('test', { ns: I18N_EXTERNAL_NS });
			expect(translated).toBe(
				(
					(customLocales[REQUIRED_LANGUAGE] as ILocaleStrings)[
						I18N_EXTERNAL_NS
					] as ILocaleStrings
				).test,
			);
		});

		it('should translate the output message based on the explicitly set language', () => {
			const COMMAND = ['config', 'lang', REQUIRED_LANGUAGE];
			contextManager?.send(COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			contextManager?.send(``);
			const { success, message } = contextManager?.response || {};

			expect(success).toBeFalsy();
			expect(message).toContain(
				INTERNAL_STRINGS[REQUIRED_LANGUAGE][I18N_DEFAULT_NS].ERRORS.EmptyCli,
			);
		});
	});

	describe('validates alias functionality', () => {
		let spy: jest.SpyInstance;
		beforeEach(async () => {
			spy = jest.spyOn(console, 'error').mockImplementation(() => null);
			contextManager?.initialize(MockedContexts || {}, undefined, I18N_FALLBACK_LANGUAGE);
		});

		afterEach(async () => {
			if (spy) spy.mockRestore();
			jest.resetModules();
		});

		it('recognizes and executes context aliases', async () => {
			const ALIAS = MockedContexts?.[ROOT_CONTEXT]?.commands[UI_SETTINGS]?.aliases?.[0];
			expect(ALIAS?.length).toBeGreaterThan(0);

			contextManager?.send(ALIAS);
			const { success, message, info } = contextManager?.response || {};

			expect(message).toContain(INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].HINTS.ProcessedCommand);
			expect(success).toBeTruthy();

			if (!info) throw new Error('Response info is not defined');

			expect(info.prompt?.split(PROMPT_SPLITTING_SYMBOL)?.pop()).toBe(
				`${MockedContexts?.[SETTINGS_CONTEXT].name} ${PROMPT_SUFFIX} `,
			);
			expect(info.contextDepth).toHaveLength(2);
			expect(info.contextDepth?.[info.contextDepth.length - 1]).toBe(
				MockedContexts?.[SETTINGS_CONTEXT].name,
			);
		});

		it('recognizes and executes command aliases', async () => {
			const ALIAS = MockedContexts?.[ROOT_CONTEXT]?.commands[LIST]?.aliases?.[0];
			const ACTION_NAME = MockedContexts?.[ROOT_CONTEXT]?.commands[LIST]?.action?.name;
			expect(ALIAS?.length).toBeGreaterThan(0);
			expect(ACTION_NAME?.length).toBeGreaterThan(0);

			contextManager?.send(ALIAS);
			const { success, message, actions } = contextManager?.response || {};

			expect(success).toBeTruthy();
			expect(message).toContain(INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].HINTS.ProcessedCommand);
			expect(actions).toHaveLength(1);
			expect(actions?.[0].name).toBe(ACTION_NAME);
		});

		it('allows multiple aliases for the same command to be executed resulting in the same action', async () => {
			const helpAction = MockedContexts?.[ROOT_CONTEXT].commands.help.action;
			const implicitlyExecuteHelpAction = INTERNAL.commands.cli?.help?.action;
			const ALIASES = MockedContexts?.[ROOT_CONTEXT]?.commands[HELP].aliases;
			expect(ALIASES).toBeDefined();
			expect(ALIASES?.length).toBeGreaterThan(1);

			ALIASES?.forEach((alias) => {
				contextManager?.send(alias);
				const { success, message, actions } = contextManager?.response || {};
				expect(success).toBeTruthy();
				expect(message).toContain(
					INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].HINTS.ProcessedCommand,
				);
				expect(actions).toHaveLength(1);
				expect(actions?.[0].name).toBe(helpAction?.name);
				expect(actions?.[0].name).toBe(implicitlyExecuteHelpAction?.name);
			});
		});
	});

	describe('validates command parameters', () => {
		let spy: jest.SpyInstance;
		beforeEach(async () => {
			spy = jest.spyOn(console, 'error').mockImplementation(() => null);
			contextManager?.initialize(MockedContexts || {});
		});

		afterEach(async () => {
			if (spy) spy.mockRestore();
			jest.resetModules();
		});

		it(`throws error if parameter is required but not provided (${CHARACTER_CONTEXT} ${AGE})`, async () => {
			const COMMAND = AGE;
			const EXPECTED_ACTION = MockedContexts?.[CHARACTER_CONTEXT].commands?.[COMMAND].action;

			contextManager?.send(`${CHARACTER_CONTEXT}${COMMAND_SPLITTING_SYMBOL}${COMMAND}`);
			const response = contextManager?.response;

			expect(EXPECTED_ACTION).toBeDefined();
			expect(response?.success).toBeFalsy();
			expect(response?.message).toContain(
				INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].ERRORS.MissingParameter,
			);
		});

		it(`throws error if the parameter is provided but doesn't pass validity check (${CHARACTER_CONTEXT} age test)`, async () => {
			const COMMAND = AGE;
			const EXPECTED_ACTION = MockedContexts?.[CHARACTER_CONTEXT].commands?.[COMMAND].action;

			// Go to the correct context
			contextManager?.send(CHARACTER_CONTEXT);

			// test against invalid parameters
			['test', '17', '018'].forEach((param) => {
				contextManager?.send([COMMAND, param].join(COMMAND_SPLITTING_SYMBOL));
				const { success, message, actions } = contextManager?.response || {};
				expect(success).toBeFalsy();
				expect(message).toContain('Invalid format');
				expect(message).toContain(EXPECTED_ACTION?.parameter?.hint);
				const action = actions?.find((action) => action.name === EXPECTED_ACTION?.name);
				expect(action).toBeUndefined();
			});

			// test against valid parameters
			['18', '33', '121'].forEach((param) => {
				contextManager?.send([COMMAND, param].join(COMMAND_SPLITTING_SYMBOL));
				const { success, actions } = contextManager?.response || {};
				expect(success).toBeTruthy();
				const action = actions?.find((action) => action.name === EXPECTED_ACTION?.name);
				expect(action?.name).toBe(EXPECTED_ACTION?.name);
				expect(action?.parameter?.value).toBe(param);
			});
		});

		it(`throws an error if the parameter is provided but is not among the accepted values in the set (${CHARACTER_CONTEXT} ${BODY_CONTEXT} ${HEAD_CONTEXT} ${HAIR_CONTEXT} color test)`, async () => {
			const COMMAND = COLOR;
			let PARAMETER = 'test';
			const FULL_COMMAND = [
				CHARACTER_CONTEXT,
				BODY_CONTEXT,
				HEAD_CONTEXT,
				HAIR_CONTEXT,
				COMMAND,
				PARAMETER,
			];
			const EXPECTED_ACTION = MockedContexts?.[HAIR_CONTEXT].commands?.[COMMAND].action;
			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			let response = contextManager?.response;

			expect(EXPECTED_ACTION).toBeDefined();
			expect(response?.success).toBeFalsy();
			expect(response?.message).toContain(
				INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].ERRORS.UnrecognizedParameter,
			);
			let action = response?.actions?.find((action) => action.name === EXPECTED_ACTION?.name);
			expect(action).toBeUndefined();

			PARAMETER = 'brown';
			contextManager?.send(`${COMMAND} ${PARAMETER}`);
			response = contextManager?.response;
			expect(response?.success).toBeTruthy();
			action = response?.actions?.find((action) => action.name === EXPECTED_ACTION?.name);
			expect(action?.parameter?.value).toBe(PARAMETER);
		});

		it(`throws an error if the parameter provided results in more then one possible parameters(${CHARACTER_CONTEXT} ${BODY_CONTEXT} ${HEAD_CONTEXT} ${HAIR_CONTEXT} col b)`, async () => {
			const COMMAND = COLOR,
				PARAMETERS = ['black', 'brown', 'blonde'],
				PARTIAL_PARAMETER = PARAMETERS[0].substring(0, 1), // b
				FULL_COMMAND = [
					CHARACTER_CONTEXT,
					BODY_CONTEXT,
					HEAD_CONTEXT,
					HAIR_CONTEXT,
					COMMAND,
					PARTIAL_PARAMETER,
				];

			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const { success, message } = contextManager?.response || {};

			expect(success).toBeFalsy();
			expect(message).toContain(
				INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].ERRORS.UnrecognizedParameter,
			);
			expect(message).toContain(PARAMETERS.join(', '));
		});

		it(`make sure the default parameter is used if no parameter is provided(${CHARACTER_CONTEXT} ${BODY_CONTEXT} ${HEAD_CONTEXT} ${HAIR_CONTEXT} len)`, async () => {
			const COMMAND = LENGTH,
				FULL_COMMAND = [CHARACTER_CONTEXT, BODY_CONTEXT, HEAD_CONTEXT, HAIR_CONTEXT, COMMAND];
			const EXPECTED_ACTION = MockedContexts?.[HAIR_CONTEXT].commands?.[COMMAND].action;

			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const response = contextManager?.response;

			expect(EXPECTED_ACTION).toBeDefined();
			expect(response?.success).toBeTruthy();
			const action = response?.actions?.find((action) => action.name === EXPECTED_ACTION?.name);
			expect(action?.parameter?.value).toBe(EXPECTED_ACTION?.parameter?.defaultValue);
		});

		it(`accepts and autocompletes partially written parameters if they don't cause ambiguity from the set(${CHARACTER_CONTEXT} ${BODY_CONTEXT} ${HEAD_CONTEXT} ${HAIR_CONTEXT} col br)`, async () => {
			const COMMAND = COLOR,
				FULL_PARAMETER = 'brown',
				PARTIAL_PARAMETER = FULL_PARAMETER.substring(0, 2),
				FULL_COMMAND = [
					CHARACTER_CONTEXT,
					BODY_CONTEXT,
					HEAD_CONTEXT,
					HAIR_CONTEXT,
					COMMAND,
					PARTIAL_PARAMETER,
				];
			const EXPECTED_ACTION = MockedContexts?.[HAIR_CONTEXT].commands?.[COMMAND].action;
			contextManager?.send(FULL_COMMAND.join(COMMAND_SPLITTING_SYMBOL));
			const response = contextManager?.response;

			expect(response?.success).toBeTruthy();
			const action = response?.actions?.find((action) => action.name === EXPECTED_ACTION?.name);
			expect(action?.parameter?.value).toBe(FULL_PARAMETER);
		});
	});

	describe('validates the autocompletion feature', () => {
		beforeEach(async () => {
			contextManager?.initialize(MockedContexts || {});
		});

		afterEach(() => {
			jest.resetModules();
		});

		it('throws an error message with all possible commands, if the input is empty string or undefined', async () => {
			if (!MockedContexts) {
				throw new Error('MockedContexts is undefined');
			}
			const mockedCommands = Object.keys(MockedContexts?.[CHARACTER_CONTEXT].commands) || [];

			contextManager?.send(CHARACTER_CONTEXT);
			contextManager?.autocomplete('');
			let response = contextManager?.response;

			expect(response?.success).toBeFalsy();
			expect(response?.message).toContain(
				INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].ERRORS.EmptyCli,
			);
			expect(response?.message).toContain(mockedCommands.join(', '));

			contextManager?.autocomplete();
			response = contextManager?.response;

			expect(response?.success).toBeFalsy();
			expect(response?.message).toContain(
				INTERNAL_STRINGS.en?.[I18N_DEFAULT_NS].ERRORS.EmptyCli,
			);
			expect(response?.message).toContain(mockedCommands.join(', '));
		});

		it("throws an error message with all possible commands, if the input doesn't match any command", async () => {
			if (!MockedContexts) {
				throw new Error('MockedContexts is undefined');
			}
			const mockedCommands = Object.keys(MockedContexts[ROOT_CONTEXT].commands);

			contextManager?.autocomplete('nonExistingCommand');
			const response = contextManager?.response;

			expect(response?.success).toBeFalsy();
			expect(response?.message).toContain('Unrecognized or ambiguous command');
			expect(response?.message).toContain(mockedCommands.join(', '));
		});

		it('returns the ambiguous commands for the current context, and the first element results in more then one possible commands', async () => {
			if (!MockedContexts) {
				throw new Error('MockedContexts is undefined');
			}
			const PARTIAL_COMMAND = HELP.substring(0, 1);
			const filteredMockedCommands = Object.keys(MockedContexts?.[BODY_CONTEXT].commands).filter(
				(el) => el.startsWith(PARTIAL_COMMAND),
			);

			contextManager?.send(`${CHARACTER_CONTEXT} ${BODY_CONTEXT}`); // sets a sub context
			contextManager?.autocomplete(PARTIAL_COMMAND); // executes an autocomplete request for the partial command
			const info = contextManager?.response?.info;

			expect(
				filteredMockedCommands.map((el) => info?.command?.possibleNames?.includes(el)),
			).toBeTruthy();
		});

		it('returns the full command name, if the first element results in only one match among the commands within the context', async () => {
			if (!MockedContexts) {
				throw new Error('MockedContexts is undefined');
			}
			const PARTIAL_COMMAND = LIST.substring(0, 2);
			const filteredMockedCommands = Object.keys(MockedContexts[ROOT_CONTEXT].commands).filter(
				(el) => el.startsWith(PARTIAL_COMMAND),
			);

			contextManager?.autocomplete(PARTIAL_COMMAND);
			const autoCompleteOutput = contextManager?.response?.autoCompleteOutput;

			const commandElements = autoCompleteOutput?.commands
				?.trim()
				.split(COMMAND_SPLITTING_SYMBOL);

			expect(commandElements?.[0]).toBe(filteredMockedCommands[0]);
			expect(commandElements).toHaveLength(1);
			expect(commandElements?.includes(LIST)).toBeTruthy();
		});

		it('returns autocompleted command names for all partially written commands in the input string', async () => {
			const PARAMETER = 'br';
			const COMMANDS = [
				CHARACTER_CONTEXT.substring(0, 2),
				BODY_CONTEXT.substring(0, 2),
				HEAD_CONTEXT.substring(0, 3),
				HAIR_CONTEXT.substring(0, 3),
				COLOR.substring(0, 3),
				PARAMETER,
			];
			const COMPLETED_COMMANDS = [
				CHARACTER_CONTEXT,
				BODY_CONTEXT,
				HEAD_CONTEXT,
				HAIR_CONTEXT,
				COLOR,
			];

			contextManager?.autocomplete(COMMANDS.join(COMMAND_SPLITTING_SYMBOL));
			const autoCompleteOutput = contextManager?.response?.autoCompleteOutput;
			const commandElements = autoCompleteOutput?.commands
				?.trim()
				?.split(COMMAND_SPLITTING_SYMBOL);

			expect(commandElements).toHaveLength(5);
			COMPLETED_COMMANDS.map((element, index) => {
				expect(commandElements?.indexOf(element)).toBe(index);
			});
		});

		it('returns message for the accepted parameters if the command requires parameter', async () => {
			const COMMANDS = [CHARACTER_CONTEXT, FIRST_NAME];
			const helpCommand = MockedContexts?.[CHARACTER_CONTEXT].commands[FIRST_NAME];

			contextManager?.autocomplete(COMMANDS.join(COMMAND_SPLITTING_SYMBOL));
			const info = contextManager?.response?.info;

			expect(info?.parameter).toBeDefined();
			expect(info?.parameter?.hint).toBe(helpCommand?.action?.parameter?.hint);
		});

		it('returns the possible parameters if the command accepts a set of parameters', async () => {
			const COMMANDS = [CHARACTER_CONTEXT, BODY_CONTEXT, HEAD_CONTEXT, HAIR_CONTEXT, COLOR];
			const helpCommand = MockedContexts?.[HAIR_CONTEXT].commands[COLOR];

			contextManager?.autocomplete(COMMANDS.join(COMMAND_SPLITTING_SYMBOL));
			const info = contextManager?.response?.info;

			expect(info?.parameter).toBeDefined();
			expect(info?.parameter?.possibleValues).toStrictEqual(
				helpCommand?.action?.parameter?.possibleValues,
			);
		});

		it('autocompletes the parameter and returns the whole parameter if the the partial input is not ambiguous for a command with a set of parameters', async () => {
			const PARTIAL_PARAMETER = 'bro';
			const COMPLETE_PARAMETER = 'brown';
			const COMMANDS = [
				CHARACTER_CONTEXT,
				BODY_CONTEXT,
				HEAD_CONTEXT,
				HAIR_CONTEXT,
				COLOR,
				PARTIAL_PARAMETER,
			];

			contextManager?.autocomplete(COMMANDS.join(COMMAND_SPLITTING_SYMBOL));
			const info = contextManager?.response?.info;
			const autoCompleteOutput = contextManager?.response?.autoCompleteOutput;

			expect(info?.parameter).toBeDefined();
			expect(info?.parameter?.value).toBe(COMPLETE_PARAMETER);
			expect(autoCompleteOutput?.all?.split(' ').includes(COMPLETE_PARAMETER)).toBeTruthy();
		});
	});
});
