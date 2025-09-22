import { COMMAND_NAMES } from '../constants';
export const CODE = 'cz';
export const STRINGS = {
	[COMMAND_NAMES.HELP]: {
		description:
			'Zobrazí popis, nápovědu a použití pro každý příkaz dostupný v aktuálním kontextu. Zobrazí tyto informace pro jeden příkaz nebo skupinu příkazů. Aliasy: (h)',
		hint: 'help <|command>',
	},
	[COMMAND_NAMES.BACK]: {
		description: 'Vraťte se k předchozímu kontextu. Aliasy: (b)',
		hint: "Použijte 'back' nebo 'b'",
	},
	[COMMAND_NAMES.CONFIG]: {
		description: 'CLI Manager konfigurace',
	},
	[COMMAND_NAMES.LANG]: {
		description: 'Sets the language',
		hint: 'Use lang <languageCode | languageCode-country>',
		parameterHint: 'Language or language code (e.g. en, de or en-US, de-CH)',
	},
	[COMMAND_NAMES.PROMPT]: {
		description: 'Shows what is the current prompt',
	},
	[COMMAND_NAMES.PROMPT_PREFIX]: {
		description: 'Sets the prompt prefix for the CLI',
		parameterHint: 'Enter a string to set as the prompt prefix',
	},
	[COMMAND_NAMES.PROMPT_SUFFIX]: {
		description: 'Sets the prompt suffix for the CLI',
		parameterHint: 'Enter a string to set as the prompt suffix',
	},
	[COMMAND_NAMES.PROMPT_FORMAT]: {
		description: 'Sets the prompt format for the CLI',
		parameterHint: 'Enter a string to set as the prompt format',
	},
	[COMMAND_NAMES.PROMPT_SPLITTING_SYMBOL]: {
		description:
			'Sets the prompt splitting symbol. It is used as a delimiter between the contexts in the prompt',
		parameterHint: 'Enter a string to set as the prompt format',
	},
};
