import {
	ContextContainer as EBookContextContainer,
	ContextEntryCommand as EBookContextEntryCommand,
} from '../../../__mocks__/contexts/ebookInterface';
import { IContextDefinition } from '../../../lib/types';
import {
	ContextContainer as DocContextContainer,
	ContextEntryCommands as DocContextEntryCommands,
} from './commandInterface/doc/';

const InitialContext = {
	name: 'lobby',
	isInitialContext: true,
	commands: {
		[EBookContextEntryCommand.name]: EBookContextEntryCommand,
		...DocContextEntryCommands,
	},
} as IContextDefinition;

export const getSchema = () => {
	return {
		...DocContextContainer,
		...EBookContextContainer,
		[InitialContext.name]: InitialContext,
	};
};

export const prepareStrings = () => {};
