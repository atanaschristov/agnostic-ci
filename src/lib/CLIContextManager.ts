import {
	COMMAND_SPLITTING_SYMBOL,
	MESSAGE_CODES,
	PROMPT_DEFAULT,
	PROMPT_SUFFIX,
	PROMPT_PREFIX,
	PROMPT_SPLITTING_SYMBOL,
	PROMPT_FORMAT,
} from './constants';
import { ContextManagerBase } from './ContextManagerBase';
import { ContextResponse } from './ContextResponse';
import { longestCommonPrefix } from './utils';
import type {
	ICommandsAndAliases,
	IContextConfiguration,
	UpdateContextMode,
} from './ContextManagerBase';
import type {
	ICommandActionParameter,
	ICommandNode,
	IContextContainer,
	ILocaleStrings,
	IProcessedParameter,
	IResponse,
	NormalizedCommand,
} from './types';

import INTERNAL from './internalCommands';

export type TPromptFormat = 'basic' | 'normal' | 'full';

export interface ICliContextConfiguration extends IContextConfiguration {
	promptSuffix?: string;
	promptPrefix?: string;
	promptFormat?: TPromptFormat;
	promptSplittingSymbol?: string;
}

type TAnalyzeMode = 'execute' | 'autocomplete';

export class CLIContextManager extends ContextManagerBase {
	private static __cliInstance__?: CLIContextManager;
	private __prompt?: string;
	private __mappingAliasToCommands: ICommandsAndAliases = {};
	private __cliConfiguration: ICliContextConfiguration = {};

	public get prompt(): string {
		return this.__prompt || PROMPT_DEFAULT;
	}

	public getConfiguration(): ICliContextConfiguration {
		return this.__cliConfiguration;
	}

	constructor() {
		if (CLIContextManager.__cliInstance__) {
			return CLIContextManager.__cliInstance__;
		}

		super();
		this.resetCLiConfiguration();
		this.updatePrompt();

		CLIContextManager.__cliInstance__ = this;
	}

	initialize(
		contextContainer: IContextContainer,
		locales?: ILocaleStrings,
		language?: string,
	): void {
		// TODO needs optimization how the commands and contexts are merged
		this.addImplicitGlobalCommands(contextContainer, INTERNAL.commands.cli);
		super.initialize(contextContainer, locales, language);
		this.addImplicitContexts(contextContainer, INTERNAL.contexts.cli);
		this.passThroughAllCommandsAndAliasesPerContext();
		this.resetCLiConfiguration();

		this.updatePrompt();
		CLIContextManager.__cliInstance__ = this;
	}

	send(input?: string): void {
		try {
			const inputArr = this.normalizeInput(input);

			this.resetProcessedInput();
			this.analyzeInput(inputArr);
			this.buildResponse();
		} catch (response) {
			this._response = response as IResponse;
			if (!this._response.success) {
				// eslint-disable-next-line no-console
				console.error(`\n${response}`);
			}
		}
	}

	autocomplete(input?: string): void {
		try {
			const inputArr = this.normalizeInput(input);

			this.resetProcessedInput();
			this.analyzeInput(inputArr, 'autocomplete');
			this.generateAutocompleteOutput();
		} catch (response) {
			this._response = response as IResponse;
		}
	}

	protected changeContext(
		mode: UpdateContextMode = 'add',
		contextName?: string,
		depthLevel?: number,
	): void {
		super.changeContext(mode, contextName, depthLevel);
		this.updatePrompt();
	}

	protected passThroughAllCommandsAndAliasesPerContext(): void {
		// super.passThroughAllCommandsAndAliasesPerContext();
		for (const contextName in this.contextContainer) {
			const context = this.contextContainer[contextName];

			const commands = context.commands;

			if (commands) {
				for (const commandKey in commands) {
					const commandNode = commands[commandKey];
					this.getAllAliasesPerCommand(commandKey, commandNode);
				}
			}
		}
	}

	private resetCLiConfiguration() {
		this.__cliConfiguration = {
			promptPrefix: '',
			promptSuffix: PROMPT_SUFFIX,
			promptFormat: PROMPT_FORMAT,
			promptSplittingSymbol: PROMPT_SPLITTING_SYMBOL,
			...this._configuration,
		};
	}

