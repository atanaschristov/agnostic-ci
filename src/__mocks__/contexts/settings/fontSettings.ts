import { ICommandNode, ICommands, IContextDefinition } from '../../../lib/types';

export const CONTEXT_NAME = 'fonts' as const;
export const COMMAND_NAMES = {
	FONT_SIZE: 'fontSize' as const,
	FONT_STYLE: 'fontStyle' as const,
	RESET: 'reset' as const,
};

export default {
	name: CONTEXT_NAME,
	commands: {
		// Example of a command with a REQUIRED numeric param WITH a default value
		[COMMAND_NAMES.FONT_SIZE]: {
			name: COMMAND_NAMES.FONT_SIZE,
			type: 'command',
			aliases: ['fs'],
			action: {
				name: 'changeUIFontSize',
				parameter: {
					type: 'number',
					required: true,
					default: '12',
				},
			},
		} as ICommandNode,
		// Example of a command with a REQUIRED string param WITHOUT a default value
		[COMMAND_NAMES.FONT_STYLE]: {
			name: COMMAND_NAMES.FONT_STYLE,
			type: 'command',
			aliases: ['fst'],
			action: {
				name: 'changeUIFontStyle',
				parameter: {
					type: 'string',
					required: true,
				},
			},
		} as ICommandNode,
		// Example of command existing in the parrent context with the same name and alias
		[COMMAND_NAMES.RESET]: {
			name: COMMAND_NAMES.RESET,
			type: 'command',
			description: 'FALLBACK: Resets all fonts settings',
			aliases: ['rst'],
			action: {
				name: 'resetFontsAction',
			},
		} as ICommandNode,
	} as ICommands,
} as IContextDefinition;
