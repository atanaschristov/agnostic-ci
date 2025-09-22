import { I18N_EXTERNAL_NS, I18N_FALLBACK_LANGUAGE } from '../lib/constants';
import { ContextManagerBase } from '../lib/ContextManagerBase';
import internalLocales from '../lib/strings';

describe('CLIContextManagerBase', () => {
	let contextManager: ContextManagerBase | undefined;
	beforeAll(async () => {
		contextManager = new ContextManagerBase();
	});

	afterAll(async () => {
		if (contextManager) contextManager = undefined;
		jest.resetModules();
	});

	it('should be singleton', () => {
		const contextManager2 = new ContextManagerBase();
		expect(contextManager).toStrictEqual(contextManager2);
	});

	it('should throw an error if changeContext is executed and the contextName can not be associated with a context object', async () => {
		const nonExistingContext = 'nonExistingContextName';
		await contextManager?.initialize({});
		try {
			contextManager?.['changeContext']('add', nonExistingContext, -1);
		} catch (response) {
			const { success, message } = response || {};
			expect(success).toBeFalsy();
			expect(message).toContain(`Context '${nonExistingContext}' not found.`);
		}
	});

	describe('validates command history', () => {
		it('should return the command history map via the getter', () => {
			// Mock currentContext
			(contextManager as any).__currentContext = { name: 'testContext' };
			contextManager?.['updateCommandHistory']('testCommand');

			const history = contextManager?.commandHistory;
			expect(history).toBeInstanceOf(Map);
			expect(history?.get('testContext')).toContain('testCommand');
		});
	});

	describe('validates configuration', () => {
		it('should return the default configuration if an instance of context manager is created', () => {
			const configuration = contextManager?.getConfiguration();

			expect(configuration?.language).toBe(I18N_FALLBACK_LANGUAGE);
			expect(configuration?.localeResources).toEqual(expect.objectContaining(internalLocales));
		});

		it("should throw an error if implicitlySetLanguageAction doesn't get a language code as a param", async () => {
			try {
				contextManager?.['implicitActionsHandler']('implicitlySetLanguageAction', {
					value: undefined,
				});
			} catch (response) {
				const { success, message } = response;

				expect(success).toBeFalsy();
				expect(message).toContain('Unresolved requirement: Language code is required.');
			}
		});

		it('should throw an error if the language code is not provided', async () => {
			try {
				contextManager?.initialize({});

				contextManager?.['implicitActionsHandler']('implicitlySetLanguageAction', {
					value: undefined,
				});
			} catch (response) {
				const { success, message } = response;

				expect(success).toBeFalsy();
				expect(message).toContain('Unresolved requirement: Language code is required.');
			}
		});

		it('should throw an error if language code is valid but not available', async () => {
			const UNAVAILABLE_LANGUAGE = 'fr';

			try {
				contextManager?.initialize(
					{},
					{
						en: { translation: {} },
					},
					'en',
				);

				contextManager?.['implicitActionsHandler']('implicitlySetLanguageAction', {
					value: UNAVAILABLE_LANGUAGE,
				});
			} catch (response) {
				const { success, message } = response;

				expect(success).toBeFalsy();
				expect(message).toContain(
					`Language ${UNAVAILABLE_LANGUAGE} is not available. Available languages:`,
				);
			}
		});

		it('should throw an error if the language code is invalid', async () => {
			const INVALID_LANGUAGE = 'english-UK';

			try {
				contextManager?.initialize(
					{},
					{
						en: { translation: {} },
						de: { translation: {} },
					},
					'en',
				);

				contextManager?.['implicitActionsHandler']('implicitlySetLanguageAction', {
					value: INVALID_LANGUAGE,
				});
			} catch (response) {
				const { success, message } = response;

				expect(success).toBeFalsy();
				expect(message).toContain(
					`Invalid language code: '${INVALID_LANGUAGE}'. Available languages:`,
				);
			}
		});

		it('should update the language if the language code is valid', async () => {
			const LANGUAGE = 'de';

			try {
				contextManager?.initialize(
					{},
					{
						en: { translation: {} },
						de: { translation: {} },
					},
					'en',
				);

				contextManager?.['implicitActionsHandler']('implicitlySetLanguageAction', {
					value: LANGUAGE,
				});
			} catch (response) {
				const { success } = response;

				expect(success).toBeTruthy();
				expect(contextManager?.getConfiguration().language).toBe(LANGUAGE);
			}
		});

		it('should return the updated configuration after initialize', async () => {
			const customLang1 = 'en';
			const customLang2 = 'hu';
			const customLocales = { en: {}, hu: {} };
			customLocales.en[I18N_EXTERNAL_NS] = { test: 'Test' };
			customLocales.hu[I18N_EXTERNAL_NS] = { test: 'Bla' };

			contextManager?.initialize({}, customLocales, customLang2);
			const configuration = contextManager?.getConfiguration();

			expect(configuration?.language).toBe(customLang2);
			expect(configuration?.localeResources?.[customLang1]?.[I18N_EXTERNAL_NS]).toEqual(
				expect.objectContaining(customLocales?.[customLang1]?.[I18N_EXTERNAL_NS]),
			);
			expect(configuration?.localeResources?.[customLang2]?.[I18N_EXTERNAL_NS]).toEqual(
				expect.objectContaining(customLocales?.[customLang2]?.[I18N_EXTERNAL_NS]),
			);
		});

		it('should ignore the translations within invalid language code when using addLocales', () => {
			const customLocales = {
				en: { translation: {} },
				de: { translation: {} },
			};
			const newLanguage = 'norsk-NO';
			const newLocales = { 'norsk-NO': { newNameSpace: { test: 'Blaaaa' } } };
			contextManager?.initialize({}, customLocales, 'en');

			contextManager?.addLocales(newLocales);
			const configuration = contextManager?.getConfiguration();
			expect(configuration).toBeDefined();
			expect(configuration?.localeResources?.[newLanguage]).toBe(undefined);
		});

		it('should ignore the translations within the same namespace for a language if the namespace already exists when using addLocales', async () => {
			const customLocales = {
				en: { internal: {}, anotherNS: {} },
				de: { anotherNS: { test: 'Bla Original' } },
			};
			const newLocales = { de: { anotherNS: { test: 'Bla Modified' } } };
			contextManager?.initialize({}, customLocales, 'de');

			contextManager?.addLocales(newLocales);
			const configuration = contextManager?.getConfiguration();
			expect(configuration).toBeDefined();

			expect(configuration?.localeResources?.['de']?.['anotherNS']?.test).toBe(
				customLocales.de.anotherNS.test,
			);
		});

		it("should add the translations for the new namespace for a language if the namespace doesn't exists when using addLocales", async () => {
			const customLocales = {
				en: { anotherNS: { test: 'English Version' } },
				de: { anotherNS: { test: 'Bla Original' } },
			};
			const newLocales = { de: { anotherNewNS: { test: 'Bla Modified' } } };
			contextManager?.initialize({}, customLocales, 'de');

			contextManager?.addLocales(newLocales);
			const configuration = contextManager?.getConfiguration();
			expect(configuration).toBeDefined();

			expect(configuration?.localeResources?.['de']?.['anotherNS']?.test).toBe(
				customLocales.de.anotherNS.test,
			);

			expect(contextManager?.['_translate']('test', { lng: 'de', ns: 'anotherNewNS' })).toBe(
				newLocales.de.anotherNewNS.test,
			);
			expect(contextManager?.['_translate']('test', { lng: 'en', ns: 'anotherNS' })).toBe(
				customLocales.en.anotherNS.test,
			);
		});

		it('should really translate the output strings, which are meant to be translated if the language is set during initialization', () => {
			const customLocales = {
				en: { anotherNS: { test: 'English Version' } },
				de: { anotherNS: { test: 'Bla Original' } },
			};
			contextManager?.initialize({}, customLocales, 'de');
			expect(contextManager?.['_translate']('test', { lng: 'de', ns: 'anotherNS' })).toBe(
				customLocales.de.anotherNS.test,
			);
		});
	});

	describe('ContextManagerBase.updateContextDepth', () => {
		let contextManager: ContextManagerBase;

		beforeEach(() => {
			contextManager = new ContextManagerBase();
			(contextManager as any).__contextDepth = ['root', 'settings', 'profile'];
		});

		it('removes existing context from depth and re-adds it at the end', () => {
			const newContext = { name: 'settings' };
			// @ts-ignore
			contextManager.updateContextDepth(newContext);
			// @ts-ignore
			expect(contextManager.__contextDepth).toEqual(['root', 'profile', 'settings']);
		});

		it('adds context if not already present', () => {
			const newContext = { name: 'newContext' };
			// @ts-ignore
			contextManager.updateContextDepth(newContext);

			// 'newContext' should be added at the end
			// @ts-ignore
			expect(contextManager.__contextDepth).toEqual([
				'root',
				'settings',
				'profile',
				'newContext',
			]);
		});
	});
});
