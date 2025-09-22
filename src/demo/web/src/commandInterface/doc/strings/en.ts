import { COMMAND_NAMES } from '../constants';

export const STRINGS = {
	ACTIONS: {
		DOCUMENT_NOT_FOUND: 'Document {{}} not found.',
	},
	COMMANDS: {
		[COMMAND_NAMES.DOC]: {
			description: 'Document management context',
			example: 'doc',
		},
		[COMMAND_NAMES.LIST]: {
			description: 'List all documents',
			example: COMMAND_NAMES.LIST,
		},
		[COMMAND_NAMES.SHOW]: {
			description: 'Show a document by ID',
			hint: 'You can find the document ID in the list command',
			example: `${COMMAND_NAMES.SHOW} <documentId>`,
		},
	},
};
