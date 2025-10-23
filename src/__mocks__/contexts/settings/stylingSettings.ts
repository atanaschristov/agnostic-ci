import { ICommandAction, ICommandNode, ICommands, IContextDefinition } from '../../../lib/types';
import { CONTEXT_NAME as FONTS_CONTEXT_NAME } from './fontSettings';

export const CONTEXT_NAME = 'styling';
export const COMMAND_NAMES = {
	FONTS: FONTS_CONTEXT_NAME,
	THEME: 'theme' as const,
};

export default {
	name: 'styling',
	commands: {
		// Example of a context command with an action, with parameters
		// TODO implement context commands with an action supporting parameters
		[COMMAND_NAMES.FONTS]: {
			name: COMMAND_NAMES.FONTS,
			type: 'context',
			aliases: ['f'],
			action: {
				name: 'doSomethingOnGoingToContext',
				// TODO unable to pass a parameter with the context's action
				parameter: {
					type: 'boolean',
					required: true,
					default: false,
				},
			},
		} as ICommandNode,
		// Example of a command with a required param of type with a default value
		[COMMAND_NAMES.THEME]: {
			name: COMMAND_NAMES.THEME,
			type: 'command',
			aliases: ['t'],
			action: {
				name: 'changeUITheme',
				parameter: {
					type: 'set',
					required: true,
					default: 'system',
					possibleValues: ['dark', 'light', 'system'],
				},
			} as ICommandAction,
		} as ICommandNode,
	} as ICommands,
} as IContextDefinition;
