import { ICommandNode } from '../../../lib/types';

export default {
	name: 'exit',
	type: 'context',
	isolated: true,
	description: 'Goes back to the root.',
	aliases: ['exit', 'ex'],
} as ICommandNode;
