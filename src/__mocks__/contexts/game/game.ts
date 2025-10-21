import { uiSettingsCommand, listCommand } from '../sharedCommands';
import { ICommandNode, ICommands, IContextDefinition } from '../../../lib/types';
import { CONTEXT_NAME as PC_CONTEXT_NAME } from './characterConfiguration';

export const CONTEXT_NAME = 'game';

export const COMMAND_NAMES = {
	UI_SETTINGS: uiSettingsCommand.name,
	LIST: listCommand.name,
	PC: PC_CONTEXT_NAME,
};

export default {
	name: CONTEXT_NAME,
	isInitialContext: true,
	commands: {
		[COMMAND_NAMES.UI_SETTINGS]: uiSettingsCommand,
		[COMMAND_NAMES.LIST]: listCommand,
		[COMMAND_NAMES.PC]: {
			name: COMMAND_NAMES.PC,
			type: 'context',
			description: 'Creates a character',
			action: {
				name: 'gotoPcContext',
			},
		} as ICommandNode,
		commandWithoutAnAction: {
			// Fore testing purposes
			name: 'commandWithoutAnAction',
			type: 'command',
			description: 'dummy command with no name',
			action: {},
		},
		commandWithoutANode: undefined, // Fore testing purposes
	} as ICommands,
} as IContextDefinition;