	private getAllAliasesPerCommand(commandName: string, commandNode?: ICommandNode): void {
		if (commandNode?.aliases) {
			commandNode.aliases.forEach((alias) => {
				if (!this.__mappingAliasToCommands?.[alias])
					this.__mappingAliasToCommands[alias] = [commandName];
				else if (!this.__mappingAliasToCommands[alias].includes(commandName)) {
					this.__mappingAliasToCommands[alias].push(commandName);
				}
			});
		}
	}

	private updatePrompt(): void {
		const promptSuffix = this.__cliConfiguration?.promptSuffix || PROMPT_SUFFIX;
		const promptPrefix = this.__cliConfiguration?.promptPrefix || PROMPT_PREFIX;
		this.__prompt = this.generatePrompt(promptPrefix, promptSuffix);
	}

	private generatePrompt(promptPrefix: string, promptSuffix: string) {
		if (!this.contextDepth?.length) return PROMPT_DEFAULT;
		const splittingSymbol =
			this.__cliConfiguration?.promptSplittingSymbol || PROMPT_SPLITTING_SYMBOL;

		const prompt = (() => {
			switch (this.__cliConfiguration?.promptFormat) {
				case 'basic':
					return '';
				case 'normal':
					return `${promptPrefix}${this.contextDepth[this.contextDepth.length - 1]} `;
				case 'full':
					return `${promptPrefix}${this.contextDepth?.join(splittingSymbol)} `;
			}
		})();

		return `${prompt}${promptSuffix} `;
	}

	private normalizeInput(rawInput?: string): NormalizedCommand {
		if (!rawInput) return [];

		// Trim input and split on single quotes to separate quoted parameters
		const [firstPart, ...quotedParts] = rawInput.trim().split("'");

		// The firstPart of the splitted input contains the regular command elements or parameters,
		const commands = firstPart
			.split(COMMAND_SPLITTING_SYMBOL)
			.map((c) => c.trim())
			.filter(Boolean); // Remove empty strings

		// the quoted parts are used as is and are treated as parameters.
		// As parameters only the first should be used, the rest are ignored
		if (quotedParts.length > 0 && quotedParts[0].trim() !== '') {
			commands.push(quotedParts[0]);
		}

		return commands;
	}

	private processCommand({
		inputArr,
		inputValue,
		commandName,
		commandNode,
		mode,
	}: {
		inputArr: NormalizedCommand;
		inputValue: string;
		commandName: string;
		commandNode: ICommandNode;
		mode: TAnalyzeMode;
	}): void {
		let { processedInputString } = this._processedInput || {};
		const { processedDepth, pendingActions } = this._processedInput || {};

		if (!processedInputString) processedInputString = '';
		processedInputString = `${processedInputString.length ? processedInputString + COMMAND_SPLITTING_SYMBOL : ''}${commandName}`;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { aliases, action, type, ...commandMetaInfo } = commandNode;

		if (action) pendingActions?.push({ ...action });

		if (commandNode.type === 'context') {
			processedDepth?.push(commandNode.name);
			this._processedInput = {
				...this._processedInput,
				processedDepth,
				processedInputString,
			};

			if (inputArr.length > 0) this.analyzeInput(inputArr, mode);
		} else {
			this._processedInput = {
				...this._processedInput,
				processedInputString,
				command: commandMetaInfo,
			};

			if (inputValue !== commandName && mode === 'autocomplete' && !inputArr.length) return;

			this.processParameters(inputArr, commandNode, mode);
		}
	}

