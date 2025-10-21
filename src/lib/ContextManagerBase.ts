import * as i18next from 'i18next';
import INTERNAL_LOCALES from './strings';
import INTERNAL_COMMANDS from './internalCommands';

import { COMMAND_NAMES } from './internalCommands/constants';
import { ContextResponse } from './ContextResponse';
import {
	I18N_DEFAULT_NS,
	I18N_EXTERNAL_NS,
	I18N_FALLBACK_LANGUAGE,
	MESSAGE_CODES,
} from './constants';
import { sha1 } from 'object-hash';
import { validateLanguageCode } from './utils';
import type {
	IAdditionalInfo,
	ICommandActionParameter,
	ICommandNode,
	ICommands,
	IContextContainer,
	IContextDefinition,
	ILocaleStrings,
	IProcessedInput,
	IProcessedParameter,
	IResponse,
} from './types';

export interface IContextConfiguration {
	localeResources?: ILocaleStrings;
	language?: string;
}

export interface ICommandsAndAliases {
	[key: string]: string[];
}

export type UpdateContextMode = 'add' | 'sub';

export class ContextManagerBase {
	private readonly __commandHistory = new Map<string, string[]>();
	private readonly __commandHashes = new Set<string>();

	// private static __instance__?: ContextManagerBase;
	private __contextContainer?: IContextContainer;
	private __currentContext?: IContextDefinition;
	private __implicitCommands: ICommands = {};
	private __contextDepth: string[] = [];
	private __currentRootContextId?: string;

	protected _configuration?: IContextConfiguration;
	protected _processedInput?: IProcessedInput;
	protected _translate: i18next.TFunction<['translation', ...string[]], undefined>;
	protected _response?: IResponse = undefined;

	public get response(): IResponse | undefined {
		return this._response;
	}

	public get configuration(): IContextConfiguration | undefined {
		return this._configuration;
	}

	public get contextContainer(): IContextContainer | undefined {
		return this.__contextContainer;
	}

	public get contextDepth(): string[] | undefined {
		return this.__contextDepth;
	}

	public get commandHistory(): Map<string, string[]> | undefined {
		return this.__commandHistory;
	}

	public get currentContext(): IContextDefinition | undefined {
		return this.__currentContext;
	}

	public get translate() {
		return this._translate;
	}

	constructor() {
		this._configuration = {
			localeResources: { ...INTERNAL_LOCALES },
			language: I18N_FALLBACK_LANGUAGE,
		};
		this.mergeLocales(INTERNAL_COMMANDS.locales, {
			allowDefaultNS: true,
			safe: false,
		});

		// Allows to identify if commands are overwritten.
		// If false, the implicit action is executed.
		// If true, the actions should be handled externally
		this.generateHashes({
			implicitGlobalCommands: INTERNAL_COMMANDS.commands.common,
			implicitContexts: INTERNAL_COMMANDS.contexts.common,
		});
	}

	initialize(
		contextContainer: IContextContainer,
		externalLocales?: ILocaleStrings,
		language?: string,
	): void {
		this.mergeLocales(externalLocales, { allowDefaultNS: false, safe: false });
		// TODO get the i18next from ContextManager wrapper and just update the resource bundle
		i18next
			.init({
				lng: this._configuration?.language,
				defaultNS: I18N_DEFAULT_NS,
				fallbackLng: I18N_FALLBACK_LANGUAGE,
				resources: (this._configuration?.localeResources as i18next.Resource) || {},
			})
			.then(() => {
				this._translate = i18next.t.bind(i18next);
			});

		if (language && language !== this._configuration?.language) this.updateLanguageCode(language);

		this.addImplicitGlobalCommands(contextContainer, INTERNAL_COMMANDS.commands.common);
		this.addImplicitContexts(contextContainer, INTERNAL_COMMANDS.contexts.common);
		this.updateCurrentContext(this.getInitialContext());

		if (this.__currentContext) {
			this.__currentRootContextId = this.__currentContext.name;
			this.__contextDepth = [this.__currentContext.name];
		}
	}

	addLocales(newLocales: ILocaleStrings) {
		this.mergeLocales(newLocales, { addResourceBundle: true, safe: true });
	}

	getConfiguration(): IContextConfiguration {
		return this._configuration || {};
	}

	getInitialContext(): IContextDefinition {
		const allContexts = Object.values(this.contextContainer || {});
		// TODO change the flag to initial. We may have multiple root contexts
		const InitialWannaBees = allContexts.filter((context) => context.isInitialContext);

		if (InitialWannaBees.length > 0) return InitialWannaBees[0];

		return allContexts[0];
	}

	getCommandNode(commandName: string, context?: string): ICommandNode | undefined {
		return context
			? this.contextContainer?.[context]?.commands[commandName]
			: this.currentContext?.commands[commandName];
	}

	protected resetProcessedInput(): void {
		this._processedInput = {
			processedDepth: [],
			pendingActions: [],
			processedInputString: '', // TODO move it in the CLI context manager, doesn't make sense. Used for command history
			command: undefined,
			parameter: undefined,
		};
	}

