import { COMMAND_NAMES } from './constants';
import type { ICommandAction, ICommandNode, ICommands, IContextDefinition } from '../types';

export const CLI_IMPLICIT_COMMANDS = {
	[COMMAND_NAMES.HELP]: {
		name: COMMAND_NAMES.HELP,
		type: 'help',
		example: 'h',
		aliases: ['h', '?'],
		action: {
			name: 'implicitlyExecuteHelpAction',
			parameter: {
				type: 'string',
			},
		} as ICommandAction,
	} as ICommandNode,
} as ICommands;

export const IMPLICIT_COMMANDS = {
	[COMMAND_NAMES.BACK]: {
		name: COMMAND_NAMES.BACK,
		type: 'command',
		example: 'b',
		aliases: ['b'],
		action: {
			name: 'implicitlyExecuteBackAction',
			parameter: {
				type: 'number',
				hint: 'A numeric value is required',
				valueFormatLimitation: RegExp(/^\d+$/),
			},
		} as ICommandAction,
	} as ICommandNode,
	[COMMAND_NAMES.CONFIG]: {
		name: COMMAND_NAMES.CONFIG,
		type: 'context',
		aliases: ['cfg'],
	},
} as ICommands;

export const ConfigContextManagerCommands: ICommands = {
	...IMPLICIT_COMMANDS,
	[COMMAND_NAMES.LANG]: {
		name: COMMAND_NAMES.LANG,
		type: 'command',
		example: 'lang en-US',
		action: {
			name: 'implicitlySetLanguageAction',
			parameter: {
				type: 'string',
				required: true,
				defaultValue: 'en',
				valueFormatLimitation: RegExp(/^[a-z]{2,3}(-[A-Z]{2,3})?$/),
			},
		} as ICommandAction,
	},
};

export const CliConfigContextManagerCommands: ICommands = {
	...ConfigContextManagerCommands,
	...CLI_IMPLICIT_COMMANDS,
	[COMMAND_NAMES.PROMPT_PREFIX]: {
		name: COMMAND_NAMES.PROMPT_PREFIX,
		type: 'command',
		// example: 'promptPrefix $',
		action: {
			name: 'implicitlySetPromptPrefix',
			parameter: {
				type: 'string',
				valueFormatLimitation: RegExp(/^.+$/),
			},
		} as ICommandAction,
	} as ICommandNode,
	[COMMAND_NAMES.PROMPT_SUFFIX]: {
		name: COMMAND_NAMES.PROMPT_SUFFIX,
		type: 'command',
		example: 'promptSuffix $',
		action: {
			name: 'implicitlySetPromptSuffix',
			parameter: {
				type: 'string',
				required: true,
				defaultValue: '>',
				valueFormatLimitation: RegExp(/^.+$/),
			},
		} as ICommandAction,
	} as ICommandNode,
	[COMMAND_NAMES.PROMPT_FORMAT]: {
		name: COMMAND_NAMES.PROMPT_FORMAT,
		type: 'command',
		example: 'promptFormat {prefix} {context} {command} {parameter}',
		action: {
			name: 'implicitlySetPromptFormat',
			parameter: {
				type: 'set',
				required: true,
				possibleValues: ['basic', 'normal', 'full'],
				defaultValue: 'normal',
			},
		} as ICommandAction,
	} as ICommandNode,
	[COMMAND_NAMES.PROMPT]: {
		name: COMMAND_NAMES.PROMPT,
		type: 'command',
		example: 'prompt',
		action: {
			name: 'implicitlyExecutePrompt',
		} as ICommandAction,
	} as ICommandNode,
	[COMMAND_NAMES.PROMPT_SPLITTING_SYMBOL]: {
		name: COMMAND_NAMES.PROMPT_SPLITTING_SYMBOL,
		type: 'command',
		example: `${COMMAND_NAMES.PROMPT_SPLITTING_SYMBOL} /`,
		action: {
			name: 'implicitlySetPromptSplittingSymbol',
			parameter: {
				type: 'string',
				required: true,
				defaultValue: '/',
			},
		},
	},
};

export const ContextManagerConfiguration = {
	name: 'config',
	commands: ConfigContextManagerCommands,
} as IContextDefinition;

// TODO the config command should be excluded from the config context
export const CliContextManagerConfiguration = {
	name: 'config',
	commands: CliConfigContextManagerCommands,
} as IContextDefinition;

export const IMPLICIT_CONTEXTS = {
	[ContextManagerConfiguration.name]: ContextManagerConfiguration,
};

export const CLI_IMPLICIT_CONTEXTS = {
	[CliContextManagerConfiguration.name]: CliContextManagerConfiguration,
};