	private analyzeInput(inputArr: string[], mode: TAnalyzeMode = 'execute'): void {
		const { processedDepth } = this._processedInput || {};
		const nextContext =
			processedDepth && processedDepth.length > 0
				? processedDepth[processedDepth.length - 1]
				: this.currentContext?.name || this.getInitialContext().name;
		let nextInputElement = inputArr.shift();
		const nextContextCommands = this.getAvailableCommandsPerContextId(nextContext);

		if (!nextInputElement) {
			this._processedInput = this.generateErrorMessage(
				`${this._translate('ERRORS.EmptyCli')} ${this._translate('HINTS.AvailableCommands', {
					contextName: nextContext,
					commands: nextContextCommands.join(', '),
				})}`,
				MESSAGE_CODES.ERROR_INVALID_COMMAND,
			);
			return;
		}

		// if the input element is an alias, find the command it maps to it
		const aliasCommands = this.__mappingAliasToCommands[nextInputElement];
		if (aliasCommands && aliasCommands.length > 0) {
			const commandNodes: ICommandNode[] = [];
			aliasCommands.forEach((commandName) => {
				if (this.currentContext?.commands[commandName]) {
					commandNodes.push(this.currentContext?.commands[commandName]);
				}
			});

			const commandNode = commandNodes[0];
			if (commandNodes.length > 1) {
				// eslint-disable-next-line no-console
				console.warn(
					this._translate('ERRORS.AmbiguousAlias', {
						what: nextInputElement,
						commands: JSON.stringify(aliasCommands),
					}),
				);
				nextInputElement = commandNode.name;
			}

			if (commandNode) {
				this.processCommand({
					inputArr,
					inputValue: nextInputElement,
					commandName: nextInputElement,
					commandNode,
					mode,
				});
				return;
			}
		}

		const possibleCommands = nextContextCommands.filter(
			(cmd) => nextInputElement && cmd.startsWith(nextInputElement),
		);

		if (possibleCommands.length === 0) {
			this._processedInput = {
				...(this._processedInput = this.generateErrorMessage(
					`${this._translate('ERRORS.UnrecognizedCommand', { command: nextInputElement })} ${this._translate(
						'HINTS.AvailableCommands',
						{
							contextName: nextContext,
							commands: nextContextCommands.join(', '),
						},
					)}`,
					MESSAGE_CODES.ERROR_INVALID_COMMAND,
				)),
			};
			return;
		}

		if (possibleCommands.length > 1) {
			this._processedInput = {
				...this.generateErrorMessage(
					`${this._translate('ERRORS.UnrecognizedCommand', { command: nextInputElement })} ${this._translate(
						'HINTS.AvailableCommands',
						{
							contextName: nextContext,
							commands: possibleCommands.join(', '),
						},
					)}`,
					MESSAGE_CODES.ERROR_INVALID_COMMAND,
				),
				command: {
					name: longestCommonPrefix(possibleCommands),
					isNameOrValuePartial: true,
					possibleNames: possibleCommands,
				},
			};
			return;
		}

		const commandName = possibleCommands[0];
		const commandNode = this.getCommandNode(commandName, nextContext);
		if (!commandNode) {
			this._processedInput = this.generateErrorMessage(
				this._translate('ERRORS.NodeNotFound', {
					command: commandName,
					context: nextContext || this.currentContext?.name,
				}),
				MESSAGE_CODES.ERROR_NODE_NOTFOUND,
			);
			return;
		}

		this.processCommand({
			inputArr,
			inputValue: nextInputElement,
			commandName,
			commandNode,
			mode,
		});
	}

	private prepareParameterProcessedInput(
		value?: string,
		parameterRequirement?: ICommandActionParameter,
	) {
		const { processedDepth, command, pendingActions, processedInputString } =
			this._processedInput || {};

		const parameter = this.prepareParameterStructure(value, parameterRequirement);

		const commandAction = pendingActions?.[pendingActions.length - 1];
		if (commandAction) {
			commandAction.parameter = parameter;
		}

		const inputString = !value
			? processedInputString
			: `${processedInputString}${COMMAND_SPLITTING_SYMBOL}${value}`;

		this._processedInput = {
			processedDepth,
			processedInputString: inputString,
			command,
			parameter,
			pendingActions,
		};
	}

