import { CONTEXT_NAMES } from '../constants';
import { COMMAND_NAMES } from '../constants';

export const CODE = 'en';

export default {
	[CONTEXT_NAMES.ROOT_CONTEXT]: {
		[COMMAND_NAMES.LIST]: {
			description: 'List some assets',
		},
		[COMMAND_NAMES.UI_SETTINGS]: {
			description: 'Goes to the settings context.',
		},
	},
};
