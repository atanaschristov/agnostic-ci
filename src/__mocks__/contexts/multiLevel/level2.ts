import { CONTEXT_NAMES } from './constants';
import {
	ICommandAction,
	ICommandActionParameter,
	ICommandNode,
	ICommands,
	IContextDefinition,
} from '../../../lib/types';

export const COMMAND_NAMES = {
	LEVEL2_COMMAND1: 'setCommand2',
};
export const ACTION_NAMES = {
	[CONTEXT_NAMES.LEVEL_3]: 'gotoLevel3Context',
	[COMMAND_NAMES.LEVEL2_COMMAND1]: 'setCommand2Action',
};

// A command overwriting the internal help command
const HELP = {
	name: 'help',
	type: 'command',
	description: 'dummy overwritten command',
	aliases: ['h'],
	action: {
		name: 'dummyHelpAction',
	} as ICommandAction,
};

export default {
	name: CONTEXT_NAMES.LEVEL_2,
	commands: {
		[HELP.name]: HELP,
		[CONTEXT_NAMES.LEVEL_3]: {
			name: CONTEXT_NAMES.LEVEL_3,
			type: 'context',
			aliases: ['l3'],
			action: {
				name: ACTION_NAMES[CONTEXT_NAMES.LEVEL_3],
			},
		},
		[COMMAND_NAMES.LEVEL2_COMMAND1]: {
			name: COMMAND_NAMES.LEVEL2_COMMAND1,
			type: 'command',
			action: {
				name: ACTION_NAMES[COMMAND_NAMES.LEVEL2_COMMAND1],
				parameter: {
					type: 'set',
					possibleValues: ['valueA', 'valueB', 'valueC', 'someOtherValue'],
					defaultValue: 'valueB',
				} as ICommandActionParameter,
			},
		} as ICommandNode,
	} as ICommands,
} as IContextDefinition;
