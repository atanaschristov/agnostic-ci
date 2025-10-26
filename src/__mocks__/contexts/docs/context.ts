import { ACTION_NAMES, COMMAND_NAMES } from './constants';
import { ICommandActionParameter, ICommandNode, IContextContainer } from '../../../lib/types';

export const ContextEntryCommand = {
	name: COMMAND_NAMES.DOC,
	type: 'context',
	aliases: ['m'],
} as ICommandNode;

export default {
	[COMMAND_NAMES.DOC]: {
		name: COMMAND_NAMES.DOC,
		commands: {
			[COMMAND_NAMES.LIST]: {
				name: COMMAND_NAMES.LIST,
				type: 'command',
				aliases: ['ls'],
				action: {
					name: ACTION_NAMES.LIST,
				},
			} as ICommandNode,
			[COMMAND_NAMES.SHOW]: {
				name: COMMAND_NAMES.SHOW,
				type: 'command',
				action: {
					name: ACTION_NAMES.SHOW,
					parameter: {
						name: 'documentId',
						type: 'string',
						required: false,
						defaultValue: 'index',
						valueFormatLimitation: RegExp(/^[a-zA-Z0-9_-]+$/),
					} as ICommandActionParameter,
				},
			} as ICommandNode,
		},
	},
} as IContextContainer;