	protected addImplicitContexts(
		contextContainer: IContextContainer,
		implicitContexts: IContextContainer,
	): void {
		if (!contextContainer) contextContainer = {};

		for (const [key, context] of Object.entries(implicitContexts)) {
			contextContainer[key] = context;
		}

		this.__contextContainer = structuredClone(contextContainer);

		this.generateHashes({ implicitContexts });
	}

	protected addImplicitGlobalCommands(
		contextContainer: IContextContainer,
		globalCommands: ICommands,
	): void {
		this.__implicitCommands = { ...this.__implicitCommands, ...globalCommands };

		if (!contextContainer) contextContainer = {};
		// Merge the global implicit commands first
		// allowing overwriting the them with the custom commands
		for (const [contextId] of Object.entries(contextContainer)) {
			contextContainer[contextId].commands = {
				...globalCommands,
				...contextContainer[contextId].commands,
			};
		}

		this.generateHashes({ implicitGlobalCommands: globalCommands });
	}

	protected buildResponse() {
		const { error } = this._processedInput || {};

		if (error) throw new ContextResponse(error);
	}

	protected changeContext(
		mode: UpdateContextMode = 'add',
		contextName?: string,
		depthLevel?: number,
	): void {
		if (mode === 'add') this.addContext(contextName);
		else this.removeContext(depthLevel);
	}

	//TODO: This doesn't make sense for the Option context manager
	// so move it in the CLI
	protected updateCommandHistory(newCommand?: string) {
		if (!newCommand || !this.currentContext?.name) return;

		const contextCmdHistory = this.__commandHistory.get(this.currentContext.name) || [];
		const commandIndex = contextCmdHistory.findIndex((command) => command === newCommand);

		if (commandIndex >= 0) contextCmdHistory.splice(commandIndex, 1);

		contextCmdHistory.push(newCommand);
		this.__commandHistory.set(this.currentContext.name, contextCmdHistory);
	}

	protected getAvailableCommandsPerContextId(contextId: string): string[] {
		if (contextId === this.currentContext?.name)
			return Object.keys(this.currentContext?.commands) || [];

		return Object.keys(this.contextContainer?.[contextId]?.commands || {}) || [];
	}

	protected isImplicit(commandNode: ICommandNode) {
		const commandHash = sha1(commandNode);

		return this.__commandHashes.has(commandHash);
	}

	protected implicitActionsHandler(actionName: string, parameter?: IProcessedParameter) {
		switch (actionName) {
			case 'implicitlyExecuteBackAction':
				this.changeContext('sub', undefined, parseInt(parameter?.value || '0', 10));
				break;
			case 'implicitlySetLanguageAction':
				this.implicitlySetLanguageAction(parameter?.value);
				break;
		}
	}

	protected generateErrorMessage(message: string, code: number): IProcessedInput {
		const { processedDepth } = this._processedInput || {};

		return {
			processedDepth,
			error: {
				success: false,
				message,
				code,
			},
		};
	}

	protected prepareParameterStructure(
		value?: string,
		actionParameter?: ICommandActionParameter & IAdditionalInfo,
	): IProcessedParameter & IAdditionalInfo {
		const { hint, description, example, type, possibleValues, isNameOrValuePartial } =
			actionParameter ?? {};
		return {
			value,
			possibleValues: type === 'set' ? possibleValues : undefined,
			hint,
			description,
			example,
			isNameOrValuePartial,
		};
	}

	private handleSpecialCases(context: IContextDefinition) {
		const { name: contextId, commands } = context;

		// Do remove the 'back' global command from the current root context of it is currently root
		// NOTE: the root context may be referred by its children effectively creating a loop in which
		// case we would need the back command
		if (
			this.__currentRootContextId &&
			contextId === this.__currentRootContextId &&
			this.contextDepth?.indexOf(contextId) === 0
		) {
			delete commands[COMMAND_NAMES.BACK];
		}

		// Drop the current context commands which refer the current context
		delete commands[contextId];

		// console.log('handleSpecialCases', contextId, commands);
	}

	private mergeLocales(
		newLocales?: ILocaleStrings,
		{
			allowDefaultNS,
			safe,
			addResourceBundle,
		}: { allowDefaultNS?: boolean; safe?: boolean; addResourceBundle?: boolean } = {},
	) {
		const resources: ILocaleStrings = this?._configuration?.localeResources || {};

		if (!newLocales) return;

		for (const [language, namespaces] of Object.entries(newLocales)) {
			if (!validateLanguageCode(language)) continue;

			if (namespaces)
				for (const [namespace, translations] of Object.entries(namespaces)) {
					if (!resources?.[language]) resources[language] = {};

					if (safe && (resources[language] as ILocaleStrings)?.[namespace]) continue;

					// Make sure we don't overwrite the internal default name space.
					// If there is an attempt to do it, we use the default external namespace.
					const checkedNamespace =
						!allowDefaultNS && namespace === I18N_DEFAULT_NS ? I18N_EXTERNAL_NS : namespace;

					if (!(resources[language] as ILocaleStrings)?.[checkedNamespace])
						(resources[language] as ILocaleStrings)[checkedNamespace] = {
							...(translations as ILocaleStrings),
						};
					else {
						(resources[language] as ILocaleStrings)[checkedNamespace] = {
							...((resources[language] as ILocaleStrings)[
								checkedNamespace
							] as ILocaleStrings),
							...(translations as ILocaleStrings),
						};
					}
					if (addResourceBundle)
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(i18next as any).addResourceBundle(
							language,
							checkedNamespace,
							translations,
							true,
							true,
						);
				}
		}
	}