	// NOTE: Multiple parameters not supported.
	// Once the command is recognized and processed, everything else is considered a parameter
	private processParameters(
		inputArr: string[],
		commandNode: ICommandNode,
		mode: TAnalyzeMode = 'execute',
	) {
		const { parameter: parameterRequirement } = commandNode?.action || {};
		const { defaultValue, required, valueFormatLimitation, type, possibleValues } =
			parameterRequirement || {};

		const commandParameter = inputArr.join(COMMAND_SPLITTING_SYMBOL);

		// use the default value if there is nothing and default value exists.
		// The default value is supposed to be provided from the schema,
		if (!commandParameter && defaultValue && parameterRequirement) {
			this.prepareParameterProcessedInput(defaultValue, parameterRequirement);
			return;
		}

		if (required && !commandParameter && mode === 'execute') {
			this._processedInput = {
				...this.generateErrorMessage(
					`${this._translate('ERRORS.MissingParameter')}`,
					MESSAGE_CODES.ERROR_MISSING_PARAMETER,
				),
				...{ command: { name: commandNode.name } },
			};
			return;
		}

		if (
			type !== 'set' &&
			commandParameter &&
			valueFormatLimitation &&
			!valueFormatLimitation.test(commandParameter)
		) {
			const { parameter } = commandNode?.action || {};
			this._processedInput = {
				...this.generateErrorMessage(
					`${this._translate('ERRORS.InvalidFormat', {
						value: commandParameter,
						command: commandNode.name,
					})}${parameter?.hint ? ' ' + parameter.hint : ''}`,
					MESSAGE_CODES.ERROR_INVALID_FORMAT,
				),
				...{ command: { name: commandNode.name } },
			};
			return;
		}

		if (type === 'set' && possibleValues) {
			const possibleParams = possibleValues.filter((element) =>
				element.startsWith(commandParameter || ''),
			);

			if (possibleParams.length === 0) {
				this._processedInput = this.generateErrorMessage(
					`${this._translate('ERRORS.UnrecognizedParameter')} ${this._translate(
						'HINTS.AvailableParameters',
						{ command: commandNode.name, parameters: possibleValues.join(', ') },
					)}`,
					MESSAGE_CODES.ERROR_INVALID_PARAMETER,
				);
				return;
			}

			if (possibleParams.length > 1 && mode !== 'autocomplete') {
				this._processedInput = this.generateErrorMessage(
					`${this._translate('ERRORS.UnrecognizedParameter')} ${this._translate(
						'HINTS.AvailableParameters',
						{ command: commandNode.name, parameters: possibleParams.join(', ') },
					)}`,
					MESSAGE_CODES.ERROR_INVALID_PARAMETER,
				);
				return;
			}
			this.prepareParameterProcessedInput(possibleParams[0], parameterRequirement);
		} else {
			this.prepareParameterProcessedInput(commandParameter, parameterRequirement);
		}
	}

	private generateAutocompleteMessage(): string {
		const { processedDepth, command } = this._processedInput || {};
		if (!command) {
			const contextName =
				processedDepth?.[processedDepth?.length - 1] || this.currentContext?.name;
			const possibleCommands = contextName
				? Object.keys(this.contextContainer?.[contextName]?.commands || {})
				: undefined;
			return possibleCommands
				? this._translate('HINTS.AvailableCommands', {
						contextName,
						commands: possibleCommands.join(', '),
					})
				: 'TODO';
		} else {
			return this._translate('HINTS.AutoCompleteCommand');
		}
	}

	private generateAutocompleteOutput(): void {
		const { processedDepth, command, parameter, error } = this._processedInput || {};

		let autoCompleteParameters = '';
		let autoCompleteCommands = processedDepth?.join(COMMAND_SPLITTING_SYMBOL);

		if (command?.name)
			autoCompleteCommands =
				autoCompleteCommands +
				`${autoCompleteCommands ? COMMAND_SPLITTING_SYMBOL : ''}${command?.name}`;

		// NOTE: Adding an additional space if the input is valid, so it is easier to keep on writing other commands
		// No space if the input us partial, so it is easer to keep on writing the incomplete command
		if (autoCompleteCommands && !command?.isNameOrValuePartial)
			autoCompleteCommands = autoCompleteCommands + COMMAND_SPLITTING_SYMBOL;

		if (command?.name && parameter?.value) autoCompleteParameters = parameter?.value;

		if (autoCompleteParameters && !parameter?.isNameOrValuePartial)
			autoCompleteParameters = autoCompleteParameters + COMMAND_SPLITTING_SYMBOL;

		throw new ContextResponse({
			success: error ? error.success : true,
			message: error ? error.message : this.generateAutocompleteMessage(),
			code: error ? MESSAGE_CODES.ERROR_GENERIC : MESSAGE_CODES.SUCCESS_AUTOCOMPLETE,
			autoCompleteOutput: {
				commands: autoCompleteCommands,
				parameters: autoCompleteParameters,
				all: autoCompleteCommands + autoCompleteParameters,
			},
			info: {
				command,
				parameter,
				contextDepth: this.contextDepth,
			},
		});
	}

