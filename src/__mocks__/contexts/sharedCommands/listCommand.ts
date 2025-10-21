import { ICommandAction, ICommandNode } from '../../../lib/types';

export default {
	name: 'list',
	type: 'command',
	aliases: ['l'], // Just a dummy alias for testing
	action: {
		name: 'listAssetsAction',
	} as ICommandAction,
} as ICommandNode;
