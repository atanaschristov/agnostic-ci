import { CONTEXT_NAMES } from './constants';
import { ICommandNode, IContextContainer } from '../../../lib/types';
import level1Context, {
	ACTION_NAMES as LEVEL1_ACTION_NAMES,
	COMMAND_NAMES as LEVEL1_COMMAND_NAMES,
} from './level1';
import level2Context, {
	ACTION_NAMES as LEVEL2_ACTION_NAMES,
	COMMAND_NAMES as LEVEL2_COMMAND_NAMES,
} from './level2';
import level3Context, {
	ACTION_NAMES as LEVEL3_ACTION_NAMES,
	COMMAND_NAMES as LEVEL3_COMMAND_NAMES,
} from './level3';
import level4Context, {
	ACTION_NAMES as LEVEL4_ACTION_NAMES,
	COMMAND_NAMES as LEVEL4_COMMAND_NAMES,
} from './level4';
import level5Context, {
	COMMAND_NAMES as LEVEL5_COMMAND_NAMES,
	ACTION_NAMES as LEVEL5_ACTION_NAMES,
} from './level5';

const ENTRY_COMMAND_ACTION = 'goToLevel1Action';

export const ACTION_NAMES = {
	[CONTEXT_NAMES.LEVEL_1]: ENTRY_COMMAND_ACTION,
	...LEVEL1_ACTION_NAMES,
	...LEVEL2_ACTION_NAMES,
	...LEVEL3_ACTION_NAMES,
	...LEVEL4_ACTION_NAMES,
	...LEVEL5_ACTION_NAMES,
};

export const COMMAND_NAMES = {
	...LEVEL1_COMMAND_NAMES,
	...LEVEL2_COMMAND_NAMES,
	...LEVEL3_COMMAND_NAMES,
	...LEVEL4_COMMAND_NAMES,
	...LEVEL5_COMMAND_NAMES,
};

export { CONTEXT_NAMES } from './constants';

export const EntryCommand = {
	name: CONTEXT_NAMES.LEVEL_1,
	type: 'context',
	aliases: ['l1'],
	action: {
		name: ENTRY_COMMAND_ACTION,
	},
} as ICommandNode;

export default {
	[CONTEXT_NAMES.LEVEL_1]: level1Context,
	[CONTEXT_NAMES.LEVEL_2]: level2Context,
	[CONTEXT_NAMES.LEVEL_3]: level3Context,
	[CONTEXT_NAMES.LEVEL_4]: level4Context,
	[CONTEXT_NAMES.LEVEL_5]: level5Context,
} as IContextContainer;