	// NOTE: This method is used to remove the new context from the history, if it already exists,
	// and re-add it at the end of the history
	private updateContextDepth(newContext: IContextDefinition): void {
		const contextIndex = this.__contextDepth.findIndex(
			(contextName) => contextName === newContext.name,
		);
		if (contextIndex !== -1) {
			this.__contextDepth.splice(contextIndex, 1);
		}
		this.__contextDepth.push(newContext.name);
	}

	private addContext(contextName?: string) {
		const newContext = this.contextContainer?.[contextName || -1];
		if (newContext) this.updateCurrentContext(newContext);
		else {
			throw new ContextResponse({
				success: false,
				message: this._translate('ERRORS.ContextNotFound', { contextName }),
				code: MESSAGE_CODES.ERROR_CONTEXT_NOT_FOUND,
			});
		}
	}

	private updateCurrentContext(context: IContextDefinition) {
		// Clone the context before setting it as current context, because the current context,
		// may be modified due to some spacial cases
		this.__currentContext = structuredClone(context);
		this.updateContextDepth(this.__currentContext);
		this.handleSpecialCases(this.__currentContext);
	}

	private removeContext(depthLevel?: number) {
		const ROOT_CONTEXT_NAME = this.getInitialContext().name;
		if (this.__contextDepth && this.__contextDepth.length > 1) {
			const count = depthLevel ? Math.min(depthLevel, this.__contextDepth.length - 1) : 1;
			const start = this.__contextDepth.length - count;

			this.__contextDepth?.splice(start, count);
		}

		if (this.__contextDepth && !this.__contextDepth?.includes(ROOT_CONTEXT_NAME)) {
			if (this.__contextDepth.length > 1) {
				this.__contextDepth.unshift(ROOT_CONTEXT_NAME);
			} else {
				this.__contextDepth = [ROOT_CONTEXT_NAME];
			}
		}

		const contextName =
			this.contextDepth && this.contextDepth.length > 0
				? this.contextDepth[this.contextDepth.length - 1]
				: ROOT_CONTEXT_NAME;

		if (this.contextContainer) {
			this.updateCurrentContext(this.contextContainer[contextName]);
		}
	}

	private generateHashes({
		implicitGlobalCommands,
		implicitContexts,
	}: {
		implicitGlobalCommands?: ICommands;
		implicitContexts?: IContextContainer;
	}) {
		const generateCommandHashes = (commands?: ICommands) => {
			if (!commands) return;

			for (const commandId in commands) {
				const commandHash = commandId ? sha1(commands[commandId]) : undefined;

				if (commandHash) this.__commandHashes.add(commandHash);
			}
		};

		if (implicitGlobalCommands) generateCommandHashes(implicitGlobalCommands);

		if (implicitContexts)
			for (const contextId in implicitContexts) {
				generateCommandHashes(implicitContexts[contextId]?.commands);
			}
	}

	private updateLanguageCode(languageCode: string) {
		this._configuration ??= {};

		this._configuration.language = languageCode;
		i18next.changeLanguage(languageCode).then(() => {
			this._translate = i18next.t.bind(i18next);
		});
		// eslint-disable-next-line no-console
		console.info(`Language changed to ${this._configuration.language}`);
	}

	private implicitlySetLanguageAction(languageCode?: string) {
		if (!languageCode) {
			throw new ContextResponse({
				success: false,
				message: this._translate('ERRORS.UnresolvedRequirement', {
					what: `Language code`,
				}),
				code: MESSAGE_CODES.ERROR_IMPLICIT_COMMAND_GENERIC,
			});
		}

		const availableLanguages = Object.keys(this._configuration?.localeResources || {});
		if (!validateLanguageCode(languageCode)) {
			throw new ContextResponse({
				success: false,
				message: `${this._translate('ERRORS.InvalidLanguageCode', {
					languageCode,
				})} ${this._translate('HINTS.AvailableLanguages', {
					availableLanguages: availableLanguages.join(', '),
				})}`,
				code: MESSAGE_CODES.ERROR_IMPLICIT_COMMAND_GENERIC,
			});
		}

		if (!availableLanguages?.includes(languageCode)) {
			throw new ContextResponse({
				success: false,
				message: `${this._translate('ERRORS.UnsupportedLanguage', {
					languageCode,
				})} ${this._translate('HINTS.AvailableLanguages', {
					availableLanguages: availableLanguages.join(', '),
				})}`,
				code: MESSAGE_CODES.ERROR_IMPLICIT_COMMAND_GENERIC,
			});
		}

		this.updateLanguageCode(languageCode);
	}
}
