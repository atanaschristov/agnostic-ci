import { CONTEXT_NAMES } from './constants';
import { ICommands, IContextDefinition } from '../../../lib/types';

export const COMMAND_NAMES = {
	LEVEL4_COMMAND1: 'someLevel4Command1',
};
export const ACTION_NAMES = {
	[CONTEXT_NAMES.LEVEL_5]: 'gotoLevel5Context',
	[COMMAND_NAMES.LEVEL4_COMMAND1]: 'someLevel4Command1Action',
};

export default {
	name: CONTEXT_NAMES.LEVEL_4,
	commands: {
		[CONTEXT_NAMES.LEVEL_5]: {
			name: CONTEXT_NAMES.LEVEL_5,
			type: 'context',
			aliases: ['l5'],
			action: {
				name: ACTION_NAMES[CONTEXT_NAMES.LEVEL_5],
			},
		},
		[CONTEXT_NAMES.LEVEL_1]: {
			name: CONTEXT_NAMES.LEVEL_1,
			type: 'context',
			aliases: ['l1'],
		},
		[CONTEXT_NAMES.LEVEL_2]: {
			name: CONTEXT_NAMES.LEVEL_2,
			type: 'context',
			aliases: ['l2'],
		},
		[COMMAND_NAMES.LEVEL4_COMMAND1]: {
			name: COMMAND_NAMES.LEVEL4_COMMAND1,
			type: 'command',
			action: {
				name: ACTION_NAMES[COMMAND_NAMES.LEVEL4_COMMAND1],
				parameter: {
					type: 'set',
					possibleValues: ['first', 'second', 'third'],
					defaultValue: 'third',
				},
			},
		},
	} as ICommands,
} as IContextDefinition;
