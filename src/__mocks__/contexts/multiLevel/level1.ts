import { ICommandActionParameter, ICommands, IContextDefinition } from '../../../lib/types';
import { CONTEXT_NAMES } from './constants';

export const COMMAND_NAMES = {
	LEVEL1_COMMAND1: 'setCommand1',
};
export const ACTION_NAMES = {
	[CONTEXT_NAMES.LEVEL_2]: 'gotoLevel2Context',
	[CONTEXT_NAMES.LEVEL_4]: 'gotoLevel4Context',
	[COMMAND_NAMES.LEVEL1_COMMAND1]: 'setCommand1Action',
};

export default {
	name: CONTEXT_NAMES.LEVEL_1,
	commands: {
		[CONTEXT_NAMES.LEVEL_4]: {
			name: CONTEXT_NAMES.LEVEL_4,
			type: 'context',
			aliases: ['l4'],
			action: {
				name: ACTION_NAMES[CONTEXT_NAMES.LEVEL_4],
			},
		},
		[CONTEXT_NAMES.LEVEL_2]: {
			name: CONTEXT_NAMES.LEVEL_2,
			type: 'context',
			aliases: ['l2'],
			action: {
				name: ACTION_NAMES[CONTEXT_NAMES.LEVEL_2],
			},
		},
		[COMMAND_NAMES.LEVEL1_COMMAND1]: {
			name: COMMAND_NAMES.LEVEL1_COMMAND1,
			type: 'command',
			action: {
				name: ACTION_NAMES[COMMAND_NAMES.LEVEL1_COMMAND1],
				parameter: {
					type: 'set',
					possibleValues: ['value1', 'value2', 'value3', 'someOtherValue'],
					required: true,
				} as ICommandActionParameter,
			},
		},
	} as ICommands,
} as IContextDefinition;
