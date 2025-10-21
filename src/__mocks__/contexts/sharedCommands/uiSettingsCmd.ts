import { CONTEXT_NAME } from '../settings/uiSettings';
import { ICommandNode } from '../../../lib/types';

export default {
	name: CONTEXT_NAME,
	type: 'context',
	aliases: ['ui', 'set'],
	isolated: true,
} as ICommandNode;
