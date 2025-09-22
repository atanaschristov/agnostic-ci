import DOC_INTERFACE from './commands';

import { STRINGS } from './strings';
import { ACTIONS } from './actions';
import { IContextContainer } from '../../../../../lib/types';

export default {
	ACTIONS,
	STRINGS,
	CONTEXTS: DOC_INTERFACE.CONTEXT as IContextContainer,
	COMMANDS: DOC_INTERFACE.COMMANDS,
};
