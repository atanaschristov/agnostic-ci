import EN_SHARED_COMMANDS from './sharedCommands/strings/en';
import settings, {
	CONTEXT_NAMES as SETTINGS_CONTEXT_NAMES,
	COMMAND_NAMES as SETTINGS_COMMAND_NAMES,
} from './settings';
import SETTINGS_STRINGS from './settings/strings/';
import { IContextContainer } from '../../lib/types';
import { SHARED_COMMAND_NAMES } from './sharedCommands';
import lobby, {
	CONTEXT_NAMES as LOBBY_CONTEXT_NAMES,
	COMMAND_NAMES as LOBBY_COMMAND_NAMES,
} from './lobby/';
import docs, {
	ACTION_NAMES as DOCUMENTATION_ACTION_NAMES,
	COMMAND_NAMES as DOCUMENTATION_COMMAND_NAMES,
	CONTEXT_NAMES as DOCUMENTATION_CONTEXT_NAMES,
	CONTEXT_STRINGS as DOCUMENTATION_STRINGS,
} from './docs/';
import reader from './ebook/';

import multiLevelContextDefinition, {
	CONTEXT_NAMES as MULTI_LEVEL_CONTEXT_NAMES,
	COMMAND_NAMES as MULTI_LEVEL_COMMAND_NAMES,
	ACTION_NAMES as MULTI_LEVEL_ACTION_NAMES,
} from './multiLevel/';

// TODO iterate through supported languages and merge strings dynamically
export const COMMAND_STRINGS = {
	en: {
		commandsNS: {
			...SETTINGS_STRINGS['en'],
			...EN_SHARED_COMMANDS,
			...DOCUMENTATION_STRINGS?.['en'], // TODO fix access with help command
		},
	},
	cz: {
		commandsNS: {
			...SETTINGS_STRINGS['cz'],
			...DOCUMENTATION_STRINGS?.['cz'],
		},
	},
};

export const CONTEXT_NAMES = {
	DOCUMENTATION: DOCUMENTATION_CONTEXT_NAMES,
	LOBBY: LOBBY_CONTEXT_NAMES,
	SETTINGS: SETTINGS_CONTEXT_NAMES,
	MULTI_LEVEL: MULTI_LEVEL_CONTEXT_NAMES,
};

export const COMMAND_NAMES = {
	DOCUMENTATION: DOCUMENTATION_COMMAND_NAMES,
	LOBBY: LOBBY_COMMAND_NAMES,
	SETTINGS: SETTINGS_COMMAND_NAMES,
	SHARED: SHARED_COMMAND_NAMES,
	MULTI_LEVEL: MULTI_LEVEL_COMMAND_NAMES,
};

export const ACTION_NAMES = {
	DOCUMENTATION: DOCUMENTATION_ACTION_NAMES,
	MULTI_LEVEL: MULTI_LEVEL_ACTION_NAMES,
};

export default {
	...docs,
	...lobby,
	...multiLevelContextDefinition,
	...reader,
	...settings,
} as IContextContainer;
