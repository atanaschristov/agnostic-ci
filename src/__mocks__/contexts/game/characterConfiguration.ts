import { listCommand, uiSettingsCommand } from '../sharedCommands';
import {
	IActionResponseParameter,
	ICommandAction,
	ICommandNode,
	ICommands,
	IContextDefinition,
} from '../../../lib/types';
import { CONTEXT_NAME as BODY_CONTEXT_NAME } from './bodyConfiguration';

const help = {
	name: 'help',
	type: 'command',
	description: 'dummy overwritten command',
	aliases: ['h'],
	action: {
		name: 'dummyHelpAction',
	} as ICommandAction,
};

export const CONTEXT_NAME = 'character';
export const COMMAND_NAMES = {
	BODY: BODY_CONTEXT_NAME,
	FIRST_NAME: 'firstname',
	LAST_NAME: 'lastname',
	AGE: 'age',
};

export default {
	name: CONTEXT_NAME,
	description: 'provides context and commands about playable character configuration',
	commands: {
		[help.name]: help,
		[COMMAND_NAMES.FIRST_NAME]: {
			name: COMMAND_NAMES.FIRST_NAME,
			type: 'command',
			description: 'Set the first name',
			hint: `${COMMAND_NAMES.FIRST_NAME}(fn) <string | random>`,
			example: 'fn Tom',
			aliases: ['fn'],
			action: {
				name: 'changeFirstName',
				parameter: {
					type: 'string',
					required: true,
					hint: 'Enter a name or "random" to generate one',
					description: 'The first name of the playable character',
					example: 'fn Tom',
					defaultValue: 'random',
					valueFormatLimitation: RegExp(/^[a-zA-Z]{3,}$/),
				} as IActionResponseParameter,
			} as ICommandAction,
		} as ICommandNode,
		[COMMAND_NAMES.LAST_NAME]: {
			name: COMMAND_NAMES.LAST_NAME,
			type: 'command',
			description: 'Set the last name',
			example: 'ln Doe',
			aliases: ['ln'],
			action: {
				name: 'changeLastName',
				parameter: {
					type: 'string',
					required: true,
					possibleValues: ['random', 'Doe', 'Smith'],
					hint: 'Enter a name or "random" to generate one',
					defaultValue: 'random',
					valueFormatLimitation: RegExp(/^[a-zA-Z]{3,}$/),
				} as IActionResponseParameter,
			} as ICommandAction,
		} as ICommandNode,
		[COMMAND_NAMES.AGE]: {
			name: COMMAND_NAMES.AGE,
			type: 'command',
			description: 'Sets the age of the playable character.',
			hint: `${COMMAND_NAMES.AGE} <number bigger then 18>`,
			example: `${COMMAND_NAMES.AGE} 99`,
			aliases: ['a'],
			action: {
				name: 'changeAge',
				parameter: {
					type: 'number',
					required: true,
					hint: 'The value must be numeric and at least 18',
					valueFormatLimitation: RegExp(/^([1][8-9]|[2-9][0-9]|[1-9]\d{2,})$/), // 18 or older
				} as IActionResponseParameter,
			} as ICommandAction,
		} as ICommandNode,
		[COMMAND_NAMES.BODY]: {
			name: COMMAND_NAMES.BODY,
			type: 'context',
			description: 'allows defining what is the body of the character',
			aliases: ['b'],
			action: {
				name: 'gotoBodyContext',
			} as ICommandAction,
		} as ICommandNode,
		[uiSettingsCommand.name]: uiSettingsCommand,
		[listCommand.name]: listCommand,
	} as ICommands,
} as IContextDefinition;
