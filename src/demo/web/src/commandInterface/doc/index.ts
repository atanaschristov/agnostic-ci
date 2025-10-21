import DOC_INTERFACE from './commands';

import { STRINGS } from './strings';
import { ACTIONS } from './actions';

export const ContextContainer = DOC_INTERFACE.CONTEXT;
export const ContextEntryCommands = DOC_INTERFACE.COMMANDS;

export default {
	ACTIONS,
	STRINGS,
	CONTEXTS: DOC_INTERFACE.CONTEXT,
	COMMANDS: DOC_INTERFACE.COMMANDS,
};
