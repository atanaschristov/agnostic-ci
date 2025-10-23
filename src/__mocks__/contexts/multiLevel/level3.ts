import { CONTEXT_NAMES } from './constants';
import { ICommands, IContextDefinition } from '../../../lib/types';

export const COMMAND_NAMES = {
	LEVEL3_COMMAND1: 'setCommand3',
};
export const ACTION_NAMES = {
	[CONTEXT_NAMES.LEVEL_4]: 'gotoLevel4Context',
};

export default {
	name: CONTEXT_NAMES.LEVEL_3,
	commands: {
		[CONTEXT_NAMES.LEVEL_4]: {
			name: CONTEXT_NAMES.LEVEL_4,
			type: 'context',
			aliases: ['l4'],
			action: {
				name: ACTION_NAMES[CONTEXT_NAMES.LEVEL_4],
			},
		},
	} as ICommands,
} as IContextDefinition;