	protected buildResponse() {
		const { processedDepth, command, parameter, error, processedInputString } =
			this._processedInput || {};

		if (!error) this.updateCommandHistory(processedInputString);
		processedDepth?.forEach((contextName) => {
			this.changeContext('add', contextName);
		});

		super.buildResponse();

		if (!command) {
			this.sendExecuteSuccessResponse();
		}

		const commandNode = command?.name && this.currentContext?.commands[command.name];
		const { action } = commandNode || {};
		const { name: actionName } = action || {};

		if (!actionName) {
			throw new ContextResponse({
				success: false,
				message: this._translate('ERRORS.ActionNotFound', { command: command?.name }),
				code: MESSAGE_CODES.ERROR_GENERIC_ACTION_NOT_FOUND,
			});
		}

		if (command && command?.name && commandNode && this.isImplicit(commandNode))
			this.implicitActionsHandler(actionName, parameter);

		if (command) this.sendExecuteSuccessResponse();
	}

	protected implicitActionsHandler(actionName: string, parameter?: IProcessedParameter) {
		super.implicitActionsHandler(actionName, parameter);
		switch (actionName) {
			case 'implicitlyExecutePrompt':
				this._processedInput = {
					...this._processedInput,
					error: {
						success: true,
						message: this.__prompt || PROMPT_DEFAULT,
						code: MESSAGE_CODES.SUCCESS_EXECUTE,
					},
				};
				break;
			case 'implicitlySetPromptPrefix':
				this.__cliConfiguration.promptPrefix = parameter?.value || PROMPT_PREFIX;
				this.updatePrompt();
				break;
			case 'implicitlySetPromptSuffix':
				this.__cliConfiguration.promptSuffix = parameter?.value || PROMPT_SUFFIX;
				this.updatePrompt();
				break;
			case 'implicitlySetPromptFormat':
				this.__cliConfiguration.promptFormat =
					(parameter?.value as TPromptFormat) || PROMPT_FORMAT;
				this.updatePrompt();
				break;
			case 'implicitlySetPromptSplittingSymbol':
				this.__cliConfiguration.promptSplittingSymbol =
					parameter?.value || PROMPT_SPLITTING_SYMBOL;
				this.updatePrompt();
				break;
			case 'implicitlyExecuteHelpAction':
				this.implicitlyExecuteHelpAction(parameter);
				break;
		}
	}

	private sendExecuteSuccessResponse() {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { processedDepth, pendingActions, error, command, processedInputString, ...rest } =
			this._processedInput || {};

		throw new ContextResponse({
			success: true,
			message: this._translate('HINTS.ProcessedCommand'),
			code: MESSAGE_CODES.SUCCESS_EXECUTE,
			actions: pendingActions,
			info: {
				...rest,
				contextDepth: this.contextDepth,
				prompt: this.__prompt,
				command: {
					...command,
					name: command?.name || processedInputString,
				},
			},
		});
	}

	private implicitlyExecuteHelpAction(parameter?: IProcessedParameter) {
		const { pendingActions } = this._processedInput || { pendingActions: [] };
		const { name: currentContextName, commands: currentContextCommands } =
			this.currentContext || {};
		const helpResponseValue: string[] = [];

		if (!currentContextCommands) return;

		const helpParameter = parameter?.value;

		if (!helpParameter || helpParameter === '') {
			helpResponseValue.push(
				`Here are the list of all command for context: ${currentContextName}`,
			);
			for (const [key, value] of Object.entries(currentContextCommands)) {
				let description = this._translate(`${key}.description`);
				if (description || !value?.description || value?.example) {
					description = ` - ${description ? description + ' ' : value?.description ? value?.description + ' ' : ''}${value?.example ? value?.example : ''}`;
				}
				helpResponseValue.push(` - ${key}${description ?? ''}`);
			}
		} else {
			// TODO
		}

		let helpPendingAction = pendingActions?.pop();
		if (helpPendingAction) {
			helpPendingAction = {
				...helpPendingAction,
				parameter: {
					...helpPendingAction.parameter,
					value: helpResponseValue.join('\n'),
				},
			};
			pendingActions?.push(helpPendingAction);
		}

		this._processedInput = {
			...this._processedInput,
			pendingActions,
			parameter: {
				...parameter,
				value: helpResponseValue.join('\n'),
			},
		};
	}
}
