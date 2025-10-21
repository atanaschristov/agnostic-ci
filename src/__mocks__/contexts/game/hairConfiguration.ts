import {
	ICommandAction,
	ICommandActionParameter,
	ICommandNode,
	ICommands,
	IContextDefinition,
} from '../../../lib/types';
import { uiSettingsCommand, listCommand } from '../sharedCommands';

export const CONTEXT_NAME = 'hair';
export const COMMAND_NAMES = {
	COLOR: 'color',
	LENGTH: 'length',
	STYLE: 'style',
};

const color = {
	name: COMMAND_NAMES.COLOR,
	type: 'command',
	aliases: ['c'],
	description: 'set the hair color',
	action: {
		name: 'changeHairColor',
		parameter: {
			type: 'set',
			required: true,
			defaultValue: 'black',
			possibleValues: ['black', 'brown', 'blonde', 'red', 'ginger', 'white', 'grey'],
			valueFormatLimitation: RegExp(/^(black|brown|blonde|red|ginger|white|grey)$/),
		} as ICommandActionParameter,
	} as ICommandAction,
} as ICommandNode;

const length = {
	name: COMMAND_NAMES.LENGTH,
	type: 'command',
	description: 'set the hair length',
	aliases: ['l'],
	action: {
		name: 'changeHairLength',
		parameter: {
			type: 'set',
			required: true,
			defaultValue: 'short',
			possibleValues: ['bald', 'short', 'medium', 'long'],
			valueFormatLimitation: RegExp(/^(bald|short|medium|long)$/),
		},
	} as ICommandAction,
} as ICommandNode;

const style = {
	name: COMMAND_NAMES.STYLE,
	type: 'command',
	description: 'set the hair style',
	aliases: ['stl'],
	action: {
		name: 'changeHairStyle',
		parameter: {
			type: 'set',
			required: true,
			default: 'straight',
			possibleValues: ['straight', 'curly', 'wavy', 'afro'],
			valueFormatLimitation: RegExp(/^(straight|curly|wavy|afro)$/),
		},
	} as ICommandAction,
} as ICommandNode;

export default {
	name: CONTEXT_NAME,
	commands: {
		[color.name]: color,
		[length.name]: length,
		[style.name]: style,
		[uiSettingsCommand.name]: uiSettingsCommand,
		[listCommand.name]: listCommand,
	} as ICommands,
} as IContextDefinition;
