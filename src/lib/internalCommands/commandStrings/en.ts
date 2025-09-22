import { COMMAND_NAMES } from '../constants';
export const CODE = 'en';
export const STRINGS = {
	[COMMAND_NAMES.HELP]: {
		description:
			'Lists the description, hint and usage for each command available in the current context. It displays this info for a single command or group of commands. Aliases: (h)',
		hint: 'help <|command>',
	},
	[COMMAND_NAMES.BACK]: {
		description: 'Go back to the previous context. Aliases: (b)',
		hint: 'Use back or b',
	},
	[COMMAND_NAMES.CONFIG]: {
		description: 'CommandManager configuration',
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
