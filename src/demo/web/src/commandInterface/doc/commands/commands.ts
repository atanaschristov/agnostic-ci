import { ICommands } from '../../../../../../lib/types';
import { COMMAND_NAMES } from '../constants';

export default {
	[COMMAND_NAMES.DOC]: {
		name: COMMAND_NAMES.DOC,
		type: 'context',
		aliases: ['m'],
	},
} as ICommands;
