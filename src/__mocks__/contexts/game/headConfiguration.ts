import { uiSettingsCommand, listCommand } from '../sharedCommands';
import { ICommandAction, ICommandNode, ICommands, IContextDefinition } from '../../../lib/types';

import { CONTEXT_NAME as HAIR_CONTEXT_NAME } from './hairConfiguration';

export const CONTEXT_NAME = 'head';
export const COMMAND_NAMES = {
	HAIR: HAIR_CONTEXT_NAME,
};

const hairCommand = {
	name: COMMAND_NAMES.HAIR,
	type: 'context',
	description: "describe the playable character' hair",
	action: {
		name: 'setHair',
	} as ICommandAction,
} as ICommandNode;

export default {
	name: CONTEXT_NAME,
	commands: {
		[COMMAND_NAMES.HAIR]: hairCommand,
		[uiSettingsCommand.name]: uiSettingsCommand,
		[listCommand.name]: listCommand,
	} as ICommands,
} as IContextDefinition;
