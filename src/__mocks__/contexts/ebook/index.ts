import {
	ICommandAction,
	ICommandActionParameter,
	ICommandNode,
	ICommands,
	IContextContainer,
	IContextDefinition,
} from '../../../lib/types';
import { COMMAND_NAMES, ENTRY_COMMAND } from './constants';

import { AVAILABLE_BOOKS } from '../../data/ebook/ebookInterface';
import { generateContextCommands, generateContexts } from '../../helpers';

const BookCommands = {
	[COMMAND_NAMES.GOTO_PAGE]: {
		name: COMMAND_NAMES.GOTO_PAGE,
		type: 'command',
		aliases: ['='],
		action: {
			name: 'actionGoToPage',
			parameter: {
				type: 'number',
				required: true,
				valueFormatLimitation: /^[1-9]\d*$/,
			} as ICommandActionParameter,
		} as ICommandAction,
	} as ICommandNode,
	[COMMAND_NAMES.NEXT_PAGE]: {
		name: COMMAND_NAMES.NEXT_PAGE,
		type: 'command',
		aliases: ['>'],
		action: {
			name: 'actionNextPage',
		} as ICommandAction,
	} as ICommandNode,
	[COMMAND_NAMES.PREV_PAGE]: {
		name: COMMAND_NAMES.PREV_PAGE,
		type: 'command',
		aliases: ['<'],
		action: {
			name: 'actionNextPage',
		} as ICommandAction,
	} as ICommandNode,
} as ICommands;

const BookEntryCommands: ICommands = generateContextCommands(AVAILABLE_BOOKS);

const BookContexts: IContextContainer = generateContexts(AVAILABLE_BOOKS, BookCommands);

const ReaderContext = {
	name: ENTRY_COMMAND,
	commands: BookEntryCommands,
} as IContextDefinition;

export const ContextEntryCommand = {
	name: ENTRY_COMMAND,
	type: 'context',
} as ICommandNode;

export default {
	[ENTRY_COMMAND]: ReaderContext,
	...BookContexts,
} as IContextContainer;
