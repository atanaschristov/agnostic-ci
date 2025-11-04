export const ACTION_NAMES = {
	DOC_ENTRY: 'documentationEntryAction' as const,
	LIST: 'listDocumentsAction' as const,
	SHOW: 'showDocumentAction' as const,
};

export const COMMAND_NAMES = {
	DOC: 'documentation' as const,
	LIST: 'list' as const,
	SHOW: 'show' as const,
};

export const CONTEXT_NAMES = {
	DOC_CONTEXT: COMMAND_NAMES.DOC,
};

export const STRINGS_DOMAIN = 'DocumentationContext';

export const SUPPORTED_LANGUAGES = {
	EN: 'en',
};
