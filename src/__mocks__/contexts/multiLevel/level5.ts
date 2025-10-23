import { CONTEXT_NAMES } from './constants';
import { ICommandActionParameter, ICommands, IContextDefinition } from '../../../lib/types';

export const COMMAND_NAMES = {
	LEVEL5_COMMAND1: 'level5UpperCaseCommand1',
	LEVEL5_COMMAND2: 'level5DigitalRequiredCommand2',
};
export const ACTION_NAMES = {
	[COMMAND_NAMES.LEVEL5_COMMAND1]: 'level5Command1Action',
	[COMMAND_NAMES.LEVEL5_COMMAND2]: 'someLevel5Command2Action',
};

export default {
	name: CONTEXT_NAMES.LEVEL_5,
	commands: {
		[CONTEXT_NAMES.LEVEL_1]: {
			name: CONTEXT_NAMES.LEVEL_1,
			type: 'context',
		},
		[CONTEXT_NAMES.LEVEL_2]: {
			name: CONTEXT_NAMES.LEVEL_2,
			type: 'context',
		},
		[COMMAND_NAMES.LEVEL5_COMMAND1]: {
			name: COMMAND_NAMES.LEVEL5_COMMAND1,
			type: 'command',
			action: {
				name: ACTION_NAMES[COMMAND_NAMES.LEVEL5_COMMAND1],
				parameter: {
					type: 'string',
					valueFormatLimitation: RegExp('^[A-Z]+$'), // only uppercase letters
				} as ICommandActionParameter,
			},
		},
		[COMMAND_NAMES.LEVEL5_COMMAND2]: {
			name: COMMAND_NAMES.LEVEL5_COMMAND2,
			type: 'command',
			action: {
				name: ACTION_NAMES[COMMAND_NAMES.LEVEL5_COMMAND2],
				parameter: {
					type: 'number',
					required: true,
					valueFormatLimitation: RegExp(/^([3][2-9]|[4-9][0-9]|[1-9]\d{2,})$/), // 32 or bigger
				} as ICommandActionParameter,
			},
		},
	} as ICommands,
} as IContextDefinition;
