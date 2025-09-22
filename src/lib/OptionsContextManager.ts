import { MESSAGE_CODES } from './constants';
import { ContextManagerBase, IContextConfiguration } from './ContextManagerBase';
import { ContextResponse } from './ContextResponse';
import {
	ICommandAction,
	ICommandActionParameter,
	ICommandNode,
	IContextContainer,
	IResponse,
} from './types';

interface ITreeContextConfiguration extends IContextConfiguration {
	optionsFormat?: string;
	optionsPrefix?: string;
	optionsSuffix?: string;
}

interface ICommandInput {
	command: string;
	argument?: string;
}

export class OptionsContextManager extends ContextManagerBase {
	private static __optionsInstance__?: OptionsContextManager;
	private __treeContextConfiguration: ITreeContextConfiguration = {};

	constructor() {
		if (OptionsContextManager.__optionsInstance__) {
			return OptionsContextManager.__optionsInstance__;
		}

		super();
		this.__treeContextConfiguration = {
			...this._configuration,
		};

		OptionsContextManager.__optionsInstance__ = this;
	}

	initialize(
		contextContainer: IContextContainer,
		locales?: Record<string, any>,
		language?: string,
	): void {
		this.addImplicitGlobalCommands(contextContainer, {}); // TreeContextManager specific implicit commands
		super.initialize(contextContainer, locales, language);

		this.__treeContextConfiguration = {
			...this.__treeContextConfiguration,
			...this._configuration,
		};
	}

	getCurrentContextCommands(): Array<string> {
		return Object.keys(this.currentContext?.commands || {}) || [];
	}

	getParametersInfo(command?: string): ICommandActionParameter | undefined {
		const { action } = this.currentContext?.commands?.[command || ''] || {};

		if (!action) return;

		return action.parameter;
	}

	requiresParameter(command?: string): boolean {
		if (!command) return false;

		const { action } = this.currentContext?.commands[command] || {};
		const { parameter } = action || {};

		return !!parameter && this.requireParameterSpecialCases(action);
	}

	send({ command, argument }: ICommandInput) {
		try {
			this.resetProcessedInput();
			this.analyzeInput(command, argument);
			this.buildResponse();
		} catch (response) {
			this._response = response as IResponse;
		}
	}

	protected buildResponse() {
		const { processedDepth, command, parameter, error, pendingActions, ...rest } =
			this._processedInput || {};

		processedDepth?.forEach((contextName) => {
			this.changeContext('add', contextName);
		});

		super.buildResponse();

		const commandAction = pendingActions?.[pendingActions.length - 1];
		if (commandAction) {
			commandAction.parameter = parameter;
		}

		const commandNode = command?.name && this.currentContext?.commands[command.name];
		const { action } = commandNode || {};
		const { name: actionName } = action || {};

		if (actionName && command?.name && commandNode && this.isImplicit(commandNode)) {
			this.implicitActionsHandler(actionName, parameter);
		}

		throw new ContextResponse({
			success: error?.success || true,
			message: error?.message || this._translate('HINTS.ProcessedCommand'),
			code: MESSAGE_CODES.SUCCESS_EXECUTE,
			actions: pendingActions,
			info: {
				...rest,
				contextDepth: this.contextDepth,
				command,
				parameter,
			},
		});
	}

	private analyzeInput(command: string, argument?: string) {
		const { processedDepth, pendingActions } = this._processedInput || {};
		const commandNode = this.getCommandNode(command);

		if (!commandNode) {
			this._processedInput = {
				...this._processedInput,
				error: {
					success: false,
					message: this._translate('HINTS.NodeNotFound', {
						command,
						context: this.currentContext?.name || '',
					}),
					code: MESSAGE_CODES.ERROR_NODE_NOTFOUND,
				},
			};
			return;
		}

		if (commandNode.action) pendingActions?.push({ ...commandNode.action });

		const { aliases, action, type, ...commandMeta } = commandNode || {};
		if (commandNode.type === 'context') {
			processedDepth?.push(commandNode.name);
			this._processedInput = {
				...this._processedInput,
				pendingActions,
				processedDepth,
				command: commandMeta,
			};
		} else {
			this._processedInput = {
				...this._processedInput,
				pendingActions,
				command: commandMeta,
			};
		}

		this.analyzeArgument(commandNode, argument);
	}

	private analyzeArgument(commandNode: ICommandNode, argument?: string) {
		const { parameter: actionParameter } = commandNode?.action || {};
		const { pendingActions } = this._processedInput || {};

		// NOTE: due to the nature of the interface, every command would have only one pending action
		// const acton = pendingActions?.pop();
		// const { parameter: actionParameter } = acton || {}
		if (!actionParameter) return;

		const { required, defaultValue, valueFormatLimitation, type } = actionParameter;

		if (!argument && required && !defaultValue) {
			this._processedInput = {
				...this.generateErrorMessage(
					`${this._translate('ERRORS.MissingParameter')}`,
					MESSAGE_CODES.ERROR_MISSING_PARAMETER,
				),
				...{ command: { name: commandNode.name } },
			};
			return;
		}

		if (argument && !valueFormatLimitation?.test(argument)) {
			this._processedInput = {
				...this.generateErrorMessage(
					`${this._translate('ERRORS.InvalidFormat', {
						value: argument,
						command: commandNode.name,
					})}${actionParameter?.hint ? ' ' + actionParameter.hint : ''}`,
					MESSAGE_CODES.ERROR_INVALID_FORMAT,
				),
				// ...{ command: { name: commandNode.name } },
			};
			return;
		}

		if (type === 'set') {
		} else {
			const value = argument || defaultValue;
			this._processedInput = {
				...this._processedInput,
				pendingActions,
				parameter: this.prepareParameterStructure(value, actionParameter),
			};
		}
	}

	private requireParameterSpecialCases(action?: ICommandAction): boolean {
		const { name } = action || {};

		return name !== 'implicitlyExecuteBackAction';
	}
}
