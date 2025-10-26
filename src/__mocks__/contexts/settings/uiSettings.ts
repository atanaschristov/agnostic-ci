import { ICommandNode, ICommands, IContextDefinition } from '../../../lib/types';
import { CONTEXT_NAME as STYLING_CONTEXT_NAME } from './stylingSettings';

export const CONTEXT_NAME = 'uiSettings' as const;
export const COMMAND_NAMES = {
	UI_SETTINGS_STYLING: STYLING_CONTEXT_NAME,
	UI_SETTINGS_RESET: 'reset' as const,
};

export default {
	name: CONTEXT_NAME,
	commands: {
		// Example of a context command without an action
		[COMMAND_NAMES.UI_SETTINGS_STYLING]: {
			name: COMMAND_NAMES.UI_SETTINGS_STYLING,
			type: 'context',
			aliases: ['st'],
		} as ICommandNode,
		// Example of a command without a parameter
		[COMMAND_NAMES.UI_SETTINGS_RESET]: {
			name: COMMAND_NAMES.UI_SETTINGS_RESET,
			type: 'command',
			aliases: ['rst'],
			action: {
				name: 'resetAction',
			},
		} as ICommandNode,
	} as ICommands,
} as IContextDefinition;
