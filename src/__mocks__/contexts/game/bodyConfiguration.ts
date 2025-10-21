import { ICommandNode, ICommands, IContextDefinition } from '../../../lib/types';
import { uiSettingsCommand, listCommand } from '../sharedCommands';
import { CONTEXT_NAME as HEAD_CONTEXT_NAME } from './headConfiguration';
// import { CONTEXT_NAME as ROOT_CONTEXT_NAME } from './root';

export const CONTEXT_NAME = 'body';
export const COMMAND_NAMES = {
	// ROOT: ROOT_CONTEXT_NAME,
	HEAD: HEAD_CONTEXT_NAME,
	HEIGHT: 'height',
}; // TODO
const ROOT_CONTEXT = 'game';

export default {
	name: CONTEXT_NAME,
	commands: {
		[ROOT_CONTEXT]: {
			name: ROOT_CONTEXT,
			type: 'context',
			description: `Giveing access to the ${ROOT_CONTEXT} context`,
		},
		[COMMAND_NAMES.HEAD]: {
			name: COMMAND_NAMES.HEAD,
			type: 'context',
			description: "Describe the character's head",
			aliases: ['hd'],
		} as ICommandNode,
		[COMMAND_NAMES.HEIGHT]: {
			name: COMMAND_NAMES.HEIGHT,
			type: 'command',
			description: 'Change the height in centimeters',
			aliases: ['ht'],
			action: {
				name: 'changeBodyHeight',
				parameter: {
					type: 'number',
					required: true,
					defaultValue: '165',
				},
			},
		} as ICommandNode,
		[uiSettingsCommand.name]: uiSettingsCommand,
		[listCommand.name]: listCommand,
	} as ICommands,
} as IContextDefinition;
