import { ICommandNode, ICommands, IContextDefinition } from '../../../lib/types';
import { CONTEXT_NAME as STYLING_CONTEXT_NAME } from './stylingSettings';

export const CONTEXT_NAME = 'uiSettings';
export const COMMAND_NAMES = {
	STYLING: STYLING_CONTEXT_NAME,
	RESET: 'reset' as const,
};

export default {
	name: CONTEXT_NAME,
	commands: {
		// Example of a context command without an action
		[COMMAND_NAMES.STYLING]: {
			name: COMMAND_NAMES.STYLING,
			type: 'context',
			aliases: ['st'],
		} as ICommandNode,
		// Example of a command without a parameter
		[COMMAND_NAMES.RESET]: {
			name: COMMAND_NAMES.RESET,
			type: 'command',
			aliases: ['rst'],
			action: {
				name: 'resetAction',
			},
		} as ICommandNode,
	} as ICommands,
} as IContextDefinition;
